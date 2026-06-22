import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import { Building2, Mail } from 'lucide-react';

interface ViewProps {
    company: any;
}

export default function View({ company }: ViewProps) {
    const { t } = useTranslation();

    return (
        <DialogContent className="max-w-xl">
            <DialogHeader>
                <DialogTitle>{t('Company Details')}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
                <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{t('Company Name')}</p>
                        <p className="text-base font-semibold">{company.name}</p>
                    </div>
                </div>
                
                <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{t('Email')}</p>
                        <p className="text-base">{company.email || '-'}</p>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}
