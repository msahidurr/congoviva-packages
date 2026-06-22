import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';

interface BioLinkPasswordPromptProps {
  bioLink: {
    id: number;
    name: string;
  };
  error?: string;
}

export default function BioLinkPasswordPrompt({ bioLink, error }: BioLinkPasswordPromptProps) {
  const { t } = useTranslation();
  const { themeColor, customColor } = useBrand();
  const primaryColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];
  const { data, setData, post, processing } = useForm({
    password: '',
    biolink_id: bioLink.id,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(window.location.href, {
      preserveScroll: true,
    });
  };

  return (
    <>
      <Head title={`Protected - ${bioLink.name}`} />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div 
              className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Lock className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
            <CardTitle className="text-xl font-semibold">
              {t('Protected Content')}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {t('This bio link is password protected. Please enter the password to continue.')}
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-sm font-medium">
                  {t('Password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder={t('Enter password')}
                  className="mt-1"
                  required
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {error}
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={processing || !data.password}
              >
                {processing ? t('Verifying...') : t('Access Bio Link')}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('Don\'t have the password? Contact the owner of this bio link.')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}