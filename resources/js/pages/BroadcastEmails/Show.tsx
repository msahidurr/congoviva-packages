import { Head } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { ArrowLeft, Mail, Send, XCircle, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Log {
    id: number;
    recipient_email: string;
    status: string;
    error_message?: string;
    sent_at?: string;
}

interface Props {
    broadcast: {
        id: number;
        subject: string;
        message: string;
        status: string;
        total_recipients: number;
        sent_count: number;
        failed_count: number;
        created_at: string;
    };
    logs: {
        data: Log[];
        current_page: number;
        last_page: number;
        total: number;
        from: number;
        to: number;
    };
    statistics: {
        total: number;
        sent: number;
        failed: number;
        pending: number;
    };
}

export default function Show({ broadcast, logs, statistics }: Props) {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            sent: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            processing: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            scheduled: 'bg-blue-100 text-blue-800',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const breadcrumbs = [
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Broadcast Emails'), href: route('broadcast-emails.index') },
        { title: t('View Broadcast Email') },
    ];

    const statCards = [
        { label: t('Total Recipients'), value: statistics.total, icon: <Users className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50' },
        { label: t('Sent'), value: statistics.sent, icon: <Send className="h-5 w-5 text-green-600" />, bg: 'bg-green-50' },
        { label: t('Failed'), value: statistics.failed, icon: <XCircle className="h-5 w-5 text-red-600" />, bg: 'bg-red-50' },
        { label: t('Pending'), value: statistics.pending, icon: <Clock className="h-5 w-5 text-orange-600" />, bg: 'bg-orange-50' },
    ];

    return (
        <PageTemplate
            title={broadcast.subject}
            breadcrumbs={breadcrumbs}
            actions={[
                {
                    label: t('Back'),
                    icon: <ArrowLeft className="h-4 w-4 mr-2" />,
                    variant: 'outline',
                    onClick: () => router.get(route('broadcast-emails.index')),
                },
            ]}
        >
            <Head title={broadcast.subject} />

            <div className="space-y-6">
                {/* Broadcast Details */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="shrink-0 p-2 bg-blue-50 rounded-lg">
                                    <Mail className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 mb-0.5">{t('Subject')}</p>
                                    <p className="text-sm font-semibold text-gray-900 truncate">{broadcast.subject}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                {getStatusBadge(broadcast.status)}
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                >
                                    {expanded ? <><ChevronUp className="h-3.5 w-3.5" />{t('Hide Message')}</> : <><ChevronDown className="h-3.5 w-3.5" />{t('View Message')}</>}
                                </button>
                            </div>
                        </div>
                        {expanded && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-1.5">{t('Message')}</p>
                                <div
                                    className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto leading-relaxed prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-blue-600 [&_a]:underline [&_p:empty]:h-4"
                                    dangerouslySetInnerHTML={{ __html: broadcast.message }}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 mb-2">{stat.label}</p>
                                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                    </div>
                                    <div className={`rounded-full ${stat.bg} p-3`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recipient Logs */}
                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Recipient Logs')} ({logs.total})</h2>
                        <div className="border rounded-lg overflow-hidden max-h-[600px] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-sm font-semibold text-gray-600">{t('Email')}</TableHead>
                                        <TableHead className="text-sm font-semibold text-gray-600">{t('Status')}</TableHead>
                                        <TableHead className="text-sm font-semibold text-gray-600">{t('Sent At')}</TableHead>
                                        <TableHead className="text-sm font-semibold text-gray-600">{t('Error')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-base text-gray-500">
                                                {t('No logs found')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        logs.data.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell className="text-sm font-medium text-gray-900">{log.recipient_email}</TableCell>
                                                <TableCell>{getStatusBadge(log.status)}</TableCell>
                                                <TableCell className="text-sm font-medium text-gray-900">
                                                    {log.sent_at
                                                        ? (window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(log.sent_at, true) : new Date(log.sent_at).toLocaleString())
                                                        : '—'}
                                                </TableCell>
                                                <TableCell className="text-sm text-red-600 max-w-[500px] truncate">{log.error_message || '—'}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {logs.last_page > 1 && (
                            <div className="mt-4">
                                <Pagination
                                    from={logs.from || 0}
                                    to={logs.to || 0}
                                    total={logs.total || 0}
                                    currentPage={logs.current_page}
                                    lastPage={logs.last_page}
                                    entityName={t('logs')}
                                    onPageChange={(url) => {
                                        const urlObj = new URL(url, window.location.origin);
                                        const page = urlObj.searchParams.get('page');
                                        router.get(route('broadcast-emails.show', { broadcast: broadcast.id, page }));
                                    }}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageTemplate>
    );
}
