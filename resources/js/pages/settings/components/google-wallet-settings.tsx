import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Wallet, Upload, ExternalLink } from 'lucide-react';
import { SettingsSection } from '@/components/settings-section';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';

interface GoogleWalletSettingsProps {
  settings?: Record<string, string>;
}

export default function GoogleWalletSettings({ settings = {} }: GoogleWalletSettingsProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    googleWalletIssuerId: settings.googleWalletIssuerId || '',
  });
  const [jsonFile, setJsonFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append('googleWalletIssuerId', formData.googleWalletIssuerId);
    if (jsonFile) {
      data.append('googleWalletJson', jsonFile);
    }

   router.post(route('settings.google-wallet.update'), data, {
      preserveScroll: true,
      onSuccess: (page) => {
        setIsLoading(false);
        const successMessage = page.props.flash?.success;
        const errorMessage = page.props.flash?.error;
        
        if (successMessage) {
          toast.success(successMessage);
        } else if (errorMessage) {
          toast.error(errorMessage);
        }
      },
      onError: (errors) => {
        setIsLoading(false);
        const errorMessage = errors.error || Object.values(errors).join(', ') || t('Failed to update Google Wallet settings');
        toast.error(errorMessage);
      }
    });
  };

  return (
    <SettingsSection
      title={t("Google Wallet Settings")}
      description={t("Configure Google Wallet integration for digital passes")}
      action={
        <Button type="submit" form="google-wallet-form" disabled={isLoading} size="sm">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? t('Saving...') : t('Save Changes')}
        </Button>
      }
    >
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <ExternalLink className="h-4 w-4" />
          <span className="text-sm font-medium">{t("How to Get Google Wallet Credentials")}</span>
        </div>
        <a 
          href="https://developers.google.com/wallet/generic/web/prerequisites" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline mt-1 inline-block"
        >
          {t("View Documentation")}
        </a>
      </div>
      <form id="google-wallet-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="googleWalletIssuerId">{t("Google Wallet Issuer ID")}</Label>
            <Input
              id="googleWalletIssuerId"
              type="text"
              value={(window as any).isDemo ? '************' : formData.googleWalletIssuerId}
              onChange={(e) => setFormData(prev => ({ ...prev, googleWalletIssuerId: e.target.value }))}
              placeholder={t("Enter your Google Wallet Issuer ID")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleWalletJson">{t("Google Wallet JSON File")}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="googleWalletJson"
                type="file"
                accept=".json"
                onChange={(e) => setJsonFile(e.target.files?.[0] || null)}
                className="flex-1"
              />
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              {t("JSON files only, max 2MB")}
            </p>
          </div>
        </div>
      </form>
    </SettingsSection>
  );
}