<?php

namespace App\Console\Commands;

use App\Models\Addon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Filesystem\Filesystem;

class CreatePackage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'package:make {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new package with the specified folder structure';

    /**
     * Execute the console command.
     */

    protected $files;
    public $LowerName;
    public $UpperName;
    public $packageName;

    public function __construct(Filesystem $files)
    {
        parent::__construct();
        $this->files = $files;
    }

    public function handle()
    {
        $name = $this->argument('name');
        
        // Validate package name to prevent path traversal
        if (!preg_match('/^[A-Za-z][A-Za-z0-9]*$/', $name)) {
            $this->error('Invalid package name. Use only alphanumeric characters.');
            return 1;
        }
        
        $this->LowerName = strtolower($name);
        $this->UpperName = $name;
        $this->packageName = $this->camelToKebab($name);

        $packagePath = base_path("packages/workdo/{$name}");

        if (File::exists($packagePath)) {
            $this->error("Package {$name} already exists!");
            return;
        }

        File::makeDirectory($packagePath, 0755, true);

        $folders = [
            'src/database/migrations',
            'src/database/seeders',
            'src/Http/Controllers',
            'src/Models',
            'src/Providers',
            'src/resources/js/pages',
            'src/resources/js/menus',
            'src/routes',
            'src/services',
            'config'
        ];

        foreach ($folders as $folder) {
            File::makeDirectory("{$packagePath}/{$folder}", 0755, true);
        }

        $this->createStubFiles($packagePath);

        $this->createFiles();

        $addon = Addon::where('name', $this->UpperName)->first();
        if(empty($addon))
        {
            $addon = new Addon;
            $addon->name = $this->UpperName;
            $addon->slug = $this->packageName;
            $addon->monthly_price = 0;
            $addon->yearly_price = 0;
            $addon->is_enabled = 0;
            $addon->package_name = $this->UpperName;
            $addon->save();
        }


        $this->info("Package {$name} created successfully!");
    }

    protected function camelToKebab($name)
    {
        $packageName = preg_replace('/([a-z])([A-Z])/', '$1-$2', $name);
        return strtolower($packageName);
    }

    protected function getComposerJsonStub()
    {
        $name = "workdo/{$this->packageName}";
        $description = "Description for {$this->packageName} package";
        $namespace = "Workdo\\\\{$this->UpperName}\\\\Providers\\\\{$this->UpperName}ServiceProvider";

        return <<<EOT
        {
            "name": "{$name}",
            "description": "{$description}",
            "type": "library",
            "license": "MIT",
            "require": {},
            "autoload": {
                "psr-4": {
                    "Workdo\\\\{$this->UpperName}\\\\": "src/"
                }
            },
            "authors": [
                {
                    "name": "WorkDo",
                    "email": "support@workdo.io"
                }
            ],
            "extra": {
                "laravel": {
                    "providers": [
                        "{$namespace}"
                    ]
                }
            }
        }
        EOT;
    }

    protected function getModuleJsonStub()
    {
        return <<<EOT
        {
            "name": "{$this->UpperName}",
            "alias": "{$this->packageName}",
            "description": "",
            "priority": 0,
            "version":"1.0",
            "monthly_price": 0,
            "yearly_price": 0,
            "package_name":"{$this->UpperName}"
        }
        EOT;
    }

    protected function createStubFiles($packagePath)
    {
        $composerJson = $this->getComposerJsonStub();
        $this->files->put($packagePath . "/composer.json", $composerJson);

        $moduleJson = $this->getModuleJsonStub();
        $this->files->put($packagePath . "/module.json", $moduleJson);

        $serviceProviderStub = $this->getServiceProviderStub();
        $this->files->put($packagePath . "/src/Providers/{$this->UpperName}ServiceProvider.php", $serviceProviderStub);

        $seederStub = $this->getSeederStub();
        $this->files->put($packagePath."/src/database/seeders/{$this->UpperName}DatabaseSeeder.php",$seederStub);
    }

    protected function createFiles()
    {
        $files = [
            'routes/web.stub' => 'src/routes/web.php',
            'seeders/PermissionTableSeeder.stub' => 'src/database/seeders/PermissionTableSeeder.php',
            'controller.stub' => 'src/Http/Controllers/{$this->UpperName}Controller.php',
            'resources/js/pages/index.tsx.stub' => 'src/resources/js/pages/index.tsx',
            'resources/js/pages/create.tsx.stub' => 'src/resources/js/pages/create.tsx',
            'resources/js/pages/edit.tsx.stub' => 'src/resources/js/pages/edit.tsx',
            'resources/js/menus/company-menu.ts.stub' => 'src/resources/js/menus/company-menu.ts',
            'resources/js/menus/superadmin-menu.ts.stub' => 'src/resources/js/menus/superadmin-menu.ts'
        ];

        foreach ($files as $stubFile => $phpFile) {
            $stubPath = base_path('stubs/workdo-stubs/'.$stubFile);
            
            if (!File::exists($stubPath)) {
                $this->warn("Stub file not found: {$stubFile}");
                continue;
            }
            
            $stub = File::get($stubPath);

            $stub = str_replace(
                ['$STUDLY_NAME$', '$LOWER_NAME$', '$PACKAGE_NAME$'],
                [$this->UpperName, $this->LowerName, $this->packageName],
                $stub
            );

            $phpFile = str_replace('{$this->UpperName}', $this->UpperName, $phpFile);
            $filePath = base_path("packages/workdo/{$this->UpperName}/".$phpFile);

            if (!File::exists(dirname($filePath))) {
                File::makeDirectory(dirname($filePath), 0755, true);
            }
            $this->files->put($filePath, $stub);
        }
    }

    protected function getServiceProviderStub()
    {
        return <<<EOT
        <?php

        namespace Workdo\\{$this->UpperName}\\Providers;

        use Illuminate\Support\ServiceProvider;

        class {$this->UpperName}ServiceProvider extends ServiceProvider
        {
            protected \$moduleName = '{$this->UpperName}';
            protected \$moduleNameLower = '{$this->LowerName}';

            public function register()
            {
                //
            }

            public function boot()
            {
                \$this->loadRoutesFrom(__DIR__ . '/../routes/web.php');
                \$this->loadMigrationsFrom(__DIR__ . '/../database/migrations');
            }
        }
        EOT;
    }

    protected function getSeederStub()
    {
        return <<<EOT
        <?php

        namespace Workdo\\{$this->UpperName}\\database\seeders;

        use Illuminate\Database\Seeder;
        use Illuminate\Database\Eloquent\Model;

        class {$this->UpperName}DatabaseSeeder extends Seeder
        {
            /**
             * Run the database seeds.
             *
             * @return void
             */
            public function run()
            {
                Model::unguard();

                \$this->call(PermissionTableSeeder::class);
            }
        }
        EOT;
    }
}