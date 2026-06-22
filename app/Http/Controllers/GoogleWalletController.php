<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Http;

class GoogleWalletController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Check if user's plan has Google Wallet feature
        $hasGoogleWalletFeature = false;
        if ($user->plan) {
            $hasGoogleWalletFeature = $user->plan->hasFeature('google_wallet');
        }
        
        if (!$hasGoogleWalletFeature) {
            return redirect()->route('dashboard')
                ->with('error', __('Google Wallet feature is not available in your current plan'));
        }
        
        $user = auth()->user();
        
        // Get filter parameters
        $search = $request->get('search');
        $businessType = $request->get('business_type', 'all');
        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $perPage = $request->get('per_page', 10);
        
        // Build query for user's businesses
        $query = Business::where('created_by', $user->id)
            ->select('id', 'name', 'business_type', 'created_at', 'view_count', 'slug', 'url_prefix', 'custom_domain', 'domain_type');
        
        // Apply search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('business_type', 'like', "%{$search}%");
            });
        }
        
        // Apply business type filter
        if ($businessType !== 'all') {
            $query->where('business_type', $businessType);
        }
        
        // Apply sorting
        $query->orderBy($sortField, $sortDirection);
        
        // Get paginated results
        $businesses = $query->paginate($perPage)->withQueryString();
        
        // Get unique business types for filter dropdown
        $businessTypes = Business::where('created_by', $user->id)
            ->whereNotNull('business_type')
            ->distinct()
            ->pluck('business_type')
            ->filter()
            ->values();

        // Check if Google Wallet settings are configured (global settings)
        $googleWalletIssuerId = Setting::where('key', 'googleWalletIssuerId')->value('value');
        $googleWalletJsonPath = Setting::where('key', 'googleWalletJsonPath')->value('value');
        $hasGoogleWalletSettings = !empty($googleWalletIssuerId) && !empty($googleWalletJsonPath);

        return Inertia::render('google-wallet', [
            'businesses' => $businesses,
            'businessTypes' => $businessTypes,
            'hasGoogleWalletSettings' => $hasGoogleWalletSettings,
            'filters' => [
                'search' => $search,
                'business_type' => $businessType,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function addToWallet(Business $business)
    {
        // Check if demo mode is enabled
        if (config('app.is_demo', false)) {
            return response()->json(['message' => 'This action is disabled in demo mode. You can only create new data, not modify existing demo data.'], 403);
        }
        
        $user = auth()->user();
        
        // Check if user's plan has Google Wallet feature
        $hasGoogleWalletFeature = false;
        if ($user->plan) {
            $hasGoogleWalletFeature = $user->plan->hasFeature('google_wallet');
        }
        
        if (!$hasGoogleWalletFeature) {
            return response()->json(['message' => 'Google Wallet feature is not available in your current plan'], 403);
        }
        
        // Verify the business belongs to the authenticated user
        if ($business->created_by !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if Google Wallet settings are configured
        $googleWalletIssuerId = Setting::where('key', 'googleWalletIssuerId')->value('value');
        $googleWalletJsonPath = Setting::where('key', 'googleWalletJsonPath')->value('value');
        
        if (empty($googleWalletIssuerId) || empty($googleWalletJsonPath)) {
            return response()->json(['message' => 'Google Wallet not configured properly'], 400);
        }

        // Read JSON file content
        $jsonFilePath = storage_path('app/public/' . $googleWalletJsonPath);
        if (!file_exists($jsonFilePath)) {
            return response()->json(['message' => 'Google Wallet JSON file not found'], 400);
        }
        
        $googleWalletJson = file_get_contents($jsonFilePath);
        if (!$googleWalletJson) {
            return response()->json(['message' => 'Failed to read Google Wallet JSON file'], 400);
        }

        try {
            $serviceAccount = json_decode($googleWalletJson, true);
            
            // Create vCard class first
            $this->createVcardClass($business, $googleWalletIssuerId, $serviceAccount);
            
            // Generate the Google Wallet pass URL
            $passUrl = $this->generateWalletPassUrl($business, $googleWalletIssuerId, $googleWalletJson);
            
            return response()->json([
                'success' => true,
                'addUrl' => $passUrl,
                'message' => 'Wallet pass generated successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Google Wallet error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to generate wallet pass: ' . $e->getMessage()], 500);
        }
    }

    private function generateWalletPassUrl(Business $business, $issuerId, $serviceAccountJson)
    {
        $serviceAccount = json_decode($serviceAccountJson, true);
        if (!$serviceAccount || !isset($serviceAccount['private_key'])) {
            throw new \Exception('Invalid service account JSON');
        }

        $vcardUrl = url(($business->url_prefix ? $business->url_prefix . '/' : '') . $business->slug);
        $classId = "{$issuerId}.vcard_pass_{$business->id}";
        
        $passObject = [
            "iss" => $serviceAccount['client_email'],
            "aud" => "google",
            "typ" => "savetowallet",
            "iat" => time(),
            "payload" => [
                "loyaltyObjects" => [
                    [
                        "id" => "{$issuerId}.user_" . auth()->id() . "_{$business->id}",
                        "classId" => $classId,
                        "state" => "active",
                        "accountName" => auth()->user()->name,
                        "barcode" => [
                            "type" => "QR_CODE",
                            "value" => $vcardUrl,
                        ],
                        "textModulesData" => [
                            [
                                "header" => "View My Digital Card",
                                "body" => "Tap or Scan QR to open:\n{$vcardUrl}",
                            ]
                        ],
                        "linksModuleData" => [
                            "uris" => [
                                [
                                    "description" => "View My Digital Card",
                                    "uri" => $vcardUrl
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        return "https://pay.google.com/gp/v/save/" . JWT::encode($passObject, $serviceAccount['private_key'], 'RS256');
    }

    private function createVcardClass(Business $business, $issuerId, $serviceAccount)
    {
        $accessToken = $this->getGoogleAccessToken($serviceAccount);
        if (!$accessToken) {
            throw new \Exception('Failed to get Google access token');
        }

        $classId = "{$issuerId}.vcard_pass_{$business->id}";
        $user = auth()->user();
        
        $existingClass = Http::withToken($accessToken)->get(
            "https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass/{$classId}"
        );

        $classData = [
            "id" => $classId,
            "issuerName" => $user->name,
            "programName" => $business->name ?? 'My Business',
            "reviewStatus" => "UNDER_REVIEW",
            "programLogo" => [
                "sourceUri" => [
                    "uri" => "https://storage.googleapis.com/wallet-lab-tools-codelab-artifacts-public/pass_google_logo.jpg",
                    "description" => "Business Logo"
                ]
            ]
        ];

        if ($existingClass->successful()) {
            $response = Http::withToken($accessToken)->put(
                "https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass/{$classId}",
                $classData
            );
        } else {
            $response = Http::withToken($accessToken)->post(
                'https://walletobjects.googleapis.com/walletobjects/v1/loyaltyClass',
                $classData
            );
        }

        if ($response->failed()) {
            $error = $response->json();
            $errorMessage = $error['error']['message'] ?? 'Unknown error occurred';
            throw new \Exception($errorMessage);
        }

        return $response->json();
    }

    private function getGoogleAccessToken($credentials)
    {
        $jwt = [
            "iss" => $credentials["client_email"],
            "scope" => "https://www.googleapis.com/auth/wallet_object.issuer",
            "aud" => $credentials["token_uri"],
            "iat" => time(),
            "exp" => time() + 3600,
        ];
        
        $jwtEncoded = JWT::encode($jwt, $credentials["private_key"], 'RS256');

        $response = Http::asForm()->post($credentials["token_uri"], [
            "grant_type" => "urn:ietf:params:oauth:grant-type:jwt-bearer",
            "assertion" => $jwtEncoded,
        ]);

        if ($response->failed()) {
            return false;
        }

        return $response['access_token'];
    }
}