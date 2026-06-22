import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface ViewProps {
    role: any;
}

export default function View({ role }: ViewProps) {
    const { t } = useTranslation();
    const { permissions = {} } = usePage().props as any;

    // Group role permissions by module
    const groupPermissionsByModule = () => {
        if (!role?.permissions || !permissions) return {};

        const grouped: Record<string, any[]> = {};

        // Create a map of permission names to permission objects
        const permissionMap: Record<string, any> = {};
        Object.entries(permissions).forEach(([module, modulePermissions]: [string, any[]]) => {
            modulePermissions.forEach(permission => {
                permissionMap[permission.name] = { ...permission, module };
            });
        });

        // Group role permissions by module
        role.permissions.forEach((rolePermission: any) => {
            const permissionName = rolePermission.name || rolePermission;
            const permissionData = permissionMap[permissionName];

            if (permissionData) {
                const module = permissionData.module;
                if (!grouped[module]) {
                    grouped[module] = [];
                }
                grouped[module].push(permissionData);
            }
        });

        return grouped;
    };

    const groupedPermissions = groupPermissionsByModule();

    return (
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
                <DialogTitle>{role.label}</DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto flex-1 space-y-6 pr-2">
                {role.description && (
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('Description')}</h3>
                        <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{role.description}</p>
                    </div>
                )}

                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">{t('Permissions')}</h3>

                    {Object.keys(groupedPermissions).length > 0 ? (
                        <div className="space-y-3">
                            {Object.entries(groupedPermissions).map(([module, modulePermissions]: [string, any[]]) => (
                                <div key={module} className="border rounded-lg overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50">
                                        <h4 className="text-sm font-medium text-foreground capitalize">{module.replace(/_/g, ' ')}</h4>
                                        <span className="text-xs text-muted-foreground">
                                            {modulePermissions.length}
                                        </span>
                                    </div>

                                    <div className="px-4 py-3 bg-card">
                                        <div className="flex flex-wrap gap-2">
                                            {modulePermissions.map((permission, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-foreground"
                                                >
                                                    {permission.label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="border border-dashed rounded-lg p-8 text-center">
                            <Shield className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">{t('No permissions assigned')}</p>
                        </div>
                    )}
                </div>
            </div>
        </DialogContent>
    );
}
