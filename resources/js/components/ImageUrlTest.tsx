import React from 'react';
import { getDisplayUrl } from '../pages/link-bio-builder/themes';

// Test component to verify image URL resolution
export default function ImageUrlTest() {
  const testUrls = [
    'storage/media/profile.jpg',
    '/storage/media/profile.jpg',
    'https://example.com/image.jpg',
    'http://example.com/image.jpg',
    'media/profile.jpg',
    ''
  ];

  return (
    <div className="p-4 space-y-2">
      <h3 className="font-bold">Image URL Resolution Test</h3>
      {testUrls.map((url, index) => (
        <div key={index} className="text-sm">
          <strong>Input:</strong> "{url}" <br />
          <strong>Output:</strong> "{getDisplayUrl(url)}"
        </div>
      ))}
    </div>
  );
}