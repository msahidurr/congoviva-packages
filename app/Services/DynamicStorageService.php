<?php

namespace App\Services;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;

class DynamicStorageService
{
    /**
     * Configure dynamic storage disks based on database settings
     */
    public static function configureDynamicDisks(): void
    {
        try {
            $config = StorageConfigService::getStorageConfig();
            
            // Configure S3 disk if credentials exist
            if (!empty($config['s3']['key']) && !empty($config['s3']['secret'])) {
                self::configureS3Disk($config['s3']);
            }
            
            // Configure Wasabi disk if credentials exist
            if (!empty($config['wasabi']['key']) && !empty($config['wasabi']['secret'])) {
                self::configureWasabiDisk($config['wasabi']);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to configure dynamic storage disks', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
    
    /**
     * Configure S3 disk
     */
    private static function configureS3Disk(array $s3Config): void
    {
        // Validate required S3 credentials
        if (empty($s3Config['key']) || empty($s3Config['secret']) || empty($s3Config['bucket'])) {
            \Log::warning('S3 configuration incomplete', $s3Config);
            return;
        }
        
        // For standard AWS S3, endpoint should be null or the AWS endpoint
        $endpoint = null;
        if (!empty($s3Config['endpoint'])) {
            $endpoint = $s3Config['endpoint'];
        }
        
        $diskConfig = [
            'driver' => 's3',
            'key' => $s3Config['key'],
            'secret' => $s3Config['secret'],
            'region' => $s3Config['region'] ?: 'us-east-1',
            'bucket' => $s3Config['bucket'],
            'url' => $s3Config['url'] ?: null,
            'endpoint' => $endpoint,
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
        ];
        
        Config::set('filesystems.disks.s3', $diskConfig);
        
        \Log::info('S3 disk configured', [
            'bucket' => $s3Config['bucket'],
            'region' => $s3Config['region']
        ]);
    }
    
    /**
     * Configure Wasabi disk
     */
    private static function configureWasabiDisk(array $wasabiConfig): void
    {
        $region = $wasabiConfig['region'] ?: 'us-east-1';
        $endpoint = 'https://s3.' . $region . '.wasabisys.com';
        $bucketUrl = $endpoint . '/' . $wasabiConfig['bucket'];
        
        Config::set('filesystems.disks.wasabi', [
            'driver' => 's3',
            'key' => $wasabiConfig['key'],
            'secret' => $wasabiConfig['secret'],
            'region' => $region,
            'bucket' => $wasabiConfig['bucket'],
            'url' => $bucketUrl,
            'endpoint' => $endpoint,
            'use_path_style_endpoint' => true,
        ]);
    }

    /**
     * Get the active storage disk instance
     */
    public static function getActiveDiskInstance()
    {
        $diskName = StorageConfigService::getActiveDisk();
        
        // Ensure disk is configured
        self::configureDynamicDisks();
        
        try {
            return Storage::disk($diskName);
        } catch (\Exception $e) {
            \Log::warning('Failed to get active storage disk, falling back to public', [
                'disk' => $diskName,
                'error' => $e->getMessage()
            ]);
            // Fallback to public disk
            return Storage::disk('public');
        }
    }

    /**
     * Test storage connection
     */
    public static function testConnection(string $diskName): bool
    {
        try {
            self::configureDynamicDisks();
            $disk = Storage::disk($diskName);
            
            // Try to write and read a test file with unique name
            $testContent = 'test-' . time();
            $testPath = 'test-connection-' . uniqid() . '.txt';
            
            $disk->put($testPath, $testContent);
            $retrieved = $disk->get($testPath);
            $disk->delete($testPath);
            
            return $retrieved === $testContent;
        } catch (\Exception $e) {
            \Log::error('Storage connection test failed', [
                'disk' => $diskName,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}