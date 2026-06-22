import AppLogoIcon from './app-logo-icon';
import { useBrand } from '@/contexts/BrandContext';
import { useState } from 'react';

interface AppLogoProps {
    position?: 'left' | 'right';
    title?: string;
    iconClassName?: string;
    containerClassName?: string;
    textClassName?: string;
}

export default function AppLogo({ 
    position = 'left', 
    title, 
    iconClassName = 'size-5 fill-current text-white dark:text-black',
    containerClassName = 'bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md',
    textClassName = 'grid flex-1 truncate text-sm leading-none font-semibold'
}: AppLogoProps) {
    const { titleText, favicon } = useBrand();
    const [faviconError, setFaviconError] = useState(false);
    const isRight = position === 'right';
    const displayTitle = title || titleText;
    
    return (
        <div className={`w-full flex items-center ${isRight ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={containerClassName}>
                {favicon && !faviconError ? (
                    <img 
                        src={favicon} 
                        alt="Logo" 
                        className={iconClassName.replace('fill-current', '')} 
                        onError={() => setFaviconError(true)}
                    />
                ) : (
                    <AppLogoIcon className={iconClassName} />
                )}
            </div>
            <div className={`${textClassName} ${isRight ? 'mr-1 text-right' : 'ml-1 text-left'}`}>
                {displayTitle}
            </div>
        </div>
    );
}
