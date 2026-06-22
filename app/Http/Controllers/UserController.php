<?php
namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\Role;
use App\Models\User;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $authUser     = Auth::user();
        $authUserRole = $authUser->roles->first()?->name;
        // Allow superadmin, admin, product-manager, contact-manager, viewer
        if (!$authUser->hasPermissionTo('view-users')) {
            abort(403, 'Unauthorized Access Prevented');
        }

        $userQuery = User::withPermissionCheck()->with(['roles', 'creator'])->latest();
        # Admin
        if ($authUserRole === 'super admin') {
            $userQuery->whereDoesntHave('roles', function ($q) {
                $q->where('name', 'super admin');
            });
        }

        // Handle search
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $userQuery->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Handle role filter
        if ($request->has('role') && $request->role !== 'all') {
            $userQuery->whereHas('roles', function($q) use ($request) {
                $q->where('roles.id', $request->role);
            });
        }

        // Handle sorting
        if ($request->has('sort_field') && $request->has('sort_direction')) {
            $userQuery->orderBy($request->sort_field, $request->sort_direction);
        }

        // Handle pagination
        $perPage = $request->has('per_page') ? (int)$request->per_page : 10;
        $users = $userQuery->paginate($perPage)->withQueryString();

        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'type' => $user->type,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'created_by' => $user->created_by,
                'roles' => $user->roles,
                'creator' => $user->creator,
                'avatar_url' => $user->avatar_url,
            ];
        });

        # Roles listing - Get all roles without filtering
        if ($authUserRole == 'company') {
            $roles = Role::where('created_by', $authUser->id)->get();
        } else {
            $roles = Role::get();
        }

        // Get plan limits for company users and staff users
        $planLimits = null;
        if ($authUser->type === 'company' && $authUser->plan) {
            $currentUserCount = User::where('created_by', $authUser->id)->count();
            $planLimits = [
                'current_users' => $currentUserCount,
                'max_users' => $authUser->plan->max_users,
                'can_create' => $currentUserCount < $authUser->plan->max_users
            ];
        }
        // Check for staff users (created by company users)
        elseif ($authUser->type !== 'superadmin' && $authUser->created_by) {
            $companyUser = User::find($authUser->created_by);
            if ($companyUser && $companyUser->type === 'company' && $companyUser->plan) {
                $currentUserCount = User::where('created_by', $companyUser->id)->count();
                $planLimits = [
                    'current_users' => $currentUserCount,
                    'max_users' => $companyUser->plan->max_users,
                    'can_create' => $currentUserCount < $companyUser->plan->max_users
                ];
            }
        }
        
        return Inertia::render('users/index', [
            'users' => $users,
            'roles' => $roles,
            'planLimits' => $planLimits,
            'filters' => [
                'search' => $request->search ?? '',
                'role' => $request->role ?? 'all',
                'per_page' => $perPage,
                'sort_field' => $request->sort_field ?? 'created_at',
                'sort_direction' => $request->sort_direction ?? 'desc',
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        // Set user language to super admin's default language
        $authUser = Auth::user();
        $userLang = \App\Models\Setting::where('user_id', $authUser->id)
                ->where('key', 'defaultLanguage')
                ->value('value') ?? 'en';
        // Check plan limits for company users
        $authUser = Auth::user();
        if ($authUser->type === 'company' && $authUser->plan) {
            $currentUserCount = User::where('created_by', $authUser->id)->count();
            $maxUsers = $authUser->plan->max_users;
            
            if ($currentUserCount >= $maxUsers) {
                return redirect()->back()->with('error', __('User limit exceeded. Your plan allows maximum :max users. Please upgrade your plan.', ['max' => $maxUsers]));
            }
        }
        // Check plan limits for staff users (created by company users)
        elseif ($authUser->type !== 'superadmin' && $authUser->created_by) {
            $companyUser = User::find($authUser->created_by);
            if ($companyUser && $companyUser->type === 'company' && $companyUser->plan) {
                $currentUserCount = User::where('created_by', $companyUser->id)->count();
                $maxUsers = $companyUser->plan->max_users;
                
                if ($currentUserCount >= $maxUsers) {
                    return redirect()->back()->with('error', __('User limit exceeded. Your company plan allows maximum :max users. Please contact your administrator.', ['max' => $maxUsers]));
                }
            }
        }
        
        if (!in_array(auth()->user()->type, ['superadmin', 'company'])) {
            $created_by = auth()->user()->created_by;
        } else {
            $created_by = auth()->id();
        }
        
        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'created_by' => $created_by,
            'lang'       => $userLang,
        ]);

        if ($user && $request->roles) {
            // Find role and assign
            if (!in_array(auth()->user()->type, ['superadmin', 'company'])) {
                $created_by = auth()->user()->created_by;
            } else {
                $created_by = auth()->id();
            }
            
            $role = Role::where('id', $request->roles)
                ->where('created_by', $created_by)->first();
            
            if ($role) {
                $user->assignRole($role);
                $user->type = $role->name;
                $user->save();
                
                // Trigger email notification
                event(new \App\Events\UserCreated($user, $request->password));
                
                // Check for email errors
                if (session()->has('email_error')) {
                    return redirect()->route('users.index')->with('warning', __('User created successfully, but welcome email failed: ') . session('email_error'));
                }
                
                return redirect()->route('users.index')->with('success', __('User created with role and permissions'));
            }
        }
        return redirect()->back()->with('error', __('Unable to create User. Please try again!'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user)
    {
        if ($user) {
            $user->name  = $request->name;
            $user->email = $request->email;            

            // Update role and permissions
            if ($request->roles) {
                if (!in_array(auth()->user()->type, ['superadmin', 'company'])) {
                    $created_by = auth()->user()->created_by;
                } else {
                    $created_by = auth()->id();
                }
                
                $role = Role::where('id', $request->roles)
                    ->where('created_by', $created_by)->first();
                
                if ($role) {
                    $user->syncRoles([$role]);
                    $user->type = $role->name;
                }
            }

            $user->save();
            return redirect()->route('users.index')->with('success', __('User updated with roles'));
        }
        return redirect()->back()->with('error', __('Unable to update User. Please try again!'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if ($user) {
            $user->delete();
            return redirect()->route('users.index')->with('success', __('User deleted with roles'));
        }
        return redirect()->back()->with('error', __('Unable to delete User. Please try again!'));
    }

    /**
     * Reset user password
     */
    public function resetPassword(Request $request, User $user)
    {
        $request->validate([
            'password' => 'required|min:8|confirmed',
        ]);

        $user->password = Hash::make($request->password);
        $user->save();

        return redirect()->route('users.index')->with('success', __('Password reset successfully'));
    }

    /**
     * Toggle user status
     */
    public function toggleStatus(User $user)
    {
        $user->status = $user->status === 'active' ? 'inactive' : 'active';
        $user->save();

        return redirect()->route('users.index')->with('success', __('User status updated successfully'));
    }
    
    /**
     * Switch current business for the authenticated user
     */
    public function switchBusiness(Request $request)
    {
        $request->validate([
            'business_id' => 'required|integer|exists:businesses,id'
        ]);
        
        $user = Auth::user();
        
        // Verify the business belongs to the user
        $business = $user->businesses()->where('id', $request->business_id)->first();
        
        if (!$business) {
            return back()->with('error', __('Business not found or unauthorized'));
        }
        
        // Check if demo mode is enabled
        if (config('app.is_demo')) {
            // Store business ID in cookie instead of updating the database
            $cookieName = 'demo_business_id';
            $cookieExpiration = 60 * 24; // 24 hours
            
            // Set cookie with the business ID
            cookie()->queue($cookieName, $request->business_id, $cookieExpiration);
            
            // Return success message
            return back()->with('success', __('Business switched successfully (Demo Mode)'));
        } else {
            // Normal mode - update current_business in database
            $user->current_business = $request->business_id;
            $user->save();
            
            return back()->with('success', __('Business switched successfully'));
        }
    }
}
