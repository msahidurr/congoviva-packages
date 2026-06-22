<?php

namespace App\Http\Controllers\Installer;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use RachidLaasri\LaravelInstaller\Helpers\DatabaseManager;

class DatabaseController extends Controller
{
    /**
     * @var DatabaseManager
     */
    private $databaseManager;

    /**
     * @param DatabaseManager $databaseManager
     */
    public function __construct(DatabaseManager $databaseManager)
    {
        $this->databaseManager = $databaseManager;
    }

    /**
     * Show the database setup page.
     *
     * @return \Illuminate\View\View
     */
    public function database()
    {
        return view('vendor.installer.database');
    }

    /**
     * Run migration via AJAX.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function runMigration()
    {
        try {
            $response = $this->databaseManager->migrateAndSeed();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Database migration completed successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Migration failed: ' . $e->getMessage()
            ], 500);
        }
    }
}