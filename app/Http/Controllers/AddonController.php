<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use App\Models\Addon;
use Illuminate\Support\Facades\Storage;
use ZipArchive;
use Illuminate\Support\Facades\File;

class AddonController extends Controller
{
    /**
     * Display a listing of the addons.
     */
    public function index(Request $request)
    {
        // Fetch addons from external server or fallback to local JSON
        $addons = $this->fetchAddons();

        // Apply filters
        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $addons = $addons->filter(function ($addon) use ($search) {
                return str_contains(strtolower($addon['name']), $search) ||
                       str_contains(strtolower($addon['description']), $search) ||
                       str_contains(strtolower($addon['category']), $search);
            });
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $addons = $addons->filter(function ($addon) use ($request) {
                return strtolower($addon['category']) === strtolower($request->category);
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'purchased') {
                $addons = $addons->filter(function ($addon) {
                    return $addon['is_purchased'];
                });
            } elseif ($request->status === 'available') {
                $addons = $addons->filter(function ($addon) {
                    return !$addon['is_purchased'];
                });
            } elseif ($request->status === 'enabled') {
                $addons = $addons->filter(function ($addon) {
                    return $addon['is_purchased'] && $addon['is_enabled'];
                });
            } elseif ($request->status === 'disabled') {
                $addons = $addons->filter(function ($addon) {
                    return $addon['is_purchased'] && !$addon['is_enabled'];
                });
            }
        }

        // Sort
        if ($request->filled('sort_field') && $request->filled('sort_direction')) {
            $sortField = $request->sort_field;
            $sortDirection = $request->sort_direction;
            
            $addons = $addons->sortBy($sortField, SORT_REGULAR, $sortDirection === 'desc');
        } else {
            $addons = $addons->sortBy('name');
        }

        // Pagination
        $perPage = $request->get('per_page', 12);
        $page = $request->get('page', 1);
        $total = $addons->count();
        $items = $addons->forPage($page, $perPage)->values();

        $paginatedData = [
            'data' => $items,
            'current_page' => $page,
            'per_page' => $perPage,
            'total' => $total,
            'last_page' => ceil($total / $perPage),
            'from' => ($page - 1) * $perPage + 1,
            'to' => min($page * $perPage, $total),
            'links' => $this->generatePaginationLinks($page, ceil($total / $perPage), $request)
        ];

        return Inertia::render('addons/index', [
            'addons' => $paginatedData,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'status' => $request->status,
                'sort_field' => $request->sort_field,
                'sort_direction' => $request->sort_direction,
                'per_page' => $perPage
            ]
        ]);
    }

    /**
     * Toggle addon status (enable/disable)
     */
    public function toggleStatus(Request $request, $id)
    {
        try {
            $addon = Addon::findOrFail($id);
            
            // Update missing addon data if needed
            $this->updateAddonData($addon);
            
            $addon->is_enabled = !$addon->is_enabled;
            $addon->save();
            
            // Clear addon-related caches
            \Illuminate\Support\Facades\Cache::forget('enabled_addons');
            \Illuminate\Support\Facades\Cache::forget('addon_routes');
            \Illuminate\Support\Facades\Cache::forget('sidebar_menu');
            \Illuminate\Support\Facades\Cache::forget('user_menu_' . auth()->id());

            return redirect()->back()->with('success', __('Addon status updated successfully'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('Failed to update addon status: :error', ['error' => $e->getMessage()]));
          
            return redirect()->back()->with('error', __('Failed to update addon status: :error', ['error' => $e->getMessage()]));
        }
    }

    /**
     * Purchase an addon
     */
    public function purchase(Request $request, $id)
    {
        // In real implementation, this would handle payment processing
        // For now, we'll just return a success response
        
        return response()->json([
            'success' => true,
            'message' => __('Addon purchased successfully')
        ]);
    }

    /**
     * Upload and install addon
     */
    public function upload(Request $request)
    {   
        $request->validate([
            'addon_file' => 'required|file|mimes:zip|max:10240' // 10MB max
        ]);

        try {
            $file = $request->file('addon_file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            
            // Create packages/workdo directory if it doesn't exist
            $extractPath = base_path('packages/workdo');
            if (!File::exists($extractPath)) {
                File::makeDirectory($extractPath, 0755, true);
            }

            // Store the uploaded file temporarily
            $tempPath = storage_path('app/temp/' . $fileName);
            $file->move(storage_path('app/temp'), $fileName);

            // Extract ZIP file
            $zip = new ZipArchive;
            if ($zip->open($tempPath) === TRUE) {
                // Get package name from ZIP filename
                $packageName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $packagePath = $extractPath . DIRECTORY_SEPARATOR . $packageName;
                
                // Create package directory
                if (!File::exists($packagePath)) {
                    File::makeDirectory($packagePath, 0755, true);
                }
                
                $zip->extractTo($packagePath);
                $zip->close();

                // Set permissions recursively for extracted content
                $this->setDirectoryPermissions($packagePath, 0777);

                // Read addon configuration
                $addonInfo = $this->readAddonConfig($packagePath);
                
                if ($addonInfo) {
                    // Check if addon already exists
                    $existingAddon = Addon::where('package_name', $addonInfo['folder'])->first();
                    
                    if ($existingAddon) {                
                        return redirect()->back()->with('error', __('Addon already exists. Please remove the existing addon first.'));
                    }
                    
                    // Save addon to database
                    $addon = Addon::create([
                        'name' => $addonInfo['name'],
                        'slug' => $addonInfo['slug'] ?? \Illuminate\Support\Str::slug($addonInfo['name']),
                        'version' => $addonInfo['version'],
                        'description' => $addonInfo['description'] ?? '',
                        'category' => $addonInfo['category'] ?? 'general',
                        'image' => $addonInfo['image'] ?? null,
                        'package_name' => $addonInfo['folder'],
                        'monthly_price' => $addonInfo['monthly_price'] ?? 0,
                        'yearly_price' => $addonInfo['yearly_price'] ?? 0,
                        'config' => $addonInfo,
                        'is_enabled' => false
                    ]);
                    
                    // Update composer autoload to include new addon
                    $this->updateComposerAutoload($packageName, $packagePath);
                    
                    // Run package migrations and seeders
                    $this->runPackageMigrations($packageName);
                    $this->runPackageSeeders($packageName);
                    
                    // Register the service provider immediately after upload
                    // Service provider will be registered on next request
                    
                    // Compile TypeScript files to JavaScript if they exist
                    $this->compileAddonAssets($packagePath);

                    // Clean up temp file
                    File::delete($tempPath);

                    return redirect()->back()->with('success', __('Addon uploaded and installed successfully'));
                } else {
                    // Clean up temp file
                    File::delete($tempPath);
                    
                    return redirect()->back()->with('error', __('Invalid addon package. Missing configuration file.'));
                }
            } else {
                // Clean up temp file
                File::delete($tempPath);
                
                return redirect()->back()->with('error', __('Failed to extract ZIP file'));
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('Error uploading addon: :message', ['message' => $e->getMessage()]));
        }
    }

    /**
     * Read addon configuration from extracted files
     */
    private function readAddonConfig($packagePath)
    {
        $configPath = $packagePath . '/module.json';
        if (File::exists($configPath)) {
            $config = json_decode(File::get($configPath), true);
            if ($config && json_last_error() === JSON_ERROR_NONE && isset($config['name'])) {
                $config['folder'] = basename($packagePath);
                return $config;
            }
        }
        return null;
    }

    /**
     * Set directory permissions recursively
     */
    private function setDirectoryPermissions($path, $permission = 0777)
    {
        try {
            if (is_dir($path)) {
                chmod($path, $permission);
                
                $items = scandir($path);
                foreach ($items as $item) {
                    if ($item != '.' && $item != '..') {
                        $itemPath = $path . DIRECTORY_SEPARATOR . $item;
                        if (is_dir($itemPath)) {
                            $this->setDirectoryPermissions($itemPath, $permission);
                        } else {
                            chmod($itemPath, $permission);
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            \Log::warning('Failed to set permissions for: ' . $path . ' - ' . $e->getMessage());
        }
    }

    /**
     * Generate pagination links
     */
    private function generatePaginationLinks($currentPage, $lastPage, $request)
    {
        $links = [];
        $baseUrl = $request->url();
        $params = $request->except('page');

        // Previous link
        if ($currentPage > 1) {
            $links[] = [
                'url' => $baseUrl . '?' . http_build_query(array_merge($params, ['page' => $currentPage - 1])),
                'label' => '&laquo; Previous',
                'active' => false
            ];
        } else {
            $links[] = [
                'url' => null,
                'label' => '&laquo; Previous',
                'active' => false
            ];
        }

        // Page links
        for ($i = 1; $i <= $lastPage; $i++) {
            $links[] = [
                'url' => $baseUrl . '?' . http_build_query(array_merge($params, ['page' => $i])),
                'label' => (string) $i,
                'active' => $i === $currentPage
            ];
        }

        // Next link
        if ($currentPage < $lastPage) {
            $links[] = [
                'url' => $baseUrl . '?' . http_build_query(array_merge($params, ['page' => $currentPage + 1])),
                'label' => 'Next &raquo;',
                'active' => false
            ];
        } else {
            $links[] = [
                'url' => null,
                'label' => 'Next &raquo;',
                'active' => false
            ];
        }

        return $links;
    }

    /**
     * Get enabled addons for menu loading
     */
    public function getEnabledAddons()
    {
        try {
            $enabledAddons = Addon::where('is_enabled', true)->get(['name', 'package_name']);
            return response()->json($enabledAddons);
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * Fetch addons from local JSON file and database
     */
    private function fetchAddons()
    {
        try {
            $isDemoMode = config('app.is_demo');
            $jsonAddons = collect([]);
            $jsonMap = collect([]);

            // Always fetch JSON data
            try {
                $jsonData = json_decode(file_get_contents("https://demo.workdo.io/vcard-saas/storage/addons.json"), true);
                if ($jsonData && json_last_error() === JSON_ERROR_NONE) {
                    $jsonAddons = collect($jsonData['addons'] ?? []);
                    // Map by package_name for easy lookup
                    $jsonMap = $jsonAddons->keyBy('package_name');
                }
            } catch (\Exception $e) {
            }

            // Get addons from database
            $dbAddons = Addon::all();
            $dbAddons = $dbAddons->map(function ($addon) use ($jsonMap, $isDemoMode) {
                if ($isDemoMode) {
                    $url = optional($jsonMap->get($addon->package_name))['url'] ?? null;
                } else {
                    $addonSlug = strtolower(str_replace([' ', '_'], '-', $addon->name));
                    $url = url($addonSlug . '/marketplace');
                }

                return [
                    'id' => $addon->id,
                    'name' => $addon->name,
                    'package_name' => $addon->package_name,
                    'description' => $addon->description,
                    'version' => $addon->version,
                    'category' => $addon->category,
                    'image' => $addon->image,
                    'is_purchased' => true,
                    'is_enabled' => $addon->is_enabled,
                    'price' => 0,
                    'status' => $addon->is_enabled ? 'enabled' : 'disabled',
                    'features' => [],
                    'created_at' => $addon->created_at->toISOString(),
                    'updated_at' => $addon->updated_at->toISOString(),
                    'url' => $url,
                ];
            });

            $purchasedPackages = $dbAddons->pluck('package_name')->filter();

            // Keep only addons not purchased, and append url conditionally
            $jsonAddons = $jsonAddons
                ->whereNotIn('package_name', $purchasedPackages)
                ->map(function ($addon) {
                    return array_merge($addon, [
                        'url' => $addon['url'] ?? null,
                        'is_purchased' => false,
                        'is_enabled' => false
                    ]);
                });

            // Always merge both collections
            $result = $dbAddons->concat($jsonAddons);
            return $result;
        } catch (\Exception $e) {
        }

        return collect([]);
    }
    
    /**
     * Update composer autoload to include new addon
     */
    private function updateComposerAutoload($packageName, $packagePath)
    {
        try {
            // First, register the namespace with the current autoloader
            $loader = require base_path('vendor/autoload.php');
            $namespace = "Workdo\\{$packageName}\\";
            $srcPath = $packagePath . '/src/';
            
            if (is_dir($srcPath)) {
                $loader->addPsr4($namespace, $srcPath);
            }
            
            // Update composer.json for persistence
            $composerPath = base_path('composer.json');
            if (File::exists($composerPath)) {
                $composer = json_decode(File::get($composerPath), true);
                
                // Add PSR-4 autoload entry for the addon
                $path = "packages/workdo/{$packageName}/src/";
                
                if (!isset($composer['autoload']['psr-4'][$namespace])) {
                    $composer['autoload']['psr-4'][$namespace] = $path;
                    File::put($composerPath, json_encode($composer, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
                    
                    // Run composer dump-autoload in background
                    exec('cd ' . base_path() . ' && composer dump-autoload > /dev/null 2>&1 &');
                }
            }
        } catch (\Exception $e) {
            \Log::warning('Failed to update composer autoload: ' . $e->getMessage());
        }
    }
    
    /**
     * Compile TypeScript files to JavaScript for dynamic loading
     */
    private function compileAddonAssets($packagePath)
    {
        try {
            $jsPath = $packagePath . '/src/Resources/js';
            if (File::exists($jsPath)) {
                // Find all TypeScript files
                $tsFiles = File::allFiles($jsPath);
                
                foreach ($tsFiles as $file) {
                    if ($file->getExtension() === 'ts' || $file->getExtension() === 'tsx') {
                        $tsFilePath = $file->getPathname();
                        $jsFilePath = str_replace(['.ts', '.tsx'], '.js', $tsFilePath);
                        
                        // Simple TypeScript to JavaScript conversion
                        // Remove TypeScript-specific syntax
                        $content = File::get($tsFilePath);
                        
                        // Remove type annotations and interfaces
                        $content = preg_replace('/: [A-Za-z0-9<>\[\]\|\s]+(?=[,\)\}\;\=])/', '', $content);
                        $content = preg_replace('/interface\s+\w+\s*\{[^}]*\}/', '', $content);
                        $content = preg_replace('/type\s+\w+\s*=\s*[^;]+;/', '', $content);
                        
                        // Write JavaScript file
                        File::put($jsFilePath, $content);
                    }
                }
            }
        } catch (\Exception $e) {
            \Log::warning('Failed to compile addon assets: ' . $e->getMessage());
        }
    }
    
    /**
     * Run package migrations
     */
    private function runPackageMigrations($packageName)
    {
        try {
            \Illuminate\Support\Facades\Artisan::call('package:migrate', [
                'packageName' => $packageName
            ]);
            \Log::info("Successfully ran migrations for package: {$packageName}");
        } catch (\Exception $e) {
            \Log::warning("Failed to run migrations for package {$packageName}: " . $e->getMessage());
        }
    }
    
    /**
     * Run package seeders
     */
    private function runPackageSeeders($packageName)
    {
        try {
            \Illuminate\Support\Facades\Artisan::call('package:seed', [
                'packageName' => $packageName
            ]);
            \Log::info("Successfully ran seeders for package: {$packageName}");
        } catch (\Exception $e) {
            \Log::warning("Failed to run seeders for package {$packageName}: " . $e->getMessage());
        }
    }
    
    /**
     * Remove addon
     */
    public function remove(Request $request, $id)
    {
        try {
            $addon = Addon::findOrFail($id);
            
            // Disable addon first if enabled
            if ($addon->is_enabled) {
                $addon->is_enabled = false;
                $addon->save();
            }
            
            // Remove package directory
            $packagePath = base_path('packages/workdo/' . $addon->package_name);
            if (File::exists($packagePath)) {
                File::deleteDirectory($packagePath);
            }
            
            // Remove from composer.json
            $this->removeFromComposerAutoload($addon->package_name);
            
            // Delete addon record
            $addon->delete();
            
            // Clear caches
            \Illuminate\Support\Facades\Cache::forget('enabled_addons');
            \Illuminate\Support\Facades\Cache::forget('addon_routes');
            \Illuminate\Support\Facades\Cache::forget('sidebar_menu');
            
            return redirect()->back()->with('success', __('Addon removed successfully'));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('Failed to remove addon: :error', ['error' => $e->getMessage()]));
        }
    }
    
    /**
     * Update addon data if missing
     */
    private function updateAddonData($addon)
    {
        $packagePath = base_path('packages/workdo/' . $addon->package_name);
        $configPath = $packagePath . '/module.json';
        
        if (File::exists($configPath)) {
            $config = json_decode(File::get($configPath), true);
            
            if ($config && json_last_error() === JSON_ERROR_NONE) {
                $updated = false;
                
                // Update version if missing or different
                if (empty($addon->version) || $addon->version !== ($config['version'] ?? '1.0.0')) {
                    $addon->version = $config['version'] ?? '1.0.0';
                    $updated = true;
                }
                
                // Update description if missing
                if (empty($addon->description) && !empty($config['description'])) {
                    $addon->description = $config['description'];
                    $updated = true;
                }
                
                // Update category if missing
                if (empty($addon->category) && !empty($config['category'])) {
                    $addon->category = $config['category'];
                    $updated = true;
                }
                
                // Update config if missing or different
                if (empty($addon->config) || $addon->config !== $config) {
                    $addon->config = $config;
                    $updated = true;
                }
                
                // Update prices if missing
                if (empty($addon->monthly_price) && !empty($config['monthly_price'])) {
                    $addon->monthly_price = $config['monthly_price'];
                    $updated = true;
                }
                
                if (empty($addon->yearly_price) && !empty($config['yearly_price'])) {
                    $addon->yearly_price = $config['yearly_price'];
                    $updated = true;
                }
                
                if ($updated) {
                    $addon->save();
                }

                // Run package migrations and seeders
                $this->runPackageMigrations($addon->package_name);
                $this->runPackageSeeders($addon->package_name);
            }
        }
    }
    
    /**
     * Remove addon from composer autoload
     */
    private function removeFromComposerAutoload($packageName)
    {
        try {
            $composerPath = base_path('composer.json');
            if (File::exists($composerPath)) {
                $composer = json_decode(File::get($composerPath), true);
                $namespace = "Workdo\\{$packageName}\\";
                
                if (isset($composer['autoload']['psr-4'][$namespace])) {
                    unset($composer['autoload']['psr-4'][$namespace]);
                    File::put($composerPath, json_encode($composer, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
                    
                    // Run composer dump-autoload
                    exec('cd ' . base_path() . ' && composer dump-autoload > /dev/null 2>&1 &');
                }
            }
        } catch (\Exception $e) {
            \Log::warning('Failed to remove from composer autoload: ' . $e->getMessage());
        }
    }

}