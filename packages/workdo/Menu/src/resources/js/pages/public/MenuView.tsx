import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MenuPreview from '../components/MenuPreview';
import { QRShareModal } from '@/components/QRShareModal';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface Menu {
    id: number;
    name: string;
    menu_type: string;
    config_sections: any;
    favicon?: string;
}

interface Props {
    menu: Menu;
}

const MenuView: React.FC<Props> = ({ menu }) => {
    const { flash } = usePage().props as any;
    const { i18n } = useTranslation();
    const [showQrModal, setShowQrModal] = useState(false);
    
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);
    
    useEffect(() => {
        const handleOpenQrModal = () => setShowQrModal(true);
        window.addEventListener('openQrModal', handleOpenQrModal);
        
        return () => {
            window.removeEventListener('openQrModal', handleOpenQrModal);
        };
    }, []);

    return (
        <>
            <Head title={menu.name} />
            <Toaster position="top-right" richColors />
            
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        <MenuPreview data={menu} menuType={menu.menu_type} />
                    </div>
                </div>
            </div>
            
            <QRShareModal 
                isOpen={showQrModal}
                onClose={() => setShowQrModal(false)}
                url={typeof window !== 'undefined' ? window.location.href : ''}
                colors={menu.config_sections?.colors}
                font={menu.config_sections?.font || 'Inter, sans-serif'}
                socialLinks={[
                    { platform: 'facebook', url: '#' },
                    { platform: 'twitter', url: '#' },
                    { platform: 'whatsapp', url: '#' },
                    { platform: 'telegram', url: '#' }
                ]}
            />
        </>
    );
};

export default MenuView;