import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Store expanded menu state in localStorage
const STORAGE_KEY = 'nav_expanded_items';

export function NavMain({ items = [], position }: { items: NavItem[]; position: 'left' | 'right' }) {
    const page = usePage();
    const { state, isMobile } = useSidebar();
    
    // On mobile, always show text regardless of collapsed state
    const shouldShowText = isMobile || state !== "collapsed";
    // Check if the document is in RTL mode
    const isRtl = document.documentElement.dir === 'rtl';
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const effectivePosition = isRtl ? (position === 'left' ? 'right' : 'left') : position;
    
    // Initialize expanded state
    useEffect(() => {
        // Start with a clean slate - close all menus
        const newExpandedItems: Record<string, boolean> = {};
        
        // Process menus that should be expanded
        const processMenuItems = (menuItems: NavItem[], parentKey?: string) => {
            menuItems.forEach(item => {
                // If this is the active item or contains the active item
                const isItemActive = isActive(item.href);
                const hasActiveChild = item.children && isChildActive(item.children);
                
                // If this item or its children are active, expand it
                if (parentKey && (isItemActive || hasActiveChild)) {
                    newExpandedItems[parentKey] = true;
                }
                
                // If this item has children and is active, has active children, or defaultOpen is true, expand it
                if (item.children && (isItemActive || hasActiveChild || item.defaultOpen === true)) {
                    newExpandedItems[item.title] = true;
                    
                    // Recursively check children
                    processMenuItems(item.children, item.title);
                }
                
                // Check nested children with their own keys
                if (item.children) {
                    checkNestedChildren(item.children, 1, newExpandedItems);
                }
            });
        };
        
        processMenuItems(items);
        
        // Update state and save to localStorage
        setExpandedItems(newExpandedItems);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpandedItems));
        } catch (e) {
            console.error('Error saving navigation state:', e);
        }
    }, [page.url, items]); // Re-run when URL changes or items change
    
    // Helper function to check nested children for active items
    const checkNestedChildren = (
        children: NavItem[], 
        level: number, 
        newExpandedItems: Record<string, boolean>
    ) => {
        children.forEach(child => {
            const childKey = `${level}-${child.title}`;
            const isChildItemActive = isActive(child.href);
            const hasActiveChild = child.children && isChildActive(child.children);
            
            if (child.children && (isChildItemActive || hasActiveChild)) {
                newExpandedItems[childKey] = true;
                checkNestedChildren(child.children, level + 1, newExpandedItems);
            }
        });
    };
    
    const toggleExpand = (title: string) => {
        const newExpandedItems = {
            ...expandedItems,
            [title]: !expandedItems[title]
        };
        
        setExpandedItems(newExpandedItems);
        
        // Save to localStorage
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpandedItems));
        } catch (e) {
            console.error('Error saving navigation state:', e);
        }
    };
    
    const isActive = (href?: string) => {
        if (!href) return false;
        
        // Extract pathname from href if it's a full URL, and strip query parameters 
        const hrefPath = href.startsWith('http') ? new URL(href).pathname : href.split('?')[0];
        // Strip query parameters from the current Inertia page url
        const currentPath = page.url.split('?')[0];
        
        const active = currentPath === hrefPath || currentPath.startsWith(hrefPath + '/');
        return active;
    };
    
    const isChildActive = (children?: NavItem[]) => {
        if (!children) return false;
        return children.some(child => isActive(child.href) || isChildActive(child.children));
    };
    
    const renderSubMenu = (children: NavItem[], level: number = 1) => {
        return (
            <SidebarMenuSub>
                {children.map(child => (
                    <div key={child.title}>
                        {child.children ? (
                            // Nested submenu item with children
                            <>
                                <SidebarMenuSubItem>
                                    <SidebarMenuSubButton 
                                        isActive={isChildActive(child.children)}
                                        onClick={() => toggleExpand(`${level}-${child.title}`)}
                                    >
                                        <div className={`flex items-center gap-2 ${effectivePosition === 'right' ? 'justify-end text-right' : 'justify-start text-left'}`}>
                                            <span>{child.title}</span>
                                            {shouldShowText && (
                                                expandedItems[`${level}-${child.title}`] ? 
                                                    <ChevronDown className="h-4 w-4 ml-auto" /> : 
                                                    <ChevronRight className="h-4 w-4 ml-auto" />
                                            )}
                                        </div>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                                
                                {/* Render nested children */}
                                {expandedItems[`${level}-${child.title}`] && renderSubMenu(child.children, level + 1)}
                            </>
                        ) : (
                            // Regular submenu item
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild isActive={isActive(child.href)}>
                                    {child.target === '_blank' ? (
                                        <a
                                            href={child.href || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-2 ${effectivePosition === 'right' ? 'justify-end text-right' : 'justify-start text-left'}`}
                                        >
                                            <span>{child.title}</span>
                                        </a>
                                    ) : (
                                        <Link
                                            href={child.href || '#'}
                                            prefetch
                                            className={`flex items-center gap-2 ${effectivePosition === 'right' ? 'justify-end text-right' : 'justify-start text-left'}`}
                                        >
                                            <span 
                                                className="truncate"
                                            >
                                                {child.title}
                                            </span>
                                        </Link>
                                    )}
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        )}
                    </div>
                ))}
            </SidebarMenuSub>
        );
    };
    
    return (
        <SidebarGroup className="px-1.5 py-0">
            <SidebarMenu className="space-y-1">
                {items.map((item) => (
                    <div key={item.title}>
                        {item.children ? (
                            // Parent item with children
                            <>
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        isActive={isChildActive(item.children)} 
                                        tooltip={{ 
                                            children: state === "collapsed" && item.children ? (
                                                <div className="space-y-1 min-w-[150px]">
                                                    <div className="font-medium text-sm mb-2">{item.title}</div>
                                                    <div className="space-y-1">
                                                        {item.children.map(child => (
                                                            <Link 
                                                                key={child.title} 
                                                                href={child.href || '#'}
                                                                className="block text-xs opacity-80 hover:opacity-100 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-2 py-1 rounded transition-colors"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {child.title}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : item.title 
                                        }}
                                        onClick={() => toggleExpand(item.title)}
                                        className="w-full cursor-pointer"
                                    >
                                        <div className={`flex items-center gap-2 w-full ${effectivePosition === 'right' ? 'justify-end text-right' : 'justify-start text-left'}`}>
                                            {effectivePosition === 'right' ? (
                                                <>
                                                    <span>{shouldShowText ? item.title : ""}</span>
                                                    {item.icon && <item.icon style={{ width: '16px', height: '16px', minWidth: '16px', minHeight: '16px' }} />}
                                                    {shouldShowText && (
                                                        expandedItems[item.title] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {item.icon && <item.icon style={{ width: '16px', height: '16px', minWidth: '16px', minHeight: '16px' }} />}
                                                    <div className="flex items-center gap-1">
                                                        <span>{item.title}</span>
                                                        {(state !== "collapsed" || isMobile) && item.badge && (
                                                            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-primary text-white">
                                                                {item.badge.label}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {shouldShowText && (
                                                        expandedItems[item.title] ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                
                                {/* Child items */}
                                {expandedItems[item.title] && renderSubMenu(item.children)}
                            </>
                        ) : (
                            // Regular item without children
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={{ children: item.title }} className="w-full">
                                    {item.target === '_blank' ? (
                                        <a
                                            href={item.href || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center gap-2 w-full ${effectivePosition === 'right' ? 'justify-end text-right' : 'justify-start text-left'}`}
                                        >
                                            {effectivePosition === 'right' ? (
                                                <>
                                                    <span>{item.title}</span>
                                                    {item.icon && <item.icon style={{ width: '16px', height: '16px', minWidth: '16px', minHeight: '16px' }} />}
                                                </>
                                            ) : (
                                                <>
                                                    {item.icon && <item.icon style={{ width: '16px', height: '16px', minWidth: '16px', minHeight: '16px' }} />}
                                                    <span>{item.title}</span>
                                                </>
                                            )}
                                        </a>
                                    ) : (
                                        <Link
                                            href={item.href || '#'}
                                            prefetch
                                            className={`flex items-center gap-2 w-full ${effectivePosition === 'right' ? 'justify-end text-right' : 'justify-start text-left'}`}
                                        >
                                            {effectivePosition === 'right' ? (
                                                <>
                                                    <span>{item.title}</span>
                                                    {item.icon && <item.icon style={{ width: '16px', height: '16px', minWidth: '16px', minHeight: '16px' }} />}
                                                </>
                                            ) : (
                                                <>
                                                    {item.icon && <item.icon style={{ width: '16px', height: '16px', minWidth: '16px', minHeight: '16px' }} />}
                                                    <span>{item.title}</span>
                                                </>
                                            )}
                                        </Link>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )}
                    </div>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}