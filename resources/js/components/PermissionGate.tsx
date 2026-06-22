import React from 'react';
import { usePage } from '@inertiajs/react';

interface PermissionGateProps {
    permission?: string | string[];
    role?: string | string[];
    userType?: string | string[];
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

interface AuthData {
    permissions: string[];
    roles: string[];
    user_type: string;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
    permission,
    role,
    userType,
    fallback = null,
    children
}) => {
    const { auth } = usePage().props as { auth: AuthData };

    // Check permissions
    if (permission) {
        const permissions = Array.isArray(permission) ? permission : [permission];
        const hasPermission = permissions.some(perm => auth.permissions?.includes(perm));
        
        if (!hasPermission) {
            return <>{fallback}</>;
        }
    }

    // Check roles
    if (role) {
        const roles = Array.isArray(role) ? role : [role];
        const hasRole = roles.some(r => auth.roles?.includes(r));
        
        if (!hasRole) {
            return <>{fallback}</>;
        }
    }

    // Check user type
    if (userType) {
        const userTypes = Array.isArray(userType) ? userType : [userType];
        const hasUserType = userTypes.includes(auth.user_type);
        
        if (!hasUserType) {
            return <>{fallback}</>;
        }
    }

    return <>{children}</>;
};

export default PermissionGate;

// Hook for checking permissions in components
export const usePermissions = () => {
    const { auth } = usePage().props as { auth: AuthData };

    const hasPermission = (permission: string | string[]): boolean => {
        const permissions = Array.isArray(permission) ? permission : [permission];
        return permissions.some(perm => auth.permissions?.includes(perm));
    };

    const hasRole = (role: string | string[]): boolean => {
        const roles = Array.isArray(role) ? role : [role];
        return roles.some(r => auth.roles?.includes(r));
    };

    const hasUserType = (userType: string | string[]): boolean => {
        const userTypes = Array.isArray(userType) ? userType : [userType];
        return userTypes.includes(auth.user_type);
    };

    const canAccess = (module: string, action: string = 'view'): boolean => {
        const permission = `${action}-${module}`;
        const managePermission = `manage-${module}`;
        
        return hasPermission([permission, managePermission]);
    };

    return {
        permissions: auth.permissions || [],
        roles: auth.roles || [],
        userType: auth.user_type,
        hasPermission,
        hasRole,
        hasUserType,
        canAccess
    };
};