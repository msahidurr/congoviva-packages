<?php
namespace App\Http\Controllers;

use App\Models\Role;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Permission;
use Illuminate\Support\Str;
use App\Http\Requests\RoleRequest;
use Illuminate\Support\Facades\Auth;

class RoleController extends BaseController
{
    /**
     * Constructor to apply middleware
     */
   

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $roleQuery = Role::withPermissionCheck()->with(['permissions', 'creator']);

        // Handle search
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $roleQuery->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Handle sorting
        if ($request->has('sort_field') && $request->has('sort_direction')) {
            $roleQuery->orderBy($request->sort_field, $request->sort_direction);
        }

        // Handle pagination
        $perPage = $request->has('per_page') ? (int)$request->per_page : 10;
        $roles = $roleQuery->paginate($perPage)->withQueryString();

        $permissions = PermissionService::getPermissionsByModule();

        return Inertia::render('roles/index', [
            'roles'       => $roles,
            'permissions' => $permissions,
        ]);
    }



    /**
     * Validate permissions against user's allowed modules
     */
    private function validatePermissions(array $permissionNames)
    {
        $user = Auth::user();
        $userType = $user->type ?? 'company';
        
        // Superadmin can assign any permission
        if ($userType === 'superadmin' || $userType === 'super admin') {
            return $permissionNames;
        }
        
        // Get allowed modules for current user role
        $allowedModules = config('role-permissions.' . $userType, config('role-permissions.company'));
        
        // Build query to get valid permissions
        $query = Permission::whereIn('module', $allowedModules)
            ->whereIn('name', $permissionNames);
        
        // For company users, restrict settings permissions to only email, system and brand settings
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
        
        $validPermissions = $query->pluck('name')->toArray();
        
        return $validPermissions;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
        // Validate permissions against user's allowed modules
        $validatedPermissions = $this->validatePermissions($request->permissions ?? []);
        
        // Use direct model creation to bypass Spatie's duplicate check
        $role = new Role();
        $role->label = $request->label;
        $role->name = Str::slug($request->label);
        $role->description = $request->description;
        $role->created_by = Auth::id();
        $role->guard_name = 'web';
        $role->save();

        if ($role) {
            $role->syncPermissions($validatedPermissions);

            return redirect()->route('roles.index')->with('success', __('Role created successfully with Permissions!'));
        }
        return redirect()->back()->with('error', __('Unable to create Role with permissions. Please try again!'));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, Role $role)
    {
        if ($role) {
            // Validate permissions against user's allowed modules
            $validatedPermissions = $this->validatePermissions($request->permissions ?? []);
            
            $newSlug = Str::slug($request->label);
            
            // Only update name if it's different to avoid duplicate key error
            if ($role->name !== $newSlug) {
                $role->name = $newSlug;
            }
            
            $role->label       = $request->label;
            $role->description = $request->description;

            $role->save();

            # Update the permissions
            $role->syncPermissions($validatedPermissions);

            return redirect()->route('roles.index')->with('success', __('Role updated successfully with Permissions!'));
        }
        return redirect()->back()->with('error', __('Unable to update Role with permissions. Please try again!'));

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        if ($role) {
            // Prevent deletion of system roles
            if ($role->is_system_role) {
                return redirect()->back()->with('error', __('System roles cannot be deleted!'));
            }
            
            $role->delete();

            return redirect()->route('roles.index')->with('success', __('Role deleted successfully!'));
        }
        return redirect()->back()->with('error', __('Unable to delete Role. Please try again!'));
    }
}