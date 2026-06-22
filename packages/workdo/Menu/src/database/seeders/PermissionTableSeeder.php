<?php

namespace Workdo\Menu\Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Artisan;

class PermissionTableSeeder extends Seeder
{
     public function run()
    {
        Model::unguard();
        Artisan::call('cache:clear');
        $module = 'Menu';

        $permissions = [
            ['name' => 'manage-menu', 'module' => $module, 'label' => 'Manage Menu', 'description' => 'Can manage Menu'],
            ['name' => 'create-menu', 'module' => $module, 'label' => 'Create Menu', 'description' => 'Can create Menu'],
            ['name' => 'edit-menu', 'module' => $module, 'label' => 'Edit Menu', 'description' => 'Can edit Menu'],
            ['name' => 'delete-menu', 'module' => $module, 'label' => 'Delete Menu', 'description' => 'Can delete Menu'],
            ['name' => 'analytics-menu', 'module' => $module, 'label' => 'Analytics Menu', 'description' => 'Can view Menu analytics'],
        ];

        $roles = Role::whereIn('name', ['company', 'superadmin'])->get();
        
        foreach ($permissions as $value) {
            $permission = Permission::where('name', $value['name'])->first();
            
            if (!$permission) {
                $permission = Permission::create([
                    'name' => $value['name'],
                    'label' => $value['label'],
                    'description' => $value['description'],
                    'guard_name' => 'web',
                    'module' => $value['module'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
            
            foreach ($roles as $role) {
                if (!$role->hasPermissionTo($value['name'])) {
                    $role->givePermissionTo($permission);
                }
            }
        }
    }
}
