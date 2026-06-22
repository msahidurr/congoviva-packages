import { useForm } from '@inertiajs/react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/layouts/auth-layout';
import AuthButton from '@/components/auth/auth-button';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';

export default function ConfirmPassword() {
    const { t } = useTranslation();
    const { themeColor, customColor } = useBrand();
    const primaryColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<Required<{ password: string }>>({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout
            title={t("Confirm your password")}
            description={t("This is a secure area of the application. Please confirm your password before continuing.")}
            icon={<Lock className="h-7 w-7" style={{ color: primaryColor }} />}
        >
            <form onSubmit={submit} className="space-y-5">
                <div className="space-y-4">
                    <div className="relative">
                        <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">{t("Password")}</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="current-password"
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
                </div>

                <AuthButton 
                    tabIndex={2} 
                    processing={processing}
                >
                    {t("Confirm password")}
                </AuthButton>
            </form>
        </AuthLayout>
    );
}