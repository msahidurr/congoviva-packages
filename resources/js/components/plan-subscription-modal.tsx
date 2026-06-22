import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { PaymentProcessor } from '@/components/payment/payment-processor';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface PlanSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: number;
    name: string;
    price: string | number;
    yearly_price?: string | number;
    duration: string;
    paymentMethods?: any;
    isSubscribed?: boolean;
    isExpired?: boolean;
  };
  billingCycle: 'monthly' | 'yearly';
  paymentMethods: PaymentMethod[];
}

export function PlanSubscriptionModal({ 
  isOpen, 
  onClose, 
  plan, 
  billingCycle, 
  paymentMethods 
}: PlanSubscriptionModalProps) {
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

  const handlePaymentSuccess = () => {
    onClose();
    // Refresh the page to show updated plan status
    window.location.reload();
  };

  const enabledPaymentMethods = paymentMethods.filter(method => method.enabled);

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={!isChatGptOpen}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t('Subscribe to {{planName}}', { planName: plan.name })}</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1 pr-2">
          <PaymentProcessor
            plan={plan}
            billingCycle={billingCycle}
            paymentMethods={enabledPaymentMethods}
            onSuccess={handlePaymentSuccess}
            onCancel={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}