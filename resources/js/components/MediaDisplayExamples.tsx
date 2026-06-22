import React from 'react';
import MediaGrid from './MediaGrid';
import MediaGallery from './MediaGallery';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

// Mock data for demonstration
const mockMediaItems = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Image ${i + 1}`,
  file_name: `image-${i + 1}.jpg`,
  url: `https://picsum.photos/400/400?random=${i + 1}`,
  thumb_url: `https://picsum.photos/200/200?random=${i + 1}`,
  size: 1024 * (i + 1),
  mime_type: 'image/jpeg',
  created_at: new Date().toISOString()
}));

export default function MediaDisplayExamples() {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const handleSelect = (url: string) => {
    setSelectedItems(prev => 
      prev.includes(url) 
        ? prev.filter(item => item !== url)
        : [...prev, url]
    );
  };

  const handleGalleryClick = (item: any) => {
    console.log('Gallery item clicked:', item);
  };

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Media Display Examples</h1>
        <p className="text-gray-600">
          Demonstrating conditional scrolling based on the number of media items
        </p>
      </div>

      {/* Example 1: Few items (no scroll) */}
      <Card>
        <CardHeader>
          <CardTitle>Few Items - No Scroll</CardTitle>
          <CardDescription>
            When there are 6 or fewer items, no scrolling is applied
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MediaGrid
            media={mockMediaItems.slice(0, 6)}
            selectedItems={selectedItems}
            onSelect={handleSelect}
            scrollThreshold={8}
          />
        </CardContent>
      </Card>

      {/* Example 2: Many items (with scroll) */}
      <Card>
        <CardHeader>
          <CardTitle>Many Items - With Scroll</CardTitle>
          <CardDescription>
            When there are more than 12 items, scrolling is automatically enabled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MediaGrid
            media={mockMediaItems}
            selectedItems={selectedItems}
            onSelect={handleSelect}
            scrollThreshold={12}
          />
        </CardContent>
      </Card>

      {/* Example 3: Gallery view with different threshold */}
      <Card>
        <CardHeader>
          <CardTitle>Gallery View - Custom Threshold</CardTitle>
          <CardDescription>
            Gallery layout with 4 columns and scroll after 8 items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MediaGallery
            items={mockMediaItems.slice(0, 15)}
            onItemClick={handleGalleryClick}
            scrollThreshold={8}
            columns={4}
          />
        </CardContent>
      </Card>

      {/* Example 4: Compact view */}
      <Card>
        <CardHeader>
          <CardTitle>Compact View - 8 Columns</CardTitle>
          <CardDescription>
            More columns with lower scroll threshold for compact displays
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MediaGrid
            media={mockMediaItems}
            selectedItems={selectedItems}
            onSelect={handleSelect}
            scrollThreshold={16}
            columns={8}
            maxHeight="h-64"
          />
        </CardContent>
      </Card>

      {/* Selection Summary */}
      {selectedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">
              {selectedItems.length} item(s) selected
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Selected ${index + 1}`}
                  className="w-16 h-16 object-cover rounded border"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}