import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

interface ContactReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  contact: any;
}

export function ContactReplyModal({ isOpen, onClose, onSubmit, contact }: ContactReplyModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    status: 'contacted'
  });

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

  // Update form data when contact changes or modal opens
  useEffect(() => {
    if (isOpen && contact) {
      setFormData({
        subject: '',
        message: '',
        status: contact.status || 'contacted'
      });
    }
  }, [isOpen, contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({ subject: '', message: '', status: 'contacted' });
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={!isChatGptOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("Reply to")} {contact?.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("To")}</Label>
              <Input value={contact?.email || ''} disabled />
            </div>
            <div>
              <Label>{t("Status")}</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">{t("New")}</SelectItem>
                  <SelectItem value="contacted">{t("Contacted")}</SelectItem>
                  <SelectItem value="qualified">{t("Qualified")}</SelectItem>
                  <SelectItem value="converted">{t("Converted")}</SelectItem>
                  <SelectItem value="closed">{t("Closed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>{t("Subject")}</Label>
            <Input
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder={t("Enter email subject")}
              required
            />
          </div>
          
          <div>
            <Label>{t("Message")}</Label>
            <Textarea
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder={t("Enter your reply message")}
              rows={6}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("Cancel")}
            </Button>
            <Button type="submit">
              {t("Send Reply")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}