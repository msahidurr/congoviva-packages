import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from 'react-i18next';
import { Calendar, User, Mail, Phone, Building2, Clock, MessageSquare, FileText, Tag } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Appointment {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    appointment_date?: string;
    appointment_time?: string;
    message?: string;
    status: string;
    notes?: string;
    business?: {
        name: string;
    };
    created_at?: string;
}

interface ViewProps {
    appointment: Appointment;
}

export default function View({ appointment }: ViewProps) {
    const { t } = useTranslation();

    const formatDateTime = (date?: string, time?: string) => {
        if (!date) return '-';
        try {
            const dateObj = new Date(date);
            const dateStr = window.appSettings?.formatDateTime 
                ? window.appSettings.formatDateTime(date, false) 
                : dateObj.toLocaleDateString();
            return time ? `${dateStr} ${time}` : dateStr;
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'scheduled': 'bg-blue-100 text-blue-700',
            'confirmed': 'bg-green-100 text-green-700',
            'completed': 'bg-gray-100 text-gray-700',
            'cancelled': 'bg-red-100 text-red-700',
            'no_show': 'bg-orange-100 text-orange-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
                <DialogTitle>{t('Appointment Details')}</DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto flex-1 space-y-5 pr-2">
                {/* Appointment Date & Time */}
                <div className="bg-primary/5 rounded-lg p-4 border">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground mb-0.5">{t('Appointment Date & Time')}</p>
                                <p className="text-base font-semibold break-words">
                                    {formatDateTime(appointment.appointment_date, appointment.appointment_time)}
                                </p>
                            </div>
                        </div>
                        <Badge className={`${getStatusColor(appointment.status)} rounded-full flex-shrink-0`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('_', ' ')}
                        </Badge>
                    </div>
                </div>

                {/* Contact Information */}
                <div>
                    <h4 className="text-sm font-semibold mb-3">{t('Contact Information')}</h4>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">{t('Name')}</p>
                                <p className="text-sm font-medium break-words">{appointment.name}</p>
                            </div>
                        </div>
                        
                        {appointment.email && (
                            <div className="flex items-start gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">{t('Email')}</p>
                                    <p className="text-sm break-all">{appointment.email}</p>
                                </div>
                            </div>
                        )}
                        
                        {appointment.phone && (
                            <div className="flex items-start gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">{t('Phone')}</p>
                                    <p className="text-sm">{appointment.phone}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Additional Information */}
                <div>
                    <h4 className="text-sm font-semibold mb-3">{t('Additional Information')}</h4>
                    <div className="space-y-3">
                        {appointment.business && (
                            <div className="flex items-start gap-3">
                                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">{t('Business')}</p>
                                    <p className="text-sm font-medium break-words">{appointment.business.name}</p>
                                </div>
                            </div>
                        )}
                        
                        {appointment.created_at && (
                            <div className="flex items-start gap-3">
                                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">{t('Created At')}</p>
                                    <p className="text-sm">
                                        {window.appSettings?.formatDateTime 
                                            ? window.appSettings.formatDateTime(appointment.created_at, false)
                                            : new Date(appointment.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Message */}
                {appointment.message && (
                    <>
                        <Separator />
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <h4 className="text-sm font-semibold">{t('Message')}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed break-words pl-6">{appointment.message}</p>
                        </div>
                    </>
                )}

                {/* Notes */}
                {appointment.notes && (
                    <>
                        <Separator />
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <h4 className="text-sm font-semibold">{t('Notes')}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed break-words pl-6">{appointment.notes}</p>
                        </div>
                    </>
                )}
            </div>
        </DialogContent>
    );
}