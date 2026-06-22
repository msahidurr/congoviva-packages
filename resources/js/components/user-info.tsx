import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import { type User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
    className = '',
    position,
}: {
    user: User;
    showEmail?: boolean;
    className?: string;
    position: 'left' | 'right';
}) {
    const getInitials = useInitials();

    const getAvatarUrl = () => {
        if (user.avatar_url) {
            return getImageDisplayUrl(user.avatar_url);
        }
        return undefined;
    };

    return (
        <div className={`flex items-center gap-2 w-full ${position === 'right' ? 'flex-row-reverse text-right' : ''}`}>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={getAvatarUrl()} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className={`grid flex-1 text-sm leading-tight ${className}`}>
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && <span className="text-muted-foreground truncate text-xs">{user.email}</span>}
            </div>
        </div>
    );
}
