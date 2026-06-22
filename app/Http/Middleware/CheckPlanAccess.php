<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;

class CheckPlanAccess
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();
        
        if (!$user) {
            return $next($request);
        }

        // Super admin has full access
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Check if user needs plan subscription (this covers expired plans, trials, etc.)
        if ($user->needsPlanSubscription()) {
            $message = __('Please subscribe to a plan to continue.');
            
            if ($user->isTrialExpired()) {
                $message = __('Your trial period has expired. Please subscribe to a plan to continue.');
            } elseif ($user->isPlanExpired()) {
                $message = __('Your plan has expired. Please renew your subscription.');
            }
            
            return redirect()->route('plans.index')->with('error', $message);
        }
        
        // For staff users, check their company's plan status
        if ($user->type !== 'company' && $user->created_by) {
            $companyUser = User::find($user->created_by);
            if ($companyUser && $companyUser->type === 'company' && $companyUser->needsPlanSubscription()) {
                $message = __('Your company plan has expired. Please contact your administrator.');
                return redirect()->route('plans.index')->with('error', $message);
            }
        }

        return $next($request);
    }
}