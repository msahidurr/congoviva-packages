<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BusinessController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->user()->businesses();
        
        // Search
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);
        
        // Per page
        $perPage = min($request->get('per_page', 10), 100);
        $businesses = $query->paginate($perPage);

        $url = url('/');
        $app_url = trim(env('APP_URL'), '/');
        $businessArray = [];
        
        foreach ($businesses->items() as $key => $business) {
            if (!$business) continue;
            
            $businessArray[$key] = [
                'id' => $business->id ?? 0,
                'title' => $business->name ?? '',
                'logo' => !empty($business->logo) ? $url.'/storage/card_logo/'.$business->logo : asset("custom/img/logo-placeholder-image-2.png"),
                'domain' => $business->custom_domain ?? '',
                'links' => $app_url . '/' . ($business->url_prefix ? ($business->url_prefix . '/') : '')  . ($business->slug ?? ''),
                'subdomain' => $business->subdomain ?? '',
                'qrcode_base64' => base64_encode(\QrCode::format('svg')->size(512)->generate($app_url . '/' . ($business->url_prefix ? ($business->url_prefix . '/') : '') . ($business->slug ?? ''))),
                'created_at' => $business->created_at ?? null,
            ];
        }

        return apiSuccess(__('Businesses retrieved successfully'), [
            'businesses' => $businessArray,
            'pagination' => [
                'current_page' => $businesses->currentPage(),
                'last_page' => $businesses->lastPage(),
                'per_page' => $businesses->perPage(),
                'total' => $businesses->total(),
            ]
        ]);
    }
}