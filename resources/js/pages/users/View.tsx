import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import { User, Mail, Shield } from 'lucide-react';

interface ViewProps {
    user: any;
}

export default function View({ user }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-w-xl">
            <DialogHeader>
                <DialogTitle>{t('User Details')}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
                <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{t('Name')}</p>
                        <p className="text-base font-semibold">{user.name}</p>
                    </div>
                </div>
                
                <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{t('Email')}</p>
                        <p className="text-base">{user.email}</p>
                    </div>
                </div>
                
                <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{t('Roles')}</p>
                        <p className="text-base">{user.roles.map((role: any) => role.label || role.name).join(', ')}</p>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}
