import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MessageSquare, Building, FileText, Calendar, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';

interface ContactViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: any;
  isLandingPageContact?: boolean;
}

export function ContactViewModal({ isOpen, onClose, contact, isLandingPageContact = false }: ContactViewModalProps) {
  const { t } = useTranslation();
  const { auth } = usePage().props as any;
  const isSuperAdmin = auth?.user?.role === 'super_admin';

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

  if (!contact) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'qualified': 'bg-purple-100 text-purple-800',
      'converted': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={!isChatGptOpen}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="px-4 py-3 border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <User className="h-4 w-4 text-green-600" />
            </div>
            {t('Contact Details')}
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 py-4">
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <Badge className={`${getStatusColor(contact.status)} px-2 py-1 text-xs font-medium`}>
                {contact.status?.charAt(0).toUpperCase() + contact.status?.slice(1)}
              </Badge>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded">
                <Calendar className="h-3 w-3 text-green-500" />
                {contact.created_at ? (
                  isSuperAdmin ? 
                    (window.superAdminSettings?.formatDateTime(contact.created_at, true) || window.appSettings?.formatDateTime(contact.created_at, true) || new Date(contact.created_at).toLocaleDateString()) :
                    (window.appSettings?.formatDateTime(contact.created_at, true) || new Date(contact.created_at).toLocaleDateString())
                ) : 'N/A'}
              </div>
            </div>

            {/* Business Information - Only show for company contacts */}
            {!isLandingPageContact && !isSuperAdmin && contact.business && (
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-gray-900 text-sm">{t('Business')}</span>
                </div>
                <p className="text-gray-800 text-sm ml-6">{contact.business.name}</p>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <User className="h-4 w-4 text-blue-600" />
                <div>
                  <span className="text-xs text-gray-600">{t('Name')}</span>
                  <p className="text-sm font-medium">{contact.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <Mail className="h-4 w-4 text-green-600" />
                <div>
                  <span className="text-xs text-gray-600">{t('Email')}</span>
                  <p className="text-sm font-medium break-all">{contact.email || 'N/A'}</p>
                </div>
              </div>
              {/* Phone - Only show for company contacts */}
              {!isLandingPageContact && !isSuperAdmin && contact.phone && (
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <Phone className="h-4 w-4 text-orange-600" />
                  <div>
                    <span className="text-xs text-gray-600">{t('Phone')}</span>
                    <p className="text-sm font-medium">{contact.phone}</p>
                  </div>
                </div>
              )}
              {/* Subject for landing page contacts */}
              {contact.subject && (
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <div>
                    <span className="text-xs text-gray-600">{t('Subject')}</span>
                    <p className="text-sm font-medium">{contact.subject}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message */}
            {contact.message && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-900 text-sm">{t('Message')}</span>
                </div>
                <p className="text-gray-800 text-sm whitespace-pre-wrap">{contact.message}</p>
              </div>
            )}

            {/* Notes - Only show for company contacts */}
            {!isLandingPageContact && !isSuperAdmin && contact.notes && (
              <div className="bg-amber-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-amber-600" />
                  <span className="font-medium text-gray-900 text-sm">{t('Notes')}</span>
                </div>
                <p className="text-gray-800 text-sm whitespace-pre-wrap">{contact.notes}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}