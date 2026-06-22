import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { Copy, CheckCircle } from 'lucide-react';

interface CampaignBankFormProps {
  campaignData: any;
  bankDetails: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CampaignBankForm({ 
  campaignData,
  bankDetails,
  onSuccess, 
  onCancel 
}: CampaignBankFormProps) {
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(false);

  const handleCopyLink = (text: string) => {
    // Fallback clipboard function for HTTP environments
    const copyToClipboard = (text: string) => {
      if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API for HTTPS
        return navigator.clipboard.writeText(text);
      } else {
        // Fallback for HTTP environments
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise<void>((resolve, reject) => {
          if (document.execCommand('copy')) {
            textArea.remove();
            resolve();
          } else {
            textArea.remove();
            reject(new Error('Copy failed'));
          }
        });
      }
    };
    copyToClipboard(text)
      .then(() => {
        toast.success(t('Amount copied to clipboard'));
      })
      .catch(() => {
        toast.error(t('Failed to copy amount'));
      });
  };

  const handleConfirmPayment = () => {
    setProcessing(true);
    
    router.post(route('campaigns.bank.payment'), {
      campaign_data: campaignData,
      coupon_code: campaignData.coupon_code || '',
      amount: campaignData.final_amount || campaignData.total_amount,
    }, {
      onSuccess: () => {
        toast.success(t('Campaign created. Payment verification pending.'));
        onSuccess();
      },
      onError: () => {
        toast.error(t('Failed to submit payment request'));
      },
      onFinish: () => {
        setProcessing(false);
      }
    });
  };

  const finalAmount = campaignData.final_amount || campaignData.total_amount || 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">{t('Bank Transfer Details')}</h3>
          <div className="space-y-3 text-sm">
            <div className="whitespace-pre-line">{bankDetails}</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">{t('Campaign')}: {campaignData.name}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-medium">{t('Amount')}: {window.appSettings.formatCurrency(finalAmount)}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyLink(window.appSettings.formatCurrency(finalAmount))}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  {t('Copy')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="text-sm text-orange-800">
              <p className="font-medium mb-1">{t('Important Instructions')}</p>
              <ul className="space-y-1 text-xs">
                <li>• {t('Transfer the exact amount shown above')}</li>
                <li>• {t('Include the campaign name in the transfer description')}</li>
                <li>• {t('Your campaign will be activated after payment verification')}</li>
                <li>• {t('Verification may take 1-3 business days')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          {t('Cancel')}
        </Button>
        <Button 
          onClick={handleConfirmPayment} 
          disabled={processing}
          className="flex-1"
        >
          {processing ? t('Processing...') : t('I have made the payment')}
        </Button>
      </div>
    </div>
  );
}