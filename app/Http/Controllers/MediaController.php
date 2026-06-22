<?php

namespace App\Http\Controllers;

use App\Models\MediaItem;
use App\Models\User;
use App\Services\StorageConfigService;
use App\Services\DynamicStorageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
class MediaController extends Controller
{
    public function index()
    {
        try {
            // Ensure storage is properly configured
            DynamicStorageService::configureDynamicDisks();
            
            $user = auth()->user();
            
            // Get current storage type to filter media
            $currentStorageType = getSetting('storage_type', 'local');
            $allowedDisks = $this->getAllowedDisksForStorageType($currentStorageType);
            
            // Use raw query to get media with proper null handling
            $mediaItems = MediaItem::with(['media' => function($query) use ($allowedDisks) {
                $query->select('*')
                      ->whereNotNull('id')
                      ->whereIn('disk', $allowedDisks); // Filter by storage type
            }])->latest()->get();
            
            $media = collect();
            
            foreach ($mediaItems as $item) {
                try {
                    // Get media from both collections (old 'files' and new 'images')
                    $mediaCollection = $item->getMedia('files')->merge($item->getMedia('images'));
                    
                    // Filter by storage type
                    $mediaCollection = $mediaCollection->whereIn('disk', $allowedDisks);
                    
                    // Apply user-based filtering
                    if ($user->type === 'superadmin') {
                        // SuperAdmin can see all media
                    } elseif ($user->hasPermissionTo('manage-any-media')) {
                        $staffIds = User::where('created_by', $user->id)->pluck('id')->toArray();
                        $staffIds = array_merge([$user->id], $staffIds);
                        $mediaCollection = $mediaCollection->whereIn('user_id', $staffIds);
                    } else {
                        // Others can only see their own media
                        $mediaCollection = $mediaCollection->where('user_id', $user->id);
                    }
                    
                    foreach ($mediaCollection as $mediaItem) {
                        try {
                            // Skip invalid media items
                            if (!$mediaItem || !$mediaItem->exists || !$mediaItem->id) {
                                continue;
                            }
                            
                            // Fix null array attributes before processing
                            $this->fixMediaAttributes($mediaItem);
                            
                            // Ensure all storage disks are configured for URL generation
                            DynamicStorageService::configureDynamicDisks();
                            
                            // Get URL based on the media's disk - ensure proper cloud URL generation
                            $originalUrl = $this->getCloudStorageUrl($mediaItem);
                            $thumbUrl = $originalUrl;
                            
                            // Try to get thumbnail URL
                            try {
                                if ($mediaItem->hasGeneratedConversion('thumb')) {
                                    $thumbUrl = $this->getCloudStorageUrl($mediaItem, 'thumb');
                                }
                            } catch (\Exception $e) {
                                // If thumb conversion fails, use original
                            }
                            
                            $media->push([
                                'id' => $mediaItem->id,
                                'name' => $mediaItem->name ?? '',
                                'file_name' => $mediaItem->file_name ?? '',
                                'url' => $originalUrl,
                                'thumb_url' => $thumbUrl,
                                'size' => $mediaItem->size ?? 0,
                                'mime_type' => $mediaItem->mime_type ?? '',
                                'user_id' => $mediaItem->user_id ?? null,
                                'created_at' => $mediaItem->created_at,
                            ]);
                            
                        } catch (\Exception $e) {
                            continue;
                        }
                    }
                } catch (\Exception $e) {
                    continue;
                }
            }
            
            return response()->json($media->values());
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to load media',
                'message' => 'There was an error loading the media library. Please try refreshing the page.'
            ], 500);
        }
    }
    
    /**
     * Fix null array attributes in media model
     */
    private function fixMediaAttributes($media)
    {
        // Fix null array attributes that cause array_key_exists errors
        if ($media->custom_properties === null) {
            $media->custom_properties = [];
        }
        if ($media->generated_conversions === null) {
            $media->generated_conversions = [];
        }
        if ($media->manipulations === null) {
            $media->manipulations = [];
        }
        if ($media->responsive_images === null) {
            $media->responsive_images = [];
        }
        
        // Ensure arrays are actually arrays, not strings
        if (is_string($media->custom_properties)) {
            $media->custom_properties = json_decode($media->custom_properties, true) ?: [];
        }
        if (is_string($media->generated_conversions)) {
            $media->generated_conversions = json_decode($media->generated_conversions, true) ?: [];
        }
        if (is_string($media->manipulations)) {
            $media->manipulations = json_decode($media->manipulations, true) ?: [];
        }
        if (is_string($media->responsive_images)) {
            $media->responsive_images = json_decode($media->responsive_images, true) ?: [];
        }
    }

    private function getFullImageUrl($url)
    {
        // If URL is already absolute, return as is
        if (str_starts_with($url, 'http')) {
            return $url;
        }
        
        // For cloud storage, the URL should already be absolute from getUrl()
        // If it's not, construct it properly
        $storageType = getSetting('storage_type', 'local');
        
        if (in_array($storageType, ['aws_s3', 's3', 'wasabi'])) {
            // For cloud storage, use the image URL prefix directly
            $cleanPath = stripStoragePrefix($url);
            return getImageUrlPrefix() . '/' . ltrim($cleanPath, '/');
        }
        
        // For local storage, use getAssetUrl helper
        return getAssetUrl($url);
    }

    /**
     * Get proper cloud storage URL for media
     */
    private function getCloudStorageUrl($media, $conversion = null)
    {
        $storageType = getSetting('storage_type', 'local');
        
        // For cloud storage, construct URL directly
        if (in_array($storageType, ['aws_s3', 's3', 'wasabi'])) {
            $path = $conversion ? $media->getPath($conversion) : $media->getPath();
            
            // Extract just the filename part from the path
            $relativePath = str_replace(storage_path('app/'), '', $path);
            $relativePath = ltrim($relativePath, '/');
            
            // If path doesn't start with media/, add it
            if (!str_starts_with($relativePath, 'media/')) {
                $relativePath = 'media/' . $relativePath;
            }
            
            return getImageUrlPrefix() . '/' . $relativePath;
        }
        
        // For local storage, use the standard getUrl method
        try {
            $url = $conversion ? $media->getUrl($conversion) : $media->getUrl();
            return $this->getFullImageUrl($url);
        } catch (\Exception $e) {
            // Fallback to constructing URL manually
            $path = $conversion ? $media->getPath($conversion) : $media->getPath();
            return getAssetUrl(str_replace(storage_path('app/public/'), '', $path));
        }
    }

    private function getFullUrl($url)
    {
        // If URL is already absolute, return as is
        if (str_starts_with($url, 'http')) {
            return $url;
        }
        
        // Get dynamic base path from current request
        $requestUri = request()->getRequestUri();
        $scriptName = request()->getScriptName();
        $basePath = str_replace('/index.php', '', dirname($scriptName));
        
        if ($basePath === '/') {
            $basePath = '';
        }
        
        $baseUrl = request()->getSchemeAndHttpHost() . $basePath;
        
        // Ensure URL starts with /
        if (!str_starts_with($url, '/')) {
            $url = '/' . $url;
        }
        
        return $baseUrl . $url;
    }



    private function getUserFriendlyError(\Exception $e, $fileName): string
    {
        $message = $e->getMessage();
        $extension = strtoupper(pathinfo($fileName, PATHINFO_EXTENSION));
        
        // Handle S3/disk access errors
        if (str_contains($message, 'cannot be accessed') || str_contains($message, 'Disk named')) {
            return __("Storage configuration error. Please check your storage settings.");
        }
        
        // Handle AWS S3 specific errors
        if (str_contains($message, 'AWS') || str_contains($message, 'S3') || str_contains($message, 'credentials')) {
            return __("Cloud storage error. Please verify your storage credentials.");
        }
        
        // Handle media library collection errors
        if (str_contains($message, 'was not accepted into the collection')) {
            if (str_contains($message, 'mime:')) {
                return __("File type not allowed : :extension", ['extension' => $extension]);
            }
            return __("File format not supported : :extension", ['extension' => $extension]);
        }
        
        // Handle storage errors
        if (str_contains($message, 'storage') || str_contains($message, 'disk')) {
            return __("Storage error : :extension", ['extension' => $extension]);
        }
        
        // Handle file size errors
        if (str_contains($message, 'size') || str_contains($message, 'large')) {
            return __("File too large : :extension", ['extension' => $extension]);
        }
        
        // Handle permission errors
        if (str_contains($message, 'permission') || str_contains($message, 'denied')) {
            return __("Permission denied : :extension", ['extension' => $extension]);
        }
        
        // Generic fallback
        return __("Upload failed : :extension", ['extension' => $extension]);
    }

    public function batchStore(Request $request)
    {
        // Check storage limits
        $storageCheck = $this->checkStorageLimit($request->file('files'));
        if ($storageCheck) {
            return $storageCheck;
        }
        
        $config = StorageConfigService::getStorageConfig();
        $validationRules = StorageConfigService::getFileValidationRules();
        
        // Custom validation with user-friendly messages
        $validator = \Validator::make($request->all(), [
            'files' => 'required|array',
            'files.*' => array_merge(['file'], $validationRules),
        ], [
            'files.*.mimes' => __('Only specified file types are allowed: :type',[
                    'type' => isset($config['allowed_file_types']) && $config['allowed_file_types']
                        ? strtoupper(str_replace(',', ', ', $config['allowed_file_types']))
                        : __('Please check storage settings')
                ])
                ,
            'files.*.max' => __('File size cannot exceed :max MB.', ['max' => $config['max_file_size_mb']]),
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'message' => __('File validation failed'),
                'errors' => $validator->errors()->all(),
                'allowed_types' => $config['allowed_file_types'],
                'max_size_mb' => $config['max_file_size_mb']
            ], 422);
        }

        $uploadedMedia = [];
        $errors = [];
        
        foreach ($request->file('files') as $file) {
            try {
                // Ensure storage is configured before each upload
                DynamicStorageService::configureDynamicDisks();
                
                // Debug: Check active disk and validate configuration
                $activeDisk = StorageConfigService::getActiveDisk();
                
                // Test disk accessibility before proceeding
                try {
                    $diskInstance = \Storage::disk($activeDisk);
                    // Simple test to ensure disk is accessible
                    $diskInstance->exists('test-file-that-does-not-exist.txt');
                } catch (\Exception $diskError) {
                    $activeDisk = 'public';
                }
                
                $mediaItem = MediaItem::create([
                    'name' => $file->getClientOriginalName(),
                ]);

                // Configure dynamic storage before upload
                DynamicStorageService::configureDynamicDisks();
                
                $media = $mediaItem->addMedia($file)
                    ->toMediaCollection('images', $activeDisk);
                
                $media->user_id = auth()->id();
                $media->save();
                
                // Update user storage usage
                $this->updateStorageUsage(auth()->user(), $media->size);

                // Force thumbnail generationAdd commentMore actions
                try {
                    $media->getUrl('thumb');
                } catch (\Exception $e) {
                    // Thumbnail generation failed, but continue
                }

                $originalUrl = $this->getCloudStorageUrl($media);
                $thumbUrl = $originalUrl; // Default to original
                
                try {
                    $thumbUrl = $this->getCloudStorageUrl($media, 'thumb');
                } catch (\Exception $e) {
                    // If thumb conversion fails, use original
                }
                
                $uploadedMedia[] = [
                    'id' => $media->id,
                    'name' => $media->name,
                    'file_name' => $media->file_name,
                    'url' => $originalUrl,
                    'thumb_url' => $thumbUrl,
                    'size' => $media->size,
                    'mime_type' => $media->mime_type,
                    'user_id' => $media->user_id,
                    'created_at' => $media->created_at,
                ];
            } catch (\Exception $e) {
                if (isset($mediaItem)) {
                    $mediaItem->delete();
                }
                
                $errors[] = [
                    'file' => $file->getClientOriginalName(),
                    'error' => $this->getUserFriendlyError($e, $file->getClientOriginalName())
                ];
            }
        }
        
        if (count($uploadedMedia) > 0 && empty($errors)) {
            return response()->json([
                'message' => count($uploadedMedia) . __(' file(s) uploaded successfully'),
                'data' => $uploadedMedia
            ]);
        } elseif (count($uploadedMedia) > 0 && !empty($errors)) {
            return response()->json([
                'message' => count($uploadedMedia) . ' uploaded, ' . count($errors) . ' failed',
                'data' => $uploadedMedia,
                'errors' => array_column($errors, 'error')
            ]);
        } else {
            return response()->json([
                'message' => 'Upload failed',
                'errors' => array_column($errors, 'error')
            ], 422);
        }
    }

    public function download($id)
    {
        $user = auth()->user();
        $query = Media::where('id', $id);
        
        // SuperAdmin and users with manage-any-media can download any media
        if ($user->type !== 'superadmin' && !$user->hasPermissionTo('manage-any-media')) {
            $query->where('user_id', $user->id);
        }
        
        $media = $query->firstOrFail();
        
        try {
            $filePath = $media->getPath();
            
            if (!file_exists($filePath)) {
                abort(404, __('File not found'));
            }
            
            return response()->download($filePath, $media->file_name);
        } catch (\Exception $e) {
            abort(404, __('File storage unavailable'));
        }
    }



    public function destroy($id)
    {
        $user = auth()->user();
        $query = Media::where('id', $id);
        
        // SuperAdmin and users with manage-any-media can delete any media
        if ($user->type !== 'superadmin' && !$user->hasPermissionTo('manage-any-media')) {
            $query->where('user_id', $user->id);
        }
        
        $media = $query->firstOrFail();
        $mediaItem = $media->model;
        $fileSize = $media->size;

        try {
            DynamicStorageService::configureDynamicDisks();
            Storage::disk($media->disk)->delete('media/' . $media->file_name);
            $media->delete();
        } catch (\Exception $e) {
            return response()->json([
                'message' => __('Unable to delete media. Please verify your storage settings and try again.'),
            ], 422);
        }

        $this->updateStorageUsage($user, -$fileSize);

        if ($mediaItem && $mediaItem->getMedia()->count() === 0) {
            $mediaItem->delete();
        }

        return response()->json(['message' => __('Media deleted successfully')]);
    }
    
    private function checkStorageLimit($files)
    {
        $user = auth()->user();
        if ($user->type === 'superadmin') return null;
        
        $limit = $this->getUserStorageLimit($user);
        if (!$limit) return null;
        
        $uploadSize = collect($files)->sum('size');
        $currentUsage = $this->getUserStorageUsage($user);
        
        if (($currentUsage + $uploadSize) > $limit) {
            return response()->json([
                'message' => __('Storage limit exceeded'),
                'errors' => [__('Please delete files or upgrade plan')]
            ], 422);
        }
        
        return null;
    }
    
    private function getUserStorageLimit($user)
    {
        if ($user->type === 'company' && $user->plan) {
            return $user->plan->storage_limit * 1024 * 1024 * 1024;
        }
        
        if ($user->created_by) {
            $company = User::find($user->created_by);
            if ($company && $company->plan) {
                return $company->plan->storage_limit * 1024 * 1024 * 1024;
            }
        }
        
        return null;
    }
    
    private function getUserStorageUsage($user)
    {
        if ($user->type === 'company') {
            return User::where('created_by', $user->id)
                ->orWhere('id', $user->id)
                ->sum('storage_limit');
        }
        
        if ($user->created_by) {
            $company = User::find($user->created_by);
            if ($company) {
                return User::where('created_by', $company->id)
                    ->orWhere('id', $company->id)
                    ->sum('storage_limit');
            }
        }
        
        return $user->storage_limit;
    }
    
    private function updateStorageUsage($user, $size)
    {
        $user->increment('storage_limit', $size);
    }
    
    /**
     * Upload brand asset (logo/favicon) to current storage type
     */
    public function uploadBrandAsset(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:png,jpg,jpeg,gif,svg,ico|max:2048',
            'type' => 'required|in:logo,favicon'
        ]);
        
        try {
            $file = $request->file('file');
            $type = $request->input('type');
            
            // Get current storage disk
            $activeDisk = StorageConfigService::getActiveDisk();
            
            // Generate filename
            $extension = $file->getClientOriginalExtension();
            $filename = $type . '_' . time() . '.' . $extension;
            $path = 'brand/' . $filename;
            
            // Store file to current storage type
            \Storage::disk($activeDisk)->put($path, file_get_contents($file));
            
            // Return relative path (without storage prefix)
            return response()->json([
                'success' => true,
                'path' => $path,
                'url' => getImageUrlPrefix() . '/' . $path
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get allowed disk names based on current storage type
     */
    private function getAllowedDisksForStorageType($storageType)
    {
        switch ($storageType) {
            case 'local':
                return ['public', 'local'];
            case 's3':
            case 'aws_s3':
                return ['s3'];
            case 'wasabi':
                return ['wasabi'];
            default:
                return ['public', 'local'];
        }
    }


}
