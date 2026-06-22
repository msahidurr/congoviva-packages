<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class PackageMigrate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'package:migrate {packageName?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate a specific package or all packages';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $packageName = $this->argument('packageName');
        
        // Validate package name if provided
        if ($packageName && !preg_match('/^[A-Za-z][A-Za-z0-9]*$/', $packageName)) {
            $this->error('Invalid package name. Use only alphanumeric characters.');
            return 1;
        }

        if ($packageName) {
            $this->migratePackage($packageName);
        } else {
            $this->migrateAllPackages();
        }
    }

    /**
     * Run migrations for a specific package.
     *
     * @param string $packageName
     */
    protected function migratePackage($packageName)
    {
        $migrationPath = base_path("packages/workdo/{$packageName}/src/database/migrations");

        if (File::exists($migrationPath)) {
            $this->info("Migrating package {$packageName}...");

            // Run migrations from the specified path
            $relativePath = "packages/workdo/{$packageName}/src/database/migrations";
            Artisan::call('migrate', ['--path' => $relativePath]);

            $this->info("Migrations for package {$packageName} completed successfully.");
        } else {
            $this->error("Migration path for package {$packageName} not found.");
        }
    }

    /**
     * Run migrations for all packages.
     */
    protected function migrateAllPackages()
    {
        $packages = $this->getAllPackages();
        foreach ($packages as $package) {
            $this->migratePackage($package);
        }
    }

    /**
     * Get all packages in the 'packages/workdo' directory.
     *
     * @return array
     */
    protected function getAllPackages()
    {
        $packages = [];

        $vendorDir = base_path('packages/workdo');
        
        if (!File::exists($vendorDir)) {
            return [];
        }
        
        $directories = File::directories($vendorDir);

        foreach ($directories as $directory) {
            $packages[] = basename($directory);
        }

        return $packages;
    }
}
