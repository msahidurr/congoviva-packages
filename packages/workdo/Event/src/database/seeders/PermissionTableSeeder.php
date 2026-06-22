<?php

namespace Workdo\Event\Database\Seeders;

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
        $module = 'Event';

        $permissions = [
            ['name' => 'manage-event', 'module' => $module, 'label' => 'Manage Event', 'description' => 'Can manage Event'],
            ['name' => 'create-event', 'module' => $module, 'label' => 'Create Event', 'description' => 'Can create Event'],
            ['name' => 'edit-event', 'module' => $module, 'label' => 'Edit Event', 'description' => 'Can edit Event'],
            ['name' => 'delete-event', 'module' => $module, 'label' => 'Delete Event', 'description' => 'Can delete Event'],
            ['name' => 'analytics-event', 'module' => $module, 'label' => 'Analytics Event', 'description' => 'Can view Event analytics']
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
