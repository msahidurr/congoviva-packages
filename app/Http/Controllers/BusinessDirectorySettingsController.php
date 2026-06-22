<?php

namespace App\Http\Controllers;

use App\Models\BusinessDirectorySetting;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessDirectorySettingsController extends Controller
{

    public function index()
    {
        $settings = BusinessDirectorySetting::getSettings();
        
        return Inertia::render('business-directory/settings', [
            'settings' => $settings,
            'directoryGlobalSettings' => [
                'is_enabled' => Setting::where('key', 'business_directory_enabled')->where('user_id', 1)->value('value') === '1'
            ]
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'menu_items' => 'nullable|array',
            'config_sections' => 'nullable|array'
        ]);

        $settings = BusinessDirectorySetting::getSettings();
        
        $settings->update([
            'title' => $request->title,
            'description' => $request->description,
            'menu_items' => $request->menu_items,
            'config_sections' => $request->config_sections
        ]);

        return redirect()->back()->with('success', 'Directory settings updated successfully');
    }
    
    public function toggleGlobal(Request $request)
    {
        $enabled = $request->boolean('is_enabled', true);
        
        Setting::updateOrCreate(
            ['key' => 'business_directory_enabled', 'user_id' => 1],
            ['value' => $enabled ? '1' : '0']
        );
        
        return back()->with('success', __('Business Directory setting updated successfully'));
    }
}