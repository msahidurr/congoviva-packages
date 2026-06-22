import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import { Upload, Search, X, Plus, Eye, Copy, Download, Image as ImageIcon, Calendar, HardDrive, BarChart3, Image, Trash, Trash2 } from 'lucide-react';

interface MediaItem {
  id: number;
  name: string;
  file_name: string;
  url: string;
  thumb_url: string;
  size: number;
  mime_type: string;
  created_at: string;
}

export default function MediaLibraryDemo() {
  const { t } = useTranslation();
  const { csrf_token } = usePage().props as any;
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedMediaInfo, setSelectedMediaInfo] = useState<MediaItem | null>(null);
  const itemsPerPage = 12;

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

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(route('media.index'), {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMedia(data);
      setFilteredMedia(data);
    } catch (error) {
      console.error('Failed to load media:', error);
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);



  useEffect(() => {
    const filtered = media.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.file_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedia(filtered);
    setCurrentPage(1);
  }, [searchTerm, media]);



  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    
    const validFiles = Array.from(files);
    
    if (validFiles.length === 0) {
      setUploading(false);
      return;
    }
    
    const formData = new FormData();
    validFiles.forEach(file => {
      formData.append('files[]', file);
    });
    
    try {
      const response = await fetch(route('media.batch'), {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrf_token,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
        credentials: 'same-origin',
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setMedia(prev => [...result.data, ...prev]);
        toast.success(result.message);
        
        // Show individual errors if any
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach((error: string) => {
            toast.error(error);
          });
        }
      } else {
        // Show individual errors if available, otherwise show main message
        if (result.errors && result.errors.length > 0) {
          result.errors.forEach((error: string) => {
            toast.error(error);
          });
        } else {
          toast.error(result.message || 'Failed to upload files');
        }
      }
    } catch (error) {
      toast.error('Error uploading files');
    }
    
    setUploading(false);
    setIsUploadModalOpen(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const deleteMedia = async (id: number) => {
    try {
      const response = await fetch(route('media.destroy', id), {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': csrf_token,
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        setMedia(prev => prev.filter(item => item.id !== id));
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error deleting media');
    }
  };

const handleCopyLink = (mediaItem: MediaItem) => {
    const url = mediaItem.url;
    // Fallback clipboard function for HTTP environments
    const copyToClipboard = (text: string) => {
      if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API for HTTPS
        return navigator.clipboard.writeText(text);
      } else {
        // Fallback for HTTP environments
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise<void>((resolve, reject) => {
          if (document.execCommand('copy')) {
            textArea.remove();
            resolve();
          } else {
            textArea.remove();
            reject(new Error('Copy failed'));
          }
        });
      }
    };
    copyToClipboard(url)
      .then(() => {
        toast.success(t('Link copied to clipboard'));
      })
      .catch(() => {
        toast.error(t('Failed to copy link'));
      });
  };

  const handleDownload = (id: number, filename: string) => {
    const link = document.createElement('a');
    link.href = route('media.download', id);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started');
  };

  const handleShowInfo = (item: MediaItem) => {
    setSelectedMediaInfo(item);
    setInfoModalOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (mimeType.includes('pdf')) return <div className="h-4 w-4 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">PDF</div>;
    if (mimeType.includes('word') || mimeType.includes('document')) return <div className="h-4 w-4 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">DOC</div>;
    if (mimeType.includes('csv') || mimeType.includes('spreadsheet')) return <div className="h-4 w-4 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">CSV</div>;
    if (mimeType.startsWith('video/')) return <div className="h-4 w-4 bg-purple-500 rounded text-white text-xs flex items-center justify-center font-bold">VID</div>;
    if (mimeType.startsWith('audio/')) return <div className="h-4 w-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">AUD</div>;
    return <div className="h-4 w-4 bg-gray-500 rounded text-white text-xs flex items-center justify-center font-bold">FILE</div>;
  };

  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMedia = filteredMedia.slice(startIndex, startIndex + itemsPerPage);

  const breadcrumbs = [
    { title: t('Dashboard'), href: '/dashboard' },
    { title: t('Media Library') }
  ];

  const pageActions = [
    {
      label: t('Upload Files'),
      icon: <Plus className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => setIsUploadModalOpen(true)
    }
  ];

  return (
    <PageTemplate 
      title={t('Media Library')} 
      url="/media-library"
      breadcrumbs={breadcrumbs}
      actions={pageActions}
    >
      <div className="space-y-6">

        {/* Search and Stats Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Section */}
              <div className="flex-1">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={t('Search media files...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {searchTerm && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('Showing results for "{{term}}"', { term: searchTerm })}
                  </p>
                )}
              </div>
              
              {/* Stats Section */}
              <div className="flex gap-6 items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/10 rounded-md">
                    <ImageIcon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold">{filteredMedia.length} {t('Files')}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-500/10 rounded-md">
                    <HardDrive className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold">
                    {formatFileSize(useMemo(() => filteredMedia.reduce((acc, item) => acc + item.size, 0), [filteredMedia]))}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/10 rounded-md">
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold">
                    {filteredMedia.filter(item => item.mime_type.startsWith('image/')).length} {t('Images')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Grid */}
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('Loading media...')}</p>
              </div>
            ) : currentMedia.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t('No media files found')}</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm ? t('No results found for "{{term}}"', { term: searchTerm }) : t('Get started by uploading your first file')}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setIsUploadModalOpen(true)}
                    size="lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('Upload Files')}
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {currentMedia.map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-card border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={() => handleShowInfo(item)}
                    >
                      {/* File Preview Container */}
                      <div className="relative aspect-square bg-muted flex items-center justify-center">
                        {item.mime_type.startsWith('image/') ? (
                          <img
                            src={item.thumb_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = item.url;
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4">
                            <div className="mb-2 text-2xl">
                              {getFileIcon(item.mime_type)}
                            </div>
                            <div className="text-xs text-center font-medium text-muted-foreground truncate w-full">
                              {item.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                            </div>
                          </div>
                        )}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium text-gray-900">
                              {t('Click to view')}
                            </div>
                          </div>
                        </div>
                        
                        {/* File Type Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-xs bg-background/95">
                            {item.mime_type.split('/')[1].toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Card Content */}
                      <div className="p-3 space-y-2">
                        <div>
                          <h3 className="text-sm font-medium truncate" title={item.name}>
                            {item.name}
                          </h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <HardDrive className="h-3 w-3" />
                            {formatFileSize(item.size)}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
                    <div className="text-sm text-muted-foreground">
                      {t('Showing')} <span className="font-semibold">{startIndex + 1}</span> {t('to')} <span className="font-semibold">{Math.min(startIndex + itemsPerPage, filteredMedia.length)}</span> {t('of')} <span className="font-semibold">{filteredMedia.length}</span> {t('files')}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      >
                        {t('Previous')}
                      </Button>
                      
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? 'default' : 'outline'}
                              size="sm"
                              className="w-10 h-8"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      >
                        {t('Next')}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Upload Modal */}
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} modal={!isChatGptOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {t('Upload Files')}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className={`transition-all duration-200 ${
                  dragActive ? 'scale-110' : ''
                }`}>
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className={`h-8 w-8 transition-colors ${
                      dragActive ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {dragActive ? t('Drop files here') : t('Upload your files')}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {t('Drag and drop your files here, or click to browse')}
                  </p>
                  
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload-modal"
                  />
                  
                  <Button
                    type="button"
                    onClick={() => document.getElementById('file-upload-modal')?.click()}
                    disabled={uploading}
                    size="lg"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('Uploading...')}
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('Choose Files')}
                      </>
                    )}
                  </Button>
                </div>
                
                {dragActive && (
                  <div className="absolute inset-0 bg-blue-500/10 rounded-xl" />
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Info Modal */}
        <Dialog open={infoModalOpen} onOpenChange={setInfoModalOpen} modal={!isChatGptOpen}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                {t('Media Details')}
              </DialogTitle>
            </DialogHeader>
            
            {selectedMediaInfo && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 overflow-y-auto max-h-[calc(95vh-100px)] pr-2">
                {/* Left Side - Large Media Preview (75% width) */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="flex justify-center items-center bg-muted/30 rounded-lg p-8 border border-border min-h-[700px]">
                    {selectedMediaInfo.mime_type.startsWith('image/') ? (
                      <img
                        src={selectedMediaInfo.url}
                        alt={selectedMediaInfo.name}
                        className="max-w-full max-h-[800px] w-auto h-auto object-contain rounded-md shadow-lg"
                        onError={(e) => {
                          e.currentTarget.src = selectedMediaInfo.thumb_url;
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full w-full">
                        <div className="mb-6 text-9xl">
                          {getFileIcon(selectedMediaInfo.mime_type)}
                        </div>
                        <div className="text-3xl font-semibold text-muted-foreground mb-3">
                          {selectedMediaInfo.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                        </div>
                        <div className="text-base text-muted-foreground mt-2 max-w-md text-center break-all px-4">
                          {selectedMediaInfo.file_name}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Right Side - Compact Details & Actions (25% width) */}
                <div className="lg:col-span-1 space-y-4">
                  {/* File Information */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground">{t('File Information')}</h3>
                    
                    <div className="space-y-2.5">
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('File Name')}</span>
                        <p className="text-sm font-medium text-foreground break-all leading-tight">
                          {selectedMediaInfo.file_name}
                        </p>
                      </div>
                      
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('Display Name')}</span>
                        <p className="text-sm font-medium text-foreground break-all leading-tight">
                          {selectedMediaInfo.name}
                        </p>
                      </div>
                      
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('File Type')}</span>
                        <Badge variant="secondary" className="text-xs font-mono">{selectedMediaInfo.mime_type}</Badge>
                      </div>
                      
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('File Size')}</span>
                        <p className="text-sm font-semibold text-foreground">{formatFileSize(selectedMediaInfo.size)}</p>
                      </div>
                      
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('Uploaded')}</span>
                        <p className="text-sm font-medium text-foreground">{formatDate(selectedMediaInfo.created_at)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* URL Section */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('File URL')}</span>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border border-border">
                      <code className="text-xs text-muted-foreground flex-1 break-all font-mono leading-tight">
                        {selectedMediaInfo.url}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLink(selectedMediaInfo);
                        }}
                        className="h-7 w-7 p-0 flex-shrink-0"
                        title={t('Copy URL')}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); window.open(selectedMediaInfo.url, '_blank'); }}
                        className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-3 rounded-lg border border-border bg-muted/40 text-foreground text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 shrink-0 text-green-500" />
                        <span className="leading-none">{t('View')}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (confirm(t('Are you sure you want to delete this file?'))) { deleteMedia(selectedMediaInfo.id); setInfoModalOpen(false); } }}
                        className="flex-1 inline-flex items-center justify-center gap-2 h-9 px-3 rounded-lg border border-border bg-muted/40 text-foreground text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5 shrink-0 text-red-500" />
                        <span className="leading-none">{t('Delete')}</span>
                      </button>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownload(selectedMediaInfo.id, selectedMediaInfo.file_name); }}
                      className="w-full inline-flex items-center justify-center gap-2 h-9 px-3 rounded-lg border border-border bg-muted/40 text-foreground text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 shrink-0" />
                      <span className="leading-none">{t('Download')}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTemplate>
  );
}