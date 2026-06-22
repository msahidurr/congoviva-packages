import React from 'react';
import PermissionGate, { usePermissions } from '../PermissionGate';

const PermissionExample: React.FC = () => {
    const { hasPermission, canAccess, userType } = usePermissions();

    return (
        <div className="space-y-4">
            {/* Example 1: Show content based on permission */}
            <PermissionGate permission="manage-users">
                <button className="btn btn-primary">
                    Create User
                </button>
            </PermissionGate>

            {/* Example 2: Show content based on multiple permissions (OR logic) */}
            <PermissionGate permission={['edit-users', 'manage-users']}>
                <button className="btn btn-secondary">
                    Edit User
                </button>
            </PermissionGate>

            {/* Example 3: Show content based on role */}
            <PermissionGate role="superadmin">
                <div className="alert alert-info">
                    You are a Super Admin
                </div>
            </PermissionGate>

            {/* Example 4: Show content based on user type */}
            <PermissionGate userType="company">
                <div className="alert alert-success">
                    Company Dashboard Features
                </div>
            </PermissionGate>

            {/* Example 5: Show fallback content when permission is missing */}
            <PermissionGate 
                permission="manage-settings"
                fallback={<div className="text-gray-500">You don't have access to settings</div>}
            >
                <button className="btn btn-warning">
                    Manage Settings
                </button>
            </PermissionGate>

            {/* Example 6: Using hooks for conditional logic */}
            <div>
                {hasPermission('view-analytics') && (
                    <div>Analytics content here</div>
                )}
                
                {canAccess('users', 'create') && (
                    <button>Add New User</button>
                )}
                
                {userType === 'superadmin' && (
                    <div>Super Admin only content</div>
                )}
            </div>

            {/* Example 7: Complex permission logic */}
            <PermissionGate permission="manage-businesses">
                <div className="card">
                    <div className="card-header">
                        <h3>Business Management</h3>
                    </div>
                    <div className="card-body">
                        <PermissionGate permission="create-businesses">
                            <button className="btn btn-success mr-2">
                                Create Business
                            </button>
                        </PermissionGate>
                        
                        <PermissionGate permission="edit-businesses">
                            <button className="btn btn-primary mr-2">
                                Edit Business
                            </button>
                        </PermissionGate>
                        
                        <PermissionGate permission="delete-businesses">
                            <button className="btn btn-danger">
                                Delete Business
                            </button>
                        </PermissionGate>
                    </div>
                </div>
            </PermissionGate>
        </div>
    );
};

export default PermissionExample;