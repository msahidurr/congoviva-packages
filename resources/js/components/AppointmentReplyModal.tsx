import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { Calendar, Mail, Phone, MessageSquare, Clock } from 'lucide-react';

interface AppointmentReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { notes: string; status: string }) => void;
  appointment: any;
}

export function AppointmentReplyModal({ isOpen, onClose, onSubmit, appointment }: AppointmentReplyModalProps) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');

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

  useEffect(() => {
    if (appointment) {
      setNotes(appointment.notes || '');
      setStatus(appointment.status || 'scheduled');
    }
  }, [appointment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ notes, status });
  };

  // Format date and time for display
  const formatDateTime = (date: string, time: string) => {
    if (!date) return 'N/A';
    try {
      // Handle both date formats (appointment_date from API and date from calendar)
      const dateVal = new Date(date).toISOString().split('T')[0];
      const timeVal = time || '00:00';
      const dateTimeString = `${dateVal} ${timeVal}:00`;
      return window.appSettings?.formatDateTime(dateTimeString, true) || 
        `${new Date(date).toLocaleDateString()} ${time || '00:00'}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800',
      'no_show': 'bg-orange-100 text-orange-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={!isChatGptOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('Reply to Appointment')}</DialogTitle>
          <DialogDescription>
            {t('Update status and send a reply to this appointment')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
          <div className="flex items-center mb-2">
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10 ${getStatusColor(appointment?.status || 'scheduled')}`}>
              {appointment?.status?.charAt(0).toUpperCase() + appointment?.status?.slice(1).replace('_', ' ') || 'Scheduled'}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">{appointment?.name || appointment?.title || ''}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>{formatDateTime(appointment?.appointment_date || appointment?.date, appointment?.appointment_time || appointment?.time)}</span>
            </div>
            
            {appointment?.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span>{appointment?.email}</span>
              </div>
            )}
            
            {appointment?.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span>{appointment?.phone}</span>
              </div>
            )}
            
            {(appointment?.business?.name || appointment?.business) && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>{typeof appointment?.business === 'string' ? appointment?.business : appointment?.business?.name}</span>
              </div>
            )}
          </div>
          
          {appointment?.message && (
            <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
              <div className="flex items-start">
                <MessageSquare className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">{t('Client Message')}:</p>
                  <p className="text-sm">{appointment?.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">
                {t('Update Status')}
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder={t('Select status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">{t('Scheduled')}</SelectItem>
                  <SelectItem value="confirmed">{t('Confirmed')}</SelectItem>
                  <SelectItem value="completed">{t('Completed')}</SelectItem>
                  <SelectItem value="cancelled">{t('Cancelled')}</SelectItem>
                  <SelectItem value="no_show">{t('No Show')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">
                {t('Your Reply')}
              </Label>
              <Textarea
                id="notes"
                placeholder={t('Enter your reply here...')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                className="resize-none"
                required
              />
            </div>
          </div>
          
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('Cancel')}
            </Button>
            <Button type="submit">{t('Send Reply')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}