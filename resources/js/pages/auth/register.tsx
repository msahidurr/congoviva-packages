import { useForm, usePage } from '@inertiajs/react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/layouts/auth-layout';
import AuthButton from '@/components/auth/auth-button';
import Recaptcha, { executeRecaptcha } from '@/components/recaptcha';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
    recaptcha_token?: string;
    plan_id?: string;
    referral_code?: string;
};

export default function Register({ referralCode, planId }: { referralCode?: string; planId?: string }) {
    const { t } = useTranslation();
    const [recaptchaToken, setRecaptchaToken] = useState<string>('');
    const [showTermsError, setShowTermsError] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState<boolean>(false);
    const { themeColor, customColor } = useBrand();
    const { settings = {} } = usePage().props as any;
    const recaptchaEnabled = settings.recaptchaEnabled === 'true' || settings.recaptchaEnabled === true || settings.recaptchaEnabled === 1 || settings.recaptchaEnabled === '1';
    const primaryColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
        plan_id: planId,
        referral_code: referralCode,
    });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        
        if (!data.terms) {
            setShowTermsError(true);
            return;
        }
        
        setShowTermsError(false);
        
        if (recaptchaEnabled) {
            try {
                const token = await executeRecaptcha();
                if (!token) {
                    alert(t('Please complete the reCAPTCHA verification'));
                    return;
                }
                post(route('register'), {
                    data: { ...data, recaptcha_token: token },
                    onFinish: () => reset('password', 'password_confirmation'),
                });
                return;
            } catch {
                alert(t('reCAPTCHA verification failed. Please try again.'));
                return;
            }
        }
        
        post(route('register'), {
            data: { ...data, recaptcha_token: recaptchaToken },
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout
            title={t("Create your account")}
            description={t("Enter your details below to get started")}
        >
            <form className="space-y-5" onSubmit={submit}>
                <div className="space-y-4">
                    <div className="relative">
                        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">{t("Full name")}</Label>
                        <div className="relative">
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = primaryColor}
                                onBlur={(e) => e.target.style.borderColor = 'rgb(209 213 219)'}
                                placeholder={t("John Doe")}
                                className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md transition-all duration-200"
                                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                            />
                        </div>
                        <InputError message={errors.name} />
                    </div>

                    <div className="relative">
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">{t("Email address")}</Label>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = primaryColor}
                                onBlur={(e) => e.target.style.borderColor = 'rgb(209 213 219)'}
                                placeholder="email@example.com"
                                className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md transition-all duration-200"
                                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div>
                        <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">{t("Password")}</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = primaryColor}
                                onBlur={(e) => e.target.style.borderColor = 'rgb(209 213 219)'}
                                placeholder="••••••••"
                                className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md transition-all duration-200 pr-10"
                                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none flex items-center justify-center p-1 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div>
                        <Label htmlFor="password_confirmation" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">{t("Confirm password")}</Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={showPasswordConfirmation ? 'text' : 'password'}
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = primaryColor}
                                onBlur={(e) => e.target.style.borderColor = 'rgb(209 213 219)'}
                                placeholder="••••••••"
                                className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md transition-all duration-200 pr-10"
                                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none flex items-center justify-center p-1 cursor-pointer"
                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                tabIndex={-1}
                            >
                                {showPasswordConfirmation ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="flex items-start">
                        <Checkbox
                            id="terms"
                            name="terms"
                            checked={data.terms}
                            onClick={() => {
                                setData('terms', !data.terms);
                                if (!data.terms) setShowTermsError(false);
                            }}
                            tabIndex={5}
                            className={`mt-1 rounded ${!data.terms && (errors.terms || showTermsError) ? 'border-red-500' : 'border-gray-300'}`}
                            style={{ '--tw-ring-color': primaryColor, color: primaryColor } as React.CSSProperties}
                        />
                        <Label htmlFor="terms" className="ml-2 text-gray-600 dark:text-gray-400 text-sm">
                            {t("I agree to the")}{' '}
                            <a href={settings.termsConditionsUrl || "#"} target="_blank" rel="noopener noreferrer" style={{ color: primaryColor }}>
                                {t("Terms and Conditions")}
                            </a>
                        </Label>
                    </div>
                    <InputError message={errors.terms || (showTermsError ? t('You must agree to the Terms and Conditions to continue') : '')} />
                </div>

                {recaptchaEnabled && (
                    <Recaptcha 
                        onVerify={setRecaptchaToken}
                        onExpired={() => setRecaptchaToken('')}
                        onError={() => setRecaptchaToken('')}
                    />
                )}

                <AuthButton 
                    tabIndex={6} 
                    processing={processing}
                    disabled={processing}
                >
                    {t("Create account")}
                </AuthButton>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    {t("Already have an account?")}{' '}
                    <TextLink 
                        href={route('login')} 
                        className="font-medium transition-colors duration-200" 
                        style={{ color: primaryColor }}
                        tabIndex={7}
                    >
                        {t("Log in")}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}