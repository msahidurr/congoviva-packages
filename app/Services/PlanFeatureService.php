<?php

namespace App\Services;

use App\Models\Plan;
use App\Models\User;

class PlanFeatureService
{
    /**
     * Check if a user has access to a specific feature
     *
     * @param User $user
     * @param string $feature
     * @return bool
     */
    public static function hasFeature(User $user, string $feature): bool
    {
        $plan = self::getUserPlan($user);
        
        if (!$plan) {
            return false;
        }
        
        return $plan->hasFeature($feature);
    }
    
    /**
     * Check if a user has access to a specific business template section
     *
     * @param User $user
     * @param string $section
     * @return bool
     */
    public static function hasTemplateSection(User $user, string $section): bool
    {
        $plan = self::getUserPlan($user);
        
        if (!$plan) {
            return false;
        }
        
        return $plan->hasTemplateSection($section);
    }
    
    /**
     * Get allowed template sections for a user
     *
     * @param User $user
     * @return array
     */
    public static function getAllowedTemplateSections(User $user): array
    {
        $plan = self::getUserPlan($user);
        
        if (!$plan) {
            return [];
        }
        
        $allowedSections = $plan->getAllowedTemplateSections();
        
        // If no sections are specified, return all available sections
        if (empty($allowedSections)) {
            return array_keys(Plan::getAllTemplateSections());
        }
        
        return $allowedSections;
    }
    
    /**
     * Filter business template sections based on user's plan
     *
     * @param User $user
     * @param array $templateSections
     * @return array
     */
    public static function filterTemplateSections(User $user, array $templateSections): array
    {
        $allowedSections = self::getAllowedTemplateSections($user);
        
        // If no restrictions, return all sections
        if (empty($allowedSections)) {
            return $templateSections;
        }
        
        // Filter sections based on plan restrictions
        return array_filter($templateSections, function($section) use ($allowedSections) {
            return in_array($section['key'], $allowedSections);
        });
    }
    
    /**
     * Get the user's plan (handles both company users and staff users)
     *
     * @param User $user
     * @return Plan|null
     */
    private static function getUserPlan(User $user): ?Plan
    {
        // Super admin has access to everything
        if ($user->type === 'superadmin') {
            return null;
        }
        
        // Company user - use their plan
        if ($user->type === 'company' && $user->plan) {
            return $user->plan;
        }
        
        // Staff user - use company's plan
        if ($user->created_by) {
            $companyUser = User::find($user->created_by);
            if ($companyUser && $companyUser->type === 'company' && $companyUser->plan) {
                return $companyUser->plan;
            }
        }
        
        return null;
    }
    
    /**
     * Get all enabled features for a user
     *
     * @param User $user
     * @return array
     */
    public static function getEnabledFeatures(User $user): array
    {
        $plan = self::getUserPlan($user);
        
        if (!$plan) {
            return [];
        }
        
        return $plan->getEnabledFeatures();
    }
    
    /**
     * Check multiple features at once
     *
     * @param User $user
     * @param array $features
     * @return array
     */
    public static function checkFeatures(User $user, array $features): array
    {
        $results = [];
        
        foreach ($features as $feature) {
            $results[$feature] = self::hasFeature($user, $feature);
        }
        
        return $results;
    }
}