import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface PaginationDataProps {
  data: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  routeName: string;
  filters?: Record<string, any>;
}

interface PaginationIndividualProps {
  from?: number;
  to?: number;
  total?: number;
  links?: any[];
  currentPage?: number;
  lastPage?: number;
  entityName?: string;
  onPageChange?: (url: string) => void;
  className?: string;
}

type PaginationProps = PaginationDataProps | PaginationIndividualProps;

function isDataProps(props: PaginationProps): props is PaginationDataProps {
  return 'data' in props && 'routeName' in props;
}

export function Pagination(props: PaginationProps) {
  const { t } = useTranslation();
  
  if (isDataProps(props)) {
    // Handle data prop interface
    const { data, routeName, filters = {} } = props;
    if (!data) return null;
    const { current_page, last_page, per_page, total, from, to } = data;

    const goToPage = (page: number) => {
      router.get(route(routeName), { ...filters, page, per_page }, {
        preserveState: true,
        replace: true
      });
    };

    const renderPageNumbers = () => {
      const pages = [];
      const showPages = 5;
      let startPage = Math.max(1, current_page - Math.floor(showPages / 2));
      let endPage = Math.min(last_page, startPage + showPages - 1);

      if (endPage - startPage + 1 < showPages) {
        startPage = Math.max(1, endPage - showPages + 1);
      }

      if (startPage > 1) {
        pages.push(
          <Button key={1} variant="outline" size="sm" onClick={() => goToPage(1)}>
            1
          </Button>
        );
        if (startPage > 2) {
          pages.push(<MoreHorizontal key="start-ellipsis" className="h-4 w-4" />);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <Button
            key={i}
            variant={i === current_page ? "default" : "outline"}
            size="sm"
            onClick={() => goToPage(i)}
          >
            {i}
          </Button>
        );
      }

      if (endPage < last_page) {
        if (endPage < last_page - 1) {
          pages.push(<MoreHorizontal key="end-ellipsis" className="h-4 w-4" />);
        }
        pages.push(
          <Button key={last_page} variant="outline" size="sm" onClick={() => goToPage(last_page)}>
            {last_page}
          </Button>
        );
      }

      return pages;
    };

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          {t('Showing')} {from} {t('to')} {to} {t('of')} {total} {t('results')}
        </div>
        {last_page > 1 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(current_page - 1)}
              disabled={current_page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              {t('Previous')}
            </Button>
            {renderPageNumbers()}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(current_page + 1)}
              disabled={current_page === last_page}
            >
              {t('Next')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }
  
  // Handle individual props interface
  const {
    from = 0,
    to = 0,
    total = 0,
    links = [],
    currentPage,
    lastPage,
    entityName = 'items',
    onPageChange,
    className = '',
  } = props;

  const handlePageChange = (url: string) => {
    if (onPageChange) {
      const urlObj = new URL(url, window.location.origin);
      const pageParam = urlObj.searchParams.get('page');
      
      if (pageParam) {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set('page', pageParam);
        const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
        onPageChange(newUrl);
      } else {
        onPageChange(url);
      }
    } else if (url) {
      window.location.href = url;
    }
  };

  return (
    <div className={cn(
      "p-4 border-t dark:border-gray-700 flex items-center justify-between dark:bg-gray-900",
      className
    )}>
      <div className="text-sm text-muted-foreground dark:text-gray-300">
        {t("Showing")} <span className="font-medium dark:text-white">{from}</span> {t("to")}{" "}
        <span className="font-medium dark:text-white">{to}</span> {t("of")}{" "}
        <span className="font-medium dark:text-white">{total}</span> {entityName}
      </div>

      <div className="flex gap-1">
        {links && links.length > 0 ? (
          links.map((link: any, i: number) => {
            const isTextLink = link.label === "&laquo; Previous" || link.label === "Next &raquo;";
            const label = link.label.replace("&laquo; ", "").replace(" &raquo;", "");

            return (
              <Button
                key={`pagination-${i}-${link.label}`}
                variant={link.active ? 'default' : 'outline'}
                size={isTextLink ? "sm" : "icon"}
                className={isTextLink ? "px-3" : "h-8 w-8"}
                disabled={!link.url}
                onClick={() => link.url && handlePageChange(link.url)}
              >
                {isTextLink ? label : <span dangerouslySetInnerHTML={{ __html: link.label }} />}
              </Button>
            );
          })
        ) : (
          currentPage && lastPage && lastPage > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => {
                  const currentParams = new URLSearchParams(window.location.search);
                  currentParams.set('page', (currentPage - 1).toString());
                  const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
                  handlePageChange(newUrl);
                }}
              >
                {t("Previous")}
              </Button>
              <span className="px-3 py-1 dark:text-white">
                {currentPage} of {lastPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= lastPage}
                onClick={() => {
                  const currentParams = new URLSearchParams(window.location.search);
                  currentParams.set('page', (currentPage + 1).toString());
                  const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
                  handlePageChange(newUrl);
                }}
              >
                {t("Next")}
              </Button>
            </>
          )
        )}
      </div>
    </div>
  );
}