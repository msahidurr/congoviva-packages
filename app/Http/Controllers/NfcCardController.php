<?php

namespace App\Http\Controllers;

use App\Models\NfcCard;
use App\Models\NfcCardOrderRequest;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NfcCardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Check if NFC Cards setting is enabled for company users
        if (!$user->isSuperAdmin()) {
            $isEnabled = Setting::where('key', 'nfc_cards_enabled')
                ->where('user_id', 1)
                ->value('value') === '1';
            
            if (!$isEnabled) {
                // Check if this is an AJAX request or direct URL access
                if ($request->expectsJson() || $request->wantsJson()) {
                    return response()->json([
                        'error' => __('NFC cards setting is currently disabled')
                    ], 403);
                }
                
                return redirect()->route('dashboard')
                    ->with('error', __('NFC cards setting is currently disabled'));
            }
        }
        
        if ($user->isSuperAdmin()) {
            return $this->adminIndex($request);
        } else {
            return $this->companyIndex($request);
        }
    }
    
    private function adminIndex(Request $request)
    {
        $query = NfcCard::query()->with('creator');
            
        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        
        // Apply status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('is_enabled', $request->status === 'enabled');
        }
        
        // Apply date filters
        if ($request->has('start_date') && !empty($request->start_date)) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        
        if ($request->has('end_date') && !empty($request->end_date)) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }
        
        // Apply sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
        
        // Get paginated results
        $perPage = $request->input('per_page', 10);
        $nfcCards = $query->paginate($perPage)->withQueryString();
        
        // Convert image paths to URLs for display
        $nfcCards->getCollection()->transform(function ($nfcCard) {
            if ($nfcCard->front_image) {
                $nfcCard->front_image = $this->convertPathToUrl($nfcCard->front_image);
            }
            if ($nfcCard->back_image) {
                $nfcCard->back_image = $this->convertPathToUrl($nfcCard->back_image);
            }
            return $nfcCard;
        });
        
        return Inertia::render('nfc-cards/index', [
            'nfcCards' => $nfcCards,
            'filters' => $request->only(['search', 'status', 'start_date', 'end_date', 'sort_field', 'sort_direction', 'per_page']),
            'isAdmin' => true
        ]);
    }
    
    private function companyIndex(Request $request)
    {
        $user = auth()->user();
        $query = NfcCard::where('is_enabled', true);
        
        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        
        // Apply date filters
        if ($request->has('start_date') && !empty($request->start_date)) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        
        if ($request->has('end_date') && !empty($request->end_date)) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }
        
        // Apply sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
        
        // Get paginated results
        $perPage = $request->input('per_page', 10);
        $nfcCards = $query->paginate($perPage)->withQueryString();
        $businesses = $user->businesses ?? [];
        
        // Convert image paths to URLs for display
        $nfcCards->getCollection()->transform(function ($nfcCard) {
            if ($nfcCard->front_image) {
                $nfcCard->front_image = $this->convertPathToUrl($nfcCard->front_image);
            }
            if ($nfcCard->back_image) {
                $nfcCard->back_image = $this->convertPathToUrl($nfcCard->back_image);
            }
            return $nfcCard;
        });
        
        return Inertia::render('nfc-cards/index', [
            'nfcCards' => $nfcCards,
            'businesses' => $businesses,
            'filters' => $request->only(['search', 'start_date', 'end_date', 'sort_field', 'sort_direction', 'per_page', 'view']),
            'isAdmin' => false
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'front_image' => 'nullable|string',
            'back_image' => 'nullable|string',
            'is_enabled' => 'boolean',
        ]);
        
        // Handle MediaPicker URLs - convert to relative paths
        if (!empty($validated['front_image'])) {
            $validated['front_image'] = $this->convertToRelativePath($validated['front_image']);
        }
        
        if (!empty($validated['back_image'])) {
            $validated['back_image'] = $this->convertToRelativePath($validated['back_image']);
        }
        
        $validated['created_by'] = auth()->id();
        
        NfcCard::create($validated);
        
        return redirect()->back()->with('success', __('NFC Card created successfully'));
    }
    
    public function update(Request $request, NfcCard $nfcCard)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'front_image' => 'nullable|string',
            'back_image' => 'nullable|string',
            'is_enabled' => 'boolean',
        ]);
        
        // Handle MediaPicker URLs - convert to relative paths
        if (isset($validated['front_image'])) {
            if (!empty($validated['front_image'])) {
                $validated['front_image'] = $this->convertToRelativePath($validated['front_image']);
            } else {
                $validated['front_image'] = null;
            }
        }
        
        if (isset($validated['back_image'])) {
            if (!empty($validated['back_image'])) {
                $validated['back_image'] = $this->convertToRelativePath($validated['back_image']);
            } else {
                $validated['back_image'] = null;
            }
        }
        
        $nfcCard->update($validated);
        
        return redirect()->back()->with('success', __('NFC Card updated successfully'));
    }
    
    public function edit(NfcCard $nfcCard)
    {
        // Convert image paths to full URLs for editing
        if ($nfcCard->front_image) {
            $nfcCard->front_image = $this->convertPathToUrl($nfcCard->front_image);
        }
        
        if ($nfcCard->back_image) {
            $nfcCard->back_image = $this->convertPathToUrl($nfcCard->back_image);
        }
        
        return response()->json($nfcCard);
    }
    
    public function destroy(NfcCard $nfcCard)
    {
        $nfcCard->delete();
        
        return redirect()->back()->with('success', __('NFC Card deleted successfully'));
    }
    
    public function toggleStatus(NfcCard $nfcCard)
    {
        $nfcCard->is_enabled = !$nfcCard->is_enabled;
        $nfcCard->save();
        
        return redirect()->back()->with('success', __('NFC Card status updated successfully'));
    }
    
    public function orderRequest(Request $request)
    {
        $user = auth()->user();
        
        // Check if NFC Cards setting is enabled for company users
        if (!$user->isSuperAdmin()) {
            $isEnabled = Setting::where('key', 'nfc_cards_enabled')
                ->where('user_id', 1)
                ->value('value') === '1';
            
            if (!$isEnabled) {
                if ($request->expectsJson() || $request->wantsJson()) {
                    return response()->json([
                        'error' => __('NFC cards setting is currently disabled')
                    ], 403);
                }
                
                return back()->with('error', __('NFC cards setting is currently disabled'));
            }
        }
        
        $request->validate([
            'nfc_card_id' => 'required|exists:nfc_cards,id',
            'quantity' => 'required|integer|min:1',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'shipping_address' => 'nullable|string',
            'business_id' => 'required|exists:businesses,id'
        ]);
        
        $nfcCard = NfcCard::findOrFail($request->nfc_card_id);
        if ($nfcCard->quantity <= 0) {
            return back()->with('error', 'NFC Card is out of stock');
        }
        
        $originalPrice = $nfcCard->price;
        $totalPrice = $originalPrice * $request->quantity;
        
        $data = [
            'user_id' => auth()->id(),
            'nfc_card_id' => $request->nfc_card_id,
            'quantity' => $request->quantity,
            'original_price' => $originalPrice,
            'total_price' => $totalPrice,
            'shipping_address' => $request->shipping_address,
            'business_id' => $request->business_id,
            'status' => 'pending'
        ];
        
        if ($request->hasFile('logo')) {
            $diskName = \App\Services\StorageConfigService::getActiveDisk();
            $fileName = time() . '_' . $request->file('logo')->getClientOriginalName();
            $logoPath = 'nfc-order-logos/' . $fileName;
            \Storage::disk($diskName)->put($logoPath, file_get_contents($request->file('logo')));
            
            // Store with storage type prefix for proper URL generation
            $currentStorageType = getSetting('storage_type', 'local');
            $data['logo'] =  $logoPath;
        }
        
        NfcCardOrderRequest::create($data);
        
        return back()->with('success', __('NFC Card order request submitted successfully'));
    }
    
    public function orderRequests(Request $request)
    {
        $user = auth()->user();
        
        // Check if NFC Cards setting is enabled for company users
        if (!$user->isSuperAdmin()) {
            $isEnabled = Setting::where('key', 'nfc_cards_enabled')
                ->where('user_id', 1)
                ->value('value') === '1';
            
            if (!$isEnabled) {
                // Check if this is an AJAX request or direct URL access
                if ($request->expectsJson() || $request->wantsJson()) {
                    return response()->json([
                        'error' => __('NFC cards setting is currently disabled')
                    ], 403);
                }
                
                return redirect()->route('dashboard')
                    ->with('error', __('NFC cards setting is currently disabled'));
            }
        }
        
        if ($user->isSuperAdmin()) {
            return $this->adminOrderRequests($request);
        } else {
            return $this->companyOrderRequests($request);
        }
    }
    
    private function adminOrderRequests(Request $request)
    {
        $query = NfcCardOrderRequest::with(['user', 'nfcCard', 'business']);
        
        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $query->where(function($q) use ($request) {
                $q->whereHas('user', function($userQuery) use ($request) {
                    $userQuery->where('name', 'like', "%{$request->search}%");
                })
                ->orWhereHas('nfcCard', function($cardQuery) use ($request) {
                    $cardQuery->where('name', 'like', "%{$request->search}%");
                })
                ->orWhereHas('business', function($businessQuery) use ($request) {
                    $businessQuery->where('name', 'like', "%{$request->search}%");
                });
            });
        }
        
        // Apply status filter
        if ($request->has('status') && $request->status !== 'all' && !empty($request->status)) {
            $query->where('status', $request->status);
        }
        
        // Apply sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        
        // Handle nested sorting
        if (str_contains($sortField, '.')) {
            $parts = explode('.', $sortField);
            if ($parts[0] === 'user' && $parts[1] === 'name') {
                $query->join('users', 'nfc_card_order_requests.user_id', '=', 'users.id')
                      ->orderBy('users.name', $sortDirection)
                      ->select('nfc_card_order_requests.*');
            } elseif ($parts[0] === 'nfc_card' && $parts[1] === 'name') {
                $query->join('nfc_cards', 'nfc_card_order_requests.nfc_card_id', '=', 'nfc_cards.id')
                      ->orderBy('nfc_cards.name', $sortDirection)
                      ->select('nfc_card_order_requests.*');
            } elseif ($parts[0] === 'business' && $parts[1] === 'name') {
                $query->leftJoin('businesses', 'nfc_card_order_requests.business_id', '=', 'businesses.id')
                      ->orderBy('businesses.name', $sortDirection)
                      ->select('nfc_card_order_requests.*');
            }
        } else {
            $query->orderBy($sortField, $sortDirection);
        }
        
        // Get paginated results
        $perPage = $request->input('per_page', 10);
        $orderRequests = $query->paginate($perPage)->withQueryString();

        $orderRequests->getCollection()->transform(function ($orderRequest) {
            if ($orderRequest->relationLoaded('user') && $orderRequest->user) {
                $orderRequest->user->append('avatar_url');
            }

            return $orderRequest;
        });
        
        return Inertia::render('nfc-cards/order-requests', [
            'orderRequests' => $orderRequests,
            'filters' => $request->only(['search', 'status', 'sort_field', 'sort_direction', 'per_page'])
        ]);
    }
    
    private function companyOrderRequests(Request $request)
    {
        $user = auth()->user();
        
        // Only show order requests created by the current user
        $query = NfcCardOrderRequest::with(['user', 'nfcCard', 'business'])
            ->where('user_id', $user->id);
        
        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $query->where(function($q) use ($request) {
                $q->whereHas('nfcCard', function($cardQuery) use ($request) {
                    $cardQuery->where('name', 'like', "%{$request->search}%");
                })
                ->orWhereHas('business', function($businessQuery) use ($request) {
                    $businessQuery->where('name', 'like', "%{$request->search}%");
                });
            });
        }
        
        // Apply status filter
        if ($request->has('status') && $request->status !== 'all' && !empty($request->status)) {
            $query->where('status', $request->status);
        }
        
        // Apply sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        
        // Handle nested sorting
        if (str_contains($sortField, '.')) {
            $parts = explode('.', $sortField);
            if ($parts[0] === 'nfc_card' && $parts[1] === 'name') {
                $query->join('nfc_cards', 'nfc_card_order_requests.nfc_card_id', '=', 'nfc_cards.id')
                      ->orderBy('nfc_cards.name', $sortDirection)
                      ->select('nfc_card_order_requests.*');
            } elseif ($parts[0] === 'business' && $parts[1] === 'name') {
                $query->leftJoin('businesses', 'nfc_card_order_requests.business_id', '=', 'businesses.id')
                      ->orderBy('businesses.name', $sortDirection)
                      ->select('nfc_card_order_requests.*');
            }
        } else {
            $query->orderBy($sortField, $sortDirection);
        }
        
        // Get paginated results
        $perPage = $request->input('per_page', 10);
        $orderRequests = $query->paginate($perPage)->withQueryString();

        $orderRequests->getCollection()->transform(function ($orderRequest) {
            if ($orderRequest->relationLoaded('user') && $orderRequest->user) {
                $orderRequest->user->append('avatar_url');
            }

            return $orderRequest;
        });
        
        return Inertia::render('nfc-cards/order-requests', [
            'orderRequests' => $orderRequests,
            'filters' => $request->only(['search', 'status', 'sort_field', 'sort_direction', 'per_page'])
        ]);
    }
    
    public function approveOrderRequest(NfcCardOrderRequest $orderRequest)
    {
        $orderRequest->nfcCard->decrement('quantity', $orderRequest->quantity);
        $orderRequest->update(['status' => 'approved']);
        return back()->with('success', __('Order request approved successfully'));
    }
    
    public function rejectOrderRequest(NfcCardOrderRequest $orderRequest)
    {
        $orderRequest->update(['status' => 'rejected']);
        return back()->with('success', __('Order request rejected successfully'));
    }
    
    public function destroyOrderRequest(NfcCardOrderRequest $orderRequest)
    {
        $user = auth()->user();
        
        // Only allow deletion of pending requests by the owner or a superadmin
        if ($orderRequest->status !== 'pending' && !$user->isSuperAdmin()) {
            return back()->with('error', __('Only pending order requests can be deleted'));
        }
        
        if ($orderRequest->user_id !== $user->id && !$user->isSuperAdmin()) {
            return back()->with('error', __('You can only delete your own order requests'));
        }
        
        $orderRequest->delete();
        return back()->with('success', __('Order request deleted successfully'));
    }
    
    public function toggleGlobal(Request $request)
    {
        $enabled = $request->boolean('is_enabled', true);
        
        Setting::updateOrCreate(
            ['key' => 'nfc_cards_enabled', 'user_id' => 1],
            ['value' => $enabled ? '1' : '0']
        );
        
        return back()->with('success', __('NFC cards setting updated successfully'));
    }
    
    /**
     * Convert full URL to relative path for storage
     */
    private function convertToRelativePath(string $url): string
    {
        if (!$url) return $url;
        
        // If it's already a relative path, return as is
        if (!str_starts_with($url, 'http')) {
            return $url;
        }
        
        // Extract the path after /storage/
        $storageIndex = strpos($url, '/storage/');
        if ($storageIndex !== false) {
            $path = substr($url, $storageIndex + 9); // Remove /storage/ prefix
            
            // Add storage type prefix for proper URL generation
            $currentStorageType = getSetting('storage_type', 'local');
            return $currentStorageType . ':' . $path;
        }
        
        return $url;
    }
    
    /**
     * Convert relative path to full URL for display
     */
    private function convertPathToUrl(string $path): string
    {
        return getAssetUrl($path);
    }
}