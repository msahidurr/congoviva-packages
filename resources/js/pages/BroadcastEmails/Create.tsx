import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { SimpleMultiSelect } from '@/components/simple-multi-select';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface Props {
    recipients: { value: string; label: string }[];
}

export default function Create({ recipients }: Props) {
    const { t } = useTranslation();
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        message: '',
        recipients: [] as { type: string; id: number }[],
    });

    const handleRecipientsChange = (keys: string[]) => {
        setSelectedKeys(keys);
        setData('recipients', keys.map(k => {
            const [type, id] = k.split(':');
            return { type, id: parseInt(id) };
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('broadcast-emails.store'), {
            onSuccess: () => router.visit(route('broadcast-emails.index')),
        });
    };
    const breadcrumbs = [
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Broadcast Emails'), href: route('broadcast-emails.index') },
        { title: t('Create Broadcast Email') },
    ];
    return (
        <PageTemplate
            breadcrumbs={breadcrumbs}
            title={t('Create Broadcast Email')}
            actions={[
                {
                    label: t('Back'),
                    icon: <ArrowLeft className="h-4 w-4 mr-2" />,
                    variant: 'outline',
                    onClick: () => router.get(route('broadcast-emails.index')),
                },
            ]}
        >
            <Head title={t('Create Broadcast Email')} />

            <div className="space-y-6">
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label required>{t('Recipients')} </Label>
                                    <Badge variant="secondary">
                                        {selectedKeys.length} / {recipients.length} {t('selected')}
                                    </Badge>
                                </div>
                                {recipients.length === 0 ? (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <p className="text-sm text-yellow-800">{t('No recipients found.')}</p>
                                    </div>
                                ) : (
                                    <SimpleMultiSelect
                                        options={recipients}
                                        selected={selectedKeys}
                                        onChange={handleRecipientsChange}
                                        placeholder={t('Search and select recipients...')}
                                        getOptionClassName={(value) => {
                                            const type = value.split(':')[0];
                                            if (type === 'companies' || type === 'users') return 'text-blue-600';
                                            if (type === 'contacts') return 'text-green-600';
                                            if (type === 'newsletter') return 'text-purple-600';
                                            return '';
                                        }}
                                    />
                                )}
                                {errors.recipients && <p className="text-sm text-red-500">{errors.recipients}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">{t('Subject')} </Label>
                                <Input
                                    id="subject"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    placeholder={t('Enter email subject')}
                                    className={errors.subject ? 'border-red-500' : ''} required
                                />
                                {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" required>{t('Message')} </Label>
                                <RichTextEditor
                                    value={data.message}
                                    onChange={(value) => setData('message', value)}
                                    placeholder={t('Enter your message')}
                                    className={`min-h-[350px] ${errors.message ? 'border-red-500' : ''}`}
                                />
                                {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => router.visit(route('broadcast-emails.index'))}>
                                    {t('Cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.subject || !data.message || selectedKeys.length === 0}
                                >
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t('Save')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </PageTemplate>
    );
}
