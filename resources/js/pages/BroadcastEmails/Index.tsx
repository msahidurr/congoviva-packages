import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Eye, Trash2, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { toast } from '@/components/custom-toast';
import { hasPermission } from '@/utils/authorization';

export default function Index() {
    const { t } = useTranslation();
    const { broadcasts, filters: pageFilters = {}, auth } = usePage().props as any;
    const flash = (usePage().props as any)?.flash;
    const permissions = auth?.permissions || [];
    const canCreate = hasPermission(permissions, 'create-broadcast-emails');
    const canView = hasPermission(permissions, 'view-broadcast-emails');
    const canDelete = hasPermission(permissions, 'delete-broadcast-emails');
    const hasAnyAction = canView || canDelete;
    const isSuperAdmin = auth?.user?.type === 'superadmin';
    const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash?.success]);

    const applyFilters = () => {
        const params: any = { page: 1 };
        if (searchTerm) params.search = searchTerm;
        if (pageFilters.per_page) params.per_page = pageFilters.per_page;
        router.get(route('broadcast-emails.index'), params, { preserveState: true, preserveScroll: true });
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentBroadcast, setCurrentBroadcast] = useState<any>(null);

    const handleDeleteConfirm = () => {
        toast.loading(t('Deleting broadcast...'));
        router.delete(route('broadcast-emails.destroy', currentBroadcast.id), {
            onSuccess: (page) => {
                setIsDeleteModalOpen(false);
                toast.dismiss();
                if ((page.props as any)?.flash?.success) toast.success((page.props as any).flash.success);
            },
            onError: () => {
                toast.dismiss();
                toast.error(t('Failed to delete broadcast'));
            },
        });
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            scheduled: 'bg-blue-100 text-blue-800',
            processing: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const breadcrumbs = [
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Broadcast Emails') },
    ];

    const pageActions = [
        ...(canCreate ? [{
            label: t('Create Broadcast'),
            icon: <Plus className="h-4 w-4 mr-2" />,
            variant: 'default',
            onClick: () => router.visit(route('broadcast-emails.create')),
        }] : []),
    ];

    const [copied, setCopied] = useState(false);
    const cronCommand = `0 * * * * cd your-domain && php artisan schedule:run >> /dev/null 2>&1`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cronCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <PageTemplate title={t('Broadcast Emails')} url="/broadcast-emails" actions={pageActions} breadcrumbs={breadcrumbs} noPadding>
            {isSuperAdmin && (
            <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                    {t('Add this cron job to your server so broadcast emails are processed automatically every hour.')}
                </p>
                <div className="flex items-center gap-0 rounded-lg border border-blue-300 dark:border-blue-700 overflow-hidden">
                    <span className="shrink-0 px-3 py-2.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-semibold border-r border-blue-300 dark:border-blue-700 whitespace-nowrap">
                        {t('Cron Job')}
                    </span>
                    <code className="flex-1 px-4 py-2.5 bg-blue-50 dark:bg-blue-950/30 text-sm font-mono text-blue-900 dark:text-blue-200 truncate">
                        {cronCommand}
                    </code>
                    <button
                        onClick={handleCopy}
                        className="shrink-0 flex cursor-pointer items-center gap-1.5 px-3 py-2.5 bg-blue-100 dark:bg-blue-900/50 border-l border-blue-300 dark:border-blue-700 text-xs font-medium text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                    >
                        {copied
                            ? <><Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" /><span className="text-green-600 dark:text-green-400">{t('Copied!')}</span></>
                            : <><Copy className="h-3.5 w-3.5" /><span>{t('Copy')}</span></>}
                    </button>
                </div>
            </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-4 p-4">
                <SearchAndFilterBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onSearch={(e) => { e.preventDefault(); applyFilters(); }}
                    filters={[]}
                    showFilters={false}
                    setShowFilters={() => {}}
                    hasActiveFilters={() => !!searchTerm}
                    activeFilterCount={() => (searchTerm ? 1 : 0)}
                    onResetFilters={() => { setSearchTerm(''); router.get(route('broadcast-emails.index'), { page: 1 }, { preserveState: true, preserveScroll: true }); }}
                    onApplyFilters={applyFilters}
                    currentPerPage={pageFilters.per_page?.toString() || '10'}
                    onPerPageChange={(value) => {
                        const params: any = { page: 1, per_page: parseInt(value) };
                        if (searchTerm) params.search = searchTerm;
                        router.get(route('broadcast-emails.index'), params, { preserveState: true, preserveScroll: true });
                    }}
                />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Subject')}</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Status')}</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Recipients')}</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Sent')}</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Failed')}</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Created At')}</th>
                                {hasAnyAction && <th className="px-4 py-3 text-right font-medium text-gray-500">{t('Actions')}</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {broadcasts?.data?.map((broadcast: any) => (
                                <tr key={broadcast.id} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                                    <td className="px-4 py-3 font-medium">{broadcast.subject}</td>
                                    <td className="px-4 py-3">{getStatusBadge(broadcast.status)}</td>
                                    <td className="px-4 py-3">{broadcast.total_recipients}</td>
                                    <td className="px-4 py-3">{broadcast.sent_count}</td>
                                    <td className="px-4 py-3">{broadcast.failed_count}</td>
                                    <td className="px-4 py-3">{window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(broadcast.created_at, false) : new Date(broadcast.created_at).toLocaleDateString()}</td>
                                    {hasAnyAction && (
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                {canView && (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => router.visit(route('broadcast-emails.show', broadcast.id))}
                                                                className="text-green-500 hover:text-green-700"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{t('View')}</TooltipContent>
                                                    </Tooltip>
                                                )}

                                                {canDelete && (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-red-500 hover:text-red-700"
                                                                onClick={() => { setCurrentBroadcast(broadcast); setIsDeleteModalOpen(true); }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>{t('Delete')}</TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}

                            {(!broadcasts?.data || broadcasts.data.length === 0) && (
                                <tr>
                                    <td colSpan={hasAnyAction ? 7 : 6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        {t('No broadcast emails found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {broadcasts?.links && (
                    <Pagination
                        from={broadcasts?.from || 0}
                        to={broadcasts?.to || 0}
                        total={broadcasts?.total || 0}
                        links={broadcasts?.links}
                        entityName={t('broadcasts')}
                        onPageChange={(url) => router.get(url)}
                    />
                )}
            </div>

            <CrudDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemName={currentBroadcast?.subject || ''}
                entityName="broadcast"
            />
        </PageTemplate>
    );
}
