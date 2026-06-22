<?php

namespace App\Http\Controllers\Installer;

use Illuminate\Routing\Controller;
use RachidLaasri\LaravelInstaller\Helpers\RequirementsChecker;

class RequirementsController extends Controller
{
    protected $requirements;

    public function __construct(RequirementsChecker $checker)
    {
        $this->requirements = $checker;
    }

    public function requirements()
    {
        $phpSupportInfo = $this->requirements->checkPHPversion(
            config('installer.core.minPhpVersion')
        );
        
        $requirements = $this->checkAllRequirements(
            config('installer.requirements')
        );

        return view('vendor.installer.requirements', compact('requirements', 'phpSupportInfo'));
    }

    private function checkAllRequirements(array $requirements)
    {
        $results = [];

        foreach ($requirements as $type => $requirement) {
            switch ($type) {
                case 'php':
                case 'php_optional':
                    foreach ($requirement as $ext) {
                        $results['requirements'][$type][$ext] = extension_loaded($ext);
                        if (!extension_loaded($ext) && $type === 'php') {
                            $results['errors'] = true;
                        }
                    }
                    break;
                    
                case 'database':
                case 'webserver':
                case 'system':
                    $results['requirements'][$type] = $requirement;
                    break;
                    
                case 'apache':
                    foreach ($requirement as $mod) {
                        if (function_exists('apache_get_modules')) {
                            $results['requirements'][$type][$mod] = in_array($mod, apache_get_modules());
                            if (!in_array($mod, apache_get_modules())) {
                                $results['errors'] = true;
                            }
                        }
                    }
                    break;
            }
        }

        return $results;
    }
}