<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Business;
use App\Models\BioLink;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Exception;

class BlockAdminOnCustomDomain
{
    private const ADMIN_ROUTES = [
        'login', 'register', 'password', 'email', 'dashboard', 'api', 'admin',
        'users', 'roles', 'permissions', 'plans', 'companies', 'contacts',
        'appointments', 'calendar', 'nfc-cards', 'coupons', 'campaigns',
        'currencies', 'vcard-builder', 'landing-page',
        'impersonate', 'referral', 'link-bio-builder', 'analytics',
        'media-library', 'manage-language'
    ];
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $host = $request->getHost();
        $isCustomDomain = $this->isCustomDomain($host);
        
        if ($isCustomDomain) {
            $path = trim($request->path(), '/');
            $segments = explode('/', $path, 2);
            $firstSegment = $segments[0] ?? '';
            
            if (in_array($firstSegment, self::ADMIN_ROUTES)) {
                return Inertia::render('public/VCardNotFound');
            }
        }
        
        return $next($request);
    }
    
    /**
     * Check if the current host is a custom domain
     */
    private function isCustomDomain(string $host): bool
    {
        try {
            // Check database connection and table existence
            if (!$this->isDatabaseReady()) {
                return false;
            }
            
            // Check if it's a business custom domain
            if (Schema::hasTable('businesses')) {
                $business = Business::where('custom_domain', $host)
                    ->where('domain_type', 'domain')
                    ->first();
                    
                if ($business) {
                    return true;
                }
            }
            
            // Check if it's a biolink custom domain
            if (Schema::hasTable('bio_links')) {
                $bioLink = BioLink::where('custom_domain', $host)
                    ->where('is_active', true)
                    ->first();
                    
                return $bioLink !== null;
            }
            
            return false;
        } catch (Exception $e) {
            // Log error but don't block the request during setup
            \Log::debug('BlockAdminOnCustomDomain middleware error: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Check if database is ready and accessible
     */
    private function isDatabaseReady(): bool
    {
        try {
            DB::connection()->getPdo();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}