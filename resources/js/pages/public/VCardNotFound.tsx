import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function VCardNotFound() {
  return (
    <>
      <Head title="vCard Not Found" />
      
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <CardTitle className="text-2xl">Page Not Found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                The Page you're looking for doesn't exist or may have been removed.
              </p>
              
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/" className="hover:!text-white">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Homepage
                  </Link>
                </Button>
                
                <Button variant="outline" onClick={() => window.history.back()} className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Looking to create your own vCard?
                </p>
                <Button asChild variant="link" className="p-0 h-auto">
                  <Link href="/">
                    Get started for free
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}