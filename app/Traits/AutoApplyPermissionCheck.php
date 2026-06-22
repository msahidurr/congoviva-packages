<?php

namespace App\Traits;

use Spatie\Permission\Exceptions\PermissionDoesNotExist;
use Illuminate\Support\Facades\Schema;

trait AutoApplyPermissionCheck
{
    /**
     * Apply permission check to a model query
     *
     * @param string $modelClass The fully qualified model class name
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function queryWithPermission($modelClass)
    {
        return $modelClass::withPermissionCheck();
    }

    /**
     * Apply permission scope to the query based on user's permissions
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $module The module name (e.g., 'roles', 'permissions')
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function applyPermissionScope($query, $module)
    {
        // Skip permission check if no authenticated user (e.g., in console commands)
        if (!auth()->check()) {
            return $query;
        }

        $user = auth()->user();
        
        // Check if user is superadmin - they can see everything
        if ($user->hasRole(['superadmin']) || $user->type === 'superadmin') {
            return $query;
        }
        
        // Determine the company ID for filtering
        $companyId = $user->type === 'company' ? $user->id : $user->created_by;
        
        // For company users and staff users, show only their company's records
        if (Schema::hasColumn($query->getModel()->getTable(), 'created_by')) {
            return $query->where('created_by', $companyId);
        }
        
        return $query;
    }
}