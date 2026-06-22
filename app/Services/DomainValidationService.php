<?php

namespace App\Services;

use App\Models\Business;
use App\Models\BioLink;

class DomainValidationService
{
    /**
     * Check if a slug + url_prefix combination is available across both tables
     */
    public static function isSlugAvailable(string $slug, string $urlPrefix = null, ?int $excludeBusinessId = null, ?int $excludeBioLinkId = null): bool
    {
        if (empty($slug)) {
            return true;
        }

        // Check in businesses table
        $businessQuery = Business::where('slug', $slug)->where('url_prefix', $urlPrefix);
        if ($excludeBusinessId) {
            $businessQuery->where('id', '!=', $excludeBusinessId);
        }
        
        if ($businessQuery->exists()) {
            return false;
        }

        // Check in bio_links table
        $bioLinkQuery = BioLink::where('slug', $slug)->where('url_prefix', $urlPrefix);
        if ($excludeBioLinkId) {
            $bioLinkQuery->where('id', '!=', $excludeBioLinkId);
        }
        
        return !$bioLinkQuery->exists();
    }

    /**
     * Check if a custom domain is available across both tables
     */
    public static function isDomainAvailable(string $domain, ?int $excludeBusinessId = null, ?int $excludeBioLinkId = null): bool
    {
        if (empty($domain)) {
            return true;
        }

        // Check in businesses table
        $businessQuery = Business::where('custom_domain', $domain);
        if ($excludeBusinessId) {
            $businessQuery->where('id', '!=', $excludeBusinessId);
        }
        
        if ($businessQuery->exists()) {
            return false;
        }

        // Check in bio_links table
        $bioLinkQuery = BioLink::where('custom_domain', $domain);
        if ($excludeBioLinkId) {
            $bioLinkQuery->where('id', '!=', $excludeBioLinkId);
        }
        
        return !$bioLinkQuery->exists();
    }

    /**
     * Generate a unique slug across both tables
     */
    public static function generateUniqueSlug(string $name, string $urlPrefix = null, ?int $excludeBusinessId = null, ?int $excludeBioLinkId = null): string
    {
        $slug = \Illuminate\Support\Str::slug($name);
        
        // Ensure slug only contains valid characters
        $slug = preg_replace('/[^a-zA-Z0-9-_]/', '-', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        $slug = trim($slug, '-');
        
        // If slug is empty after sanitization, use a default
        if (empty($slug)) {
            $slug = 'business-' . time();
        }
        
        $originalSlug = $slug;
        $counter = 1;

        while (!self::isSlugAvailable($slug, $urlPrefix, $excludeBusinessId, $excludeBioLinkId)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Validate slug and domain for business creation/update
     */
    public static function validateBusiness(array $data, ?int $excludeBusinessId = null): array
    {
        $errors = [];
        $urlPrefix = $data['url_prefix'] ?? null;
        $domainType = $data['domain_type'] ?? 'slug';

        // Validate slug + url_prefix combination
        if (!empty($data['slug'])) {
            if (!self::isSlugAvailable($data['slug'], $urlPrefix, $excludeBusinessId, null)) {
                if ($domainType === 'slug') {
                    $errors['slug'] = __('This URL path is already taken.');
                } else {
                    $errors['slug'] = __('This slug is already taken.');
                }
            }
        }

        // Validate custom domain
        if (!empty($data['custom_domain'])) {
            if (!self::isDomainAvailable($data['custom_domain'], $excludeBusinessId, null)) {
                $errors['custom_domain'] = __('This domain is already taken.');
            }
        }

        return $errors;
    }

    /**
     * Validate slug and domain for bio link creation/update
     */
    public static function validateBioLink(array $data, ?int $excludeBioLinkId = null): array
    {
        $errors = [];
        $urlPrefix = $data['url_prefix'] ?? 'bio';
        $domainType = $data['domain_type'] ?? 'slug';

        // Validate slug + url_prefix combination
        if (!empty($data['slug'])) {
            if (!self::isSlugAvailable($data['slug'], $urlPrefix, null, $excludeBioLinkId)) {
                if ($domainType === 'slug') {
                    $errors['slug'] = __('This URL path is already taken.');
                } else {
                    $errors['slug'] = __('This slug is already taken.');
                }
            }
        }

        // Validate custom domain
        if (!empty($data['custom_domain'])) {
            if (!self::isDomainAvailable($data['custom_domain'], null, $excludeBioLinkId)) {
                $errors['custom_domain'] = __('This domain is already taken.');
            }
        }

        return $errors;
    }
}