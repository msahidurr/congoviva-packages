import { LucideIcon } from 'lucide-react';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    avatar_url?: string | null;
    email_verified_at?: string | null;
}

export interface SharedData {
    auth: {
        user: User | null;
    };
}

export interface NavItem {
    title: string;
    href?: string;
    icon?: React.ReactNode;
    permission?: string;
    children?: NavItem[];
    target?: string;
    external?: boolean;
    defaultOpen?: boolean;
    order?: number;
    badge?: {
        label: string;
        variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
    };
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface PageAction {
    label: string;
    icon: React.ReactNode;
    variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    onClick: () => void;
}