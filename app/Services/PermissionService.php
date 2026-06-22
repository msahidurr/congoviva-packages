<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\Auth;

class PermissionService
{
    /**
     * Get user permissions for frontend
     */
    public static function getUserPermissions($user = null)
    {
        $user = $user ?: Auth::user();
        
        if (!$user) {
            return [];
        }

        return $user->getAllPermissions()->pluck('name')->toArray();
    }

    /**
     * Check if user has permission
     */
    public static function hasPermission($permission, $user = null)
    {
        $user = $user ?: Auth::user();
        
        if (!$user) {
            return false;
        }

        return $user->hasPermissionTo($permission);
    }

    /**
     * Get role permissions for display
     */
    public static function getRolePermissions($roleId)
    {
        $role = Role::find($roleId);
        
        if (!$role) {
            return [];
        }

        return $role->permissions->pluck('name')->toArray();
    }

    /**
     * Assign role to user with permissions
     */
    public static function assignRoleToUser($userId, $roleId)
    {
        $user = User::find($userId);
        $role = Role::find($roleId);

        if (!$user || !$role) {
            return false;
        }

        // Remove existing roles and assign new role
        $user->syncRoles([$role->name]);
        
        // Update user type to match role name
        $user->type = $role->name;
        $user->save();

        return true;
    }

    /**
     * Get permissions grouped by module for role creation/editing
     */
    public static function getPermissionsByModule($userType = null)
    {
        $userType = $userType ?: Auth::user()->type;
        
        // Superadmin can see all permissions
        if ($userType === 'superadmin' || $userType === 'super admin') {
            return Permission::all()->groupBy('module');
        }
        
        // Get allowed modules for current user role
        $allowedModules = config('role-permissions.' . $userType, config('role-permissions.company'));
        
        // Filter permissions by allowed modules
        $query = Permission::whereIn('module', $allowedModules);
        
        // For company users, filter specific settings permissions
        if ($userType === 'company') {
            $query->where(function($q) {
                $q->where('module', '!=', 'settings')
                  ->orWhereIn('name', [
                      'manage-email-settings',
                      'manage-system-settings', 
                      'manage-brand-settings'
                  ]);
            });
        }
        
        return $query->get()->groupBy('module');
    }
}