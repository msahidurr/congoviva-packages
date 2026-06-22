import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Building2, Calendar, MessageSquare, FileText, Tag } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Contact {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    message?: string;
    status: string;
    notes?: string;
    subject?: string;
    business?: {
        name: string;
    };
    created_at?: string;
}

interface ViewProps {
    contact: Contact;
}

export default function View({ contact }: ViewProps) {
    const { t } = useTranslation();

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'new': 'bg-blue-100 text-blue-700',
            'contacted': 'bg-yellow-100 text-yellow-700',
            'qualified': 'bg-purple-100 text-purple-700',
            'converted': 'bg-green-100 text-green-700',
            'closed': 'bg-gray-100 text-gray-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
                <DialogTitle>{t('Contact Details')}</DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto flex-1 space-y-6 pr-2">
                {/* Contact Header Card */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-lg p-5 border border-primary/20">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                                <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
                                    <User className="h-7 w-7 text-primary" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 break-words">{contact.name}</h3>
                                <div className="flex flex-col gap-1.5">
                                    {contact.email && (
                                        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 break-all">
                                            <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                                            <span className="break-all">{contact.email}</span>
                                        </span>
                                    )}
                                    {contact.phone && (
                                        <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                                            {contact.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Badge className={`${getStatusColor(contact.status)} rounded-full`}>
                            {contact.status?.charAt(0).toUpperCase() + contact.status?.slice(1)}
                        </Badge>
                    </div>
                </div>

                {/* Contact Information */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('Contact Information')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contact.subject && (
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground mb-0.5">{t('Subject')}</p>
                                    <p className="text-sm font-semibold break-words">{contact.subject}</p>
                                </div>
                            </div>
                        )}
                        {contact.created_at && (
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-muted-foreground mb-0.5">{t('Created At')}</p>
                                    <p className="text-sm">
                                        {window.superAdminSettings?.formatDateTime(contact.created_at, false) ||
                                            window.appSettings?.formatDateTime(contact.created_at, false) ||
                                            new Date(contact.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Message Section */}
                {contact.message && (
                    <>
                        <Separator />
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('Message')}</h4>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed break-words">{contact.message}</p>
                            </div>
                        </div>
                    </>
                )}

                {/* Notes Section */}
                {contact.notes && (
                    <>
                        <Separator />
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('Notes')}</h4>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed break-words">{contact.notes}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DialogContent>
    );
}