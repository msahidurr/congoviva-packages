<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;


class PackageSeed extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'package:seed {packageName?}';

    public $name;

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed a specific package or all packages';

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
            $this->seedPackage($packageName);
        } else {
            $this->seedAllPackages();
        }
    }

    protected function seedPackage($packageName)
    {
        $seederClass = $this->getSeederClass($packageName);

        if ($seederClass) {
            $this->info("Seeding {$packageName}...");
            Artisan::call('db:seed', ['--class' => $seederClass,'--force'=> true]);
            $this->info("{$packageName} Seeder Run Successfully!");
        } else {
            $this->error("Seeder for package {$packageName} not found.");
        }
    }

    protected function seedAllPackages()
    {
        $packages = $this->getAllPackages();
        foreach ($packages as $package) {
            $this->seedPackage($package);
        }
    }

    protected function getSeederClass($packageName)
    {
        $seederClass = "Workdo\\{$packageName}\\database\\seeders\\{$packageName}DatabaseSeeder";
        if (class_exists($seederClass)) {
            return $seederClass;
        }

        return null;
    }

    protected function getAllPackages()
    {
        $packages = [];

        $vendorDir = base_path('packages/workdo');
        
        if (!File::exists($vendorDir)) {
            return [];
        }
        
        $directories = File::directories($vendorDir);

        foreach ($directories as $directory) {
            $package = basename($directory);
            $packages[] = $package;
        }

        return $packages;
    }
}
