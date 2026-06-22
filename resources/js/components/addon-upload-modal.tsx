import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, X, FileArchive, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';

interface AddonUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddonUploadModal({ open, onOpenChange }: AddonUploadModalProps) {
  const { t } = useTranslation();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if ChatGPT modal is open
  const [isChatGptOpen, setIsChatGptOpen] = useState(false);
  
  useEffect(() => {
    const checkChatGpt = () => {
      const chatGptModal = document.querySelector('[data-chatgpt-modal]') || 
                          document.querySelector('.chatgpt-modal') ||
                          document.querySelector('[class*="chatgpt"]') ||
                          document.querySelector('[id*="chatgpt"]');
      setIsChatGptOpen(!!chatGptModal);
    };
    
    const observer = new MutationObserver(checkChatGpt);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const zipFile = files.find(file => file.name.endsWith('.zip'));
    
    if (zipFile) {
      setSelectedFile(zipFile);
    } else {
      toast.error(t('Please select a valid ZIP file'));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      setSelectedFile(file);
    } else {
      toast.error(t('Please select a valid ZIP file'));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('addon_file', selectedFile);

    router.post(route('addons.upload'), formData, {
      onSuccess: () => {
        onOpenChange(false);
        setSelectedFile(null);
      },
      onError: (errors) => {
        if (errors.addon_file) {
          toast.error(errors.addon_file);
        } else {
          toast.error(t('Failed to upload addon'));
        }
      },
      onFinish: () => {
        setIsUploading(false);
      }
    });
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose} modal={!isChatGptOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('Upload Addon')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-2">
                <FileArchive className="h-12 w-12 mx-auto text-primary" />
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4 mr-1" />
                  {t('Remove')}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-lg font-medium">{t('Drop your ZIP file here')}</p>
                <p className="text-sm text-gray-500">{t('or click to browse')}</p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {t('Select File')}
                </Button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
            >
              {t('Cancel')}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('Upload')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}