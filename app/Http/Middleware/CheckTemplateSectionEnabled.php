<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTemplateSectionEnabled
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get user's config sections
        $user = auth()->user();
        $configSections = null;
        
        if ($user && isset($user->config_sections)) {
            $configSections = is_string($user->config_sections) 
                ? json_decode($user->config_sections, true) 
                : $user->config_sections;
        }
        
        // Check if templates section is enabled
        if (!isTemplatesSectionEnabled($configSections)) {
            // If accessing templates route and section is disabled, redirect or return error
            if ($request->route() && str_contains($request->route()->getName() ?? '', 'template')) {
                return redirect()->route('dashboard')->with('error', 'Templates section is disabled.');
            }
        }

        return $next($request);
    }
}