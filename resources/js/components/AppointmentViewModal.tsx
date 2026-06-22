import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Building, FileText, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AppointmentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
}

export function AppointmentViewModal({ isOpen, onClose, appointment }: AppointmentViewModalProps) {
  const { t } = useTranslation();

  // Check if ChatGPT modal is open
  const [isChatGptOpen, setIsChatGptOpen] = useState(false);
  
  useEffect(() => {
    const checkChatGpt = () => {
      const chatGptModal = document.querySelector('[data-chatgpt-modal]') || 
                          document.querySelector('.chatgpt-modal') ||
                          document.querySelector('[class*="chatgpt"]') ||
                          document.querySelector('[id*="chatgpt"]');
      setIsChatGptOpen(!!chatGptModal);
    };
    
    const observer = new MutationObserver(checkChatGpt);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

  if (!appointment) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800',
      'no_show': 'bg-orange-100 text-orange-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={!isChatGptOpen}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            {t('Appointment Details')}
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 py-4">
          <div className="space-y-4">
            {/* Status and Date */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <Badge className={`${getStatusColor(appointment.status)} px-2 py-1 text-xs font-medium`}>
                {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1).replace('_', ' ')}
              </Badge>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded">
                <Clock className="h-3 w-3 text-blue-500" />
                {(() => {
                  if (!appointment.appointment_date) return 'N/A';
                  try {
                    const date = new Date(appointment.appointment_date).toISOString().split('T')[0];
                    const time = appointment.appointment_time || '00:00';
                    const dateTimeString = `${date} ${time}:00`;
                    return window.appSettings?.formatDateTime(dateTimeString, true) || `${new Date(appointment.appointment_date).toLocaleDateString()} ${time}`;
                  } catch (error) {
                    return 'Invalid Date';
                  }
                })()}
              </div>
            </div>

            {/* Business Information */}
            {appointment.business && (
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-gray-900 text-sm">{t('Business')}</span>
                </div>
                <p className="text-gray-800 text-sm ml-6">{appointment.business.name}</p>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <User className="h-4 w-4 text-blue-600" />
                <div>
                  <span className="text-xs text-gray-600">{t('Name')}</span>
                  <p className="text-sm font-medium">{appointment.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <Mail className="h-4 w-4 text-green-600" />
                <div>
                  <span className="text-xs text-gray-600">{t('Email')}</span>
                  <p className="text-sm font-medium break-all">{appointment.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <Phone className="h-4 w-4 text-orange-600" />
                <div>
                  <span className="text-xs text-gray-600">{t('Phone')}</span>
                  <p className="text-sm font-medium">{appointment.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Message */}
            {appointment.message && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-900 text-sm">{t('Message')}</span>
                </div>
                <p className="text-gray-800 text-sm whitespace-pre-wrap">{appointment.message}</p>
              </div>
            )}

            {/* Notes */}
            {appointment.notes && (
              <div className="bg-amber-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-gray-900 text-sm">{t('Notes')}</span>
                </div>
                <p className="text-gray-800 text-sm whitespace-pre-wrap">{appointment.notes}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}