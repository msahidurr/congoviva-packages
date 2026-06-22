<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;
use App\Models\AddOn;

class LanguageController extends Controller
{
    const ALLOWED_LANGUAGES = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'zh', 'ar', 'hi', 'ko', 'th', 'vi', 'tr', 'pl', 'nl', 'da', 'sv', 'no', 'fi', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sl', 'et', 'lv', 'lt', 'mt', 'ga', 'cy', 'eu', 'ca', 'gl', 'pt-BR', 'zh-CN', 'zh-TW', 'he'];
    // Show the manage language Inertia page
    public function managePage(Request $request)
    {
        $currentLanguage = $request->get('lang', 'en');
        $search = $request->get('search', '');
        $page = $request->get('page', 1);
        $perPage = 50;

        // Load current language translations
        $path = resource_path("lang/{$currentLanguage}.json");
        $allTranslations = [];

        if (File::exists($path)) {
            $allTranslations = json_decode(File::get($path), true) ?? [];
        } else if ($currentLanguage !== 'en') {
            // Fallback to English if language file doesn't exist
            $enPath = resource_path('lang/en.json');
            if (File::exists($enPath)) {
                $allTranslations = json_decode(File::get($enPath), true) ?? [];
            }
        }

        // Filter translations based on search
        $filteredTranslations = $allTranslations;
        if ($search) {
            $filteredTranslations = array_filter($allTranslations, function ($value, $key) use ($search) {
                return stripos($key, $search) !== false || stripos($value, $search) !== false;
            }, ARRAY_FILTER_USE_BOTH);
        }

        // Paginate translations
        $total = count($filteredTranslations);
        $lastPage = $total > 0 ? ceil($total / $perPage) : 1;
        $offset = ($page - 1) * $perPage;
        $paginatedTranslations = array_slice($filteredTranslations, $offset, $perPage, true);

        $paginationData = [
            'current_page' => (int) $page,
            'data' => $paginatedTranslations,
            'first_page_url' => $request->url() . '?' . http_build_query(array_merge($request->except('page'), ['page' => 1])),
            'from' => $total > 0 ? $offset + 1 : 0,
            'last_page' => $lastPage,
            'last_page_url' => $request->url() . '?' . http_build_query(array_merge($request->except('page'), ['page' => $lastPage])),
            'next_page_url' => $page < $lastPage ? $request->url() . '?' . http_build_query(array_merge($request->except('page'), ['page' => $page + 1])) : null,
            'path' => $request->url(),
            'per_page' => $perPage,
            'prev_page_url' => $page > 1 ? $request->url() . '?' . http_build_query(array_merge($request->except('page'), ['page' => $page - 1])) : null,
            'to' => min($offset + $perPage, $total),
            'total' => $total
        ];

        // Get enabled packages list only
        $enabledPackages = AddOn::where('is_enabled', true)->get(['package_name', 'name']);

        // Get available languages with flags
        $languagesData = json_decode(File::get(resource_path('lang/language.json')), true);
        $availableLanguages = collect($languagesData)
            ->map(function ($lang) {
                return [
                    'code' => $lang['code'],
                    'name' => $lang['name'],
                    'countryCode' => $lang['countryCode'],
                    'flag' => $this->getCountryFlag($lang['countryCode']),
                    'enabled' => $lang['enabled'] ?? true
                ];
            })->values()->toArray();

        // Get current language status
        $currentLangData = collect($languagesData)->firstWhere('code', $currentLanguage);
        $isCurrentLanguageEnabled = $currentLangData['enabled'] ?? true;

        return Inertia::render('manage-language', [
            'currentLanguage' => $currentLanguage,
            'translations' => $paginationData,
            'enabledPackages' => $enabledPackages,
            'availableLanguages' => $availableLanguages,
            'isCurrentLanguageEnabled' => $isCurrentLanguageEnabled,
            'filters' => ['search' => $search]
        ]);
    }

    // Load a language file
    public function load(Request $request)
    {
        $langListPath = resource_path('lang/language.json');
        $languages = collect();
        if (\Illuminate\Support\Facades\File::exists($langListPath)) {
            $languages = collect(json_decode(\Illuminate\Support\Facades\File::get($langListPath), true));
        }
        $lang = $request->get('lang', 'en');
        if (!$languages->pluck('code')->contains($lang)) {
            return response()->json(['error' => __('Language not found')], 404);
        }
        $langPath = resource_path("lang/{$lang}.json");
        if (!\Illuminate\Support\Facades\File::exists($langPath)) {
            return response()->json(['error' => __('Language file not found')], 404);
        }
        $data = json_decode(\Illuminate\Support\Facades\File::get($langPath), true);
        return response()->json(['data' => $data]);
    }

    // Save a language file
    public function save(Request $request)
    {
        try {
            $langListPath = resource_path('lang/language.json');
            $languages = collect();
            if (\Illuminate\Support\Facades\File::exists($langListPath)) {
                $languages = collect(json_decode(\Illuminate\Support\Facades\File::get($langListPath), true));
            }
            $lang = $request->get('lang');
            $data = $request->get('data');
            if (!$lang || !is_array($data) || !$languages->pluck('code')->contains($lang)) {
                if ($request->expectsJson()) {
                    return response()->json(['error' => __('Invalid request')], 400);
                }
                return redirect()->back()->with('error', __('Invalid request'));
            }
            $langPath = resource_path("lang/{$lang}.json");
            if (!\Illuminate\Support\Facades\File::exists($langPath)) {
                if ($request->expectsJson()) {
                    return response()->json(['error' => __('Language file not found')], 404);
                }
                return redirect()->back()->with('error', __('Language file not found'));
            }
            \Illuminate\Support\Facades\File::put($langPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            if ($request->expectsJson()) {
                return response()->json(['success' => __('Languagessss updated successfully')]);
            }
            return redirect()->back()->with('success', __('Language updated successfully'));
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json(['error' => __('Failed to update language file: ') . $e->getMessage()], 500);
            }
            return redirect()->back()->with('error', __('Failed to update language file: ') . $e->getMessage());
        }
    }


    public function createLanguage(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:10',
            'name' => 'required|string|max:255',
            'countryCode' => 'required|string|size:2'
        ], [
            'code.required' => __('Language code is required.'),
            'code.string' => __('Language code must be a valid string.'),
            'code.max' => __('Language code must not exceed 10 characters.'),
            'name.required' => __('Language name is required.'),
            'name.string' => __('Language name must be a valid string.'),
            'name.max' => __('Language name must not exceed 255 characters.'),
            'countryCode.required' => __('Country code is required.'),
            'countryCode.string' => __('Country code must be a valid string.'),
            'countryCode.size' => __('Country code must be exactly 2 characters.'),
        ]);

        try {
            // Check if language already exists in language.json
            $languagesFile = resource_path('lang/language.json');
            
            // Check if file is writable
           
            if (!is_writable($languagesFile)) {
                return response()->json(['error' => __('Language file is not writable. Please check file permissions.')], 500);
            }
            
            $languages = json_decode(File::get($languagesFile), true);

            $existingLanguage = collect($languages)->firstWhere('code', $request->code);
            if ($existingLanguage) {
                return response()->json(['error' => __('The language code already exists')], 422);
            }
            $languages[] = [
                'code' => $request->code,
                'name' => $request->name,
                'countryCode' => strtoupper($request->countryCode)
            ];
            
            $result = File::put($languagesFile, json_encode($languages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            if ($result === false) {
                return response()->json(['error' => __('Failed to write to language file. Please check file permissions.')], 500);
            }

            // Copy en.json to new language
            $enFile = resource_path('lang/en.json');
            $newLangFile = resource_path("lang/{$request->code}.json");
            if (File::exists($enFile)) {
                $enContent = File::get($enFile);
                File::put($newLangFile, $enContent);
            } else {
                // Create empty translation file if en.json doesn't exist
                File::put($newLangFile, json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            }

            // Copy package translations
            $enabledPackages = AddOn::where('is_enabled', true)->pluck('name');
            foreach ($enabledPackages as $packageName) {
                try {
                    $packageEnFile = base_path("packages/workdo/{$packageName}/src/Resources/lang/en.json");
                    $packageNewFile = base_path("packages/workdo/{$packageName}/src/Resources/lang/{$request->code}.json");
                    if (File::exists($packageEnFile)) {
                        $packageDir = dirname($packageNewFile);
                        if (!File::exists($packageDir)) {
                            File::makeDirectory($packageDir, 0755, true);
                        }
                        $packageContent = File::get($packageEnFile);
                        File::put($packageNewFile, $packageContent);
                    }
                } catch (\Exception $e) {
                    // Continue with other packages if one fails
                    continue;
                }
            }

            return response()->json(['success' => true, 'message' => __('The language has been created successfully.')]);
        } catch (\Exception $e) {
            // Check if language was actually created successfully
            $languagesFile = resource_path('lang/language.json');
            if (File::exists($languagesFile)) {
                $languages = json_decode(File::get($languagesFile), true);
                $createdLanguage = collect($languages)->firstWhere('code', $request->code);
                if ($createdLanguage) {
                    // Language was created successfully despite the exception
                    return response()->json(['success' => true, 'message' => __('The language has been created successfully.')]);
                }
            }
            return response()->json(['error' => 'Failed to create language: ' . $e->getMessage()], 500);
        }
    }

    public function deleteLanguage($languageCode)
    {
        if ($languageCode === 'en') {
            return response()->json(['error' => __('Cannot delete English language')], 422);
        }

        try {
            // Remove from language.json
            $languagesFile = resource_path('lang/language.json');
            $languages = json_decode(File::get($languagesFile), true);
            $languages = array_filter($languages, fn($lang) => $lang['code'] !== $languageCode);
            File::put($languagesFile, json_encode(array_values($languages), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            // Delete main language file
            $mainLangFile = resource_path("lang/{$languageCode}.json");
            if (File::exists($mainLangFile)) {
                File::delete($mainLangFile);
            }

            // Delete package language files
            $enabledPackages = AddOn::where('is_enabled', true)->pluck('package_name');
            foreach ($enabledPackages as $packageName) {
                $packageLangFile = base_path("packages/workdo/{$packageName}/src/Resources/lang/{$languageCode}.json");
                if (File::exists($packageLangFile)) {
                    File::delete($packageLangFile);
                }
            }

            return response()->json(['success' => true, 'message' => __('The language has been deleted.')]);
        } catch (\Exception $e) {
            return response()->json(['error' => __('Failed to delete language: :error', ['error' => $e->getMessage()])], 500);
        }
    }

    public function toggleLanguageStatus($languageCode)
    {
        if ($languageCode === 'en') {
            return response()->json(['error' => __('Cannot disable English language')], 422);
        }

        try {
            $languagesFile = resource_path('lang/language.json');
            $languages = json_decode(File::get($languagesFile), true);

            foreach ($languages as &$language) {
                if ($language['code'] === $languageCode) {
                    $language['enabled'] = !($language['enabled'] ?? true);
                    break;
                }
            }

            File::put($languagesFile, json_encode($languages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            return response()->json(['success' => true, 'message' => __('The language status updated successfully.')]);
        } catch (\Exception $e) {
            return response()->json(['error' => __('Failed to update language status: :error', ['error' => $e->getMessage()])], 500);
        }
    }

    private function getCountryFlag(string $countryCode): string
    {
        if (strlen($countryCode) !== 2) {
            return '🌐'; // Default flag for invalid codes
        }

        $codePoints = str_split(strtoupper($countryCode));
        $codePoints = array_map(fn($char) => 127397 + ord($char), $codePoints);
        return mb_convert_encoding('&#' . implode(';&#', $codePoints) . ';', 'UTF-8', 'HTML-ENTITIES');
    }

    public function getPackageTranslations($locale, $packageName)
    {
        $package = AddOn::where('package_name', $packageName)->where('is_enabled', true)->first();
        if (!$package) {
            return response()->json(['error' => 'Package not found or disabled'], 404);
        }

        // Try both package name and package_name
        $paths = [
            base_path("packages/workdo/{$packageName}/src/resources/lang/{$locale}.json"),
            base_path("packages/workdo/{$packageName}/src/Resources/lang/{$locale}.json"),
            base_path("packages/workdo/{$package->name}/src/resources/lang/{$locale}.json"),
            base_path("packages/workdo/{$package->name}/src/Resources/lang/{$locale}.json")
        ];

        $packageLangFile = null;
        $checkedPaths = [];
        foreach ($paths as $path) {
            $checkedPaths[] = $path . ' - ' . (File::exists($path) ? 'EXISTS' : 'NOT FOUND');
            if (File::exists($path)) {
                $packageLangFile = $path;
                break;
            }
        }

        // If not found, try English
        if (!$packageLangFile) {
            $englishPaths = [
                base_path("packages/workdo/{$packageName}/src/resources/lang/en.json"),
                base_path("packages/workdo/{$packageName}/src/Resources/lang/en.json"),
                base_path("packages/workdo/{$package->name}/src/resources/lang/en.json"),
                base_path("packages/workdo/{$package->name}/src/Resources/lang/en.json")
            ];

            foreach ($englishPaths as $path) {
                $checkedPaths[] = $path . ' - ' . (File::exists($path) ? 'EXISTS' : 'NOT FOUND');
                if (File::exists($path)) {
                    $packageLangFile = $path;
                    break;
                }
            }
        }

        if (!$packageLangFile) {
            return response()->json([
                'translations' => (object) [],
                'debug' => 'No file found',
                'package_name' => $package->name,
                'checked_paths' => $checkedPaths
            ]);
        }

        $content = File::get($packageLangFile);
        $translations = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['translations' => (object) [], 'debug' => 'JSON decode error', 'content' => substr($content, 0, 200)]);
        }

        return response()->json([
            'translations' => $translations ?? (object) [],
            'debug' => 'Success',
            'file' => $packageLangFile,
            'count' => count($translations ?? [])
        ]);
    }

    public function updateTranslations(Request $request, $locale)
    {
        $newTranslations = $request->input('translations');
        $path = resource_path("lang/{$locale}.json");
        
        try {
            // Ensure directory exists
            $dir = dirname($path);
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
            
            // Try to make file writable if it exists
            if (file_exists($path)) {
                @chmod($path, 0666);
            }
            
            // Load existing translations
            $existingTranslations = [];
            if (file_exists($path)) {
                $existingContent = File::get($path);
                $existingTranslations = json_decode($existingContent, true) ?? [];
            }
            
            // Merge new translations with existing ones
            $mergedTranslations = array_merge($existingTranslations, $newTranslations);
            
            $result = File::put($path, json_encode($mergedTranslations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            
            if ($result === false) {
                // If File::put fails, try alternative method
                $handle = @fopen($path, 'w');
                if ($handle) {
                    fwrite($handle, json_encode($mergedTranslations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                    fclose($handle);
                    @chmod($path, 0666);
                } else {
                    return response()->json(['error' => __('Cannot write to translation file. Please check permissions.')], 500);
                }
            }
            
            return response()->json(['success' => true, 'message' => __('Translations updated successfully')]);
        } catch (\Exception $e) {
            return response()->json(['error' => __('Failed to save translations: ') . $e->getMessage()], 500);
        }
    }

    public function updatePackageTranslations(Request $request, $locale, $packageName)
    {
        if (!in_array($locale, self::ALLOWED_LANGUAGES)) {
            return response()->json(['error' => __('Invalid language')], 400);
        }

        $package = AddOn::where('package_name', $packageName)->where('is_enabled', true)->first();
        if (!$package) {
            return response()->json(['error' => __('Package not found or disabled')], 404);
        }

        $request->validate([
            'translations' => 'required|array'
        ], [
            'translations.required' => __('Package translations are required.'),
            'translations.array' => __('Package translations must be a valid array.'),
        ]);

        $translations = $request->input('translations');

        // Find the correct path that exists (same logic as getPackageTranslations)
        $paths = [
            base_path("packages/workdo/{$packageName}/src/resources/lang/{$locale}.json"),
            base_path("packages/workdo/{$packageName}/src/Resources/lang/{$locale}.json"),
            base_path("packages/workdo/{$package->name}/src/resources/lang/{$locale}.json"),
            base_path("packages/workdo/{$package->name}/src/Resources/lang/{$locale}.json")
        ];

        $packageLangFile = null;
        foreach ($paths as $path) {
            if (File::exists($path)) {
                $packageLangFile = $path;
                break;
            }
        }

        // If no existing file found, use the first path as default
        if (!$packageLangFile) {
            $packageLangFile = $paths[0];
        }

        try {
            $packageLangDir = dirname($packageLangFile);
            if (!File::exists($packageLangDir)) {
                File::makeDirectory($packageLangDir, 0755, true);
            }

            File::put($packageLangFile, json_encode($translations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
            return response()->json(['success' => true, 'message' => __('The package translations updated successfully.')]);
        } catch (\Exception $e) {
            return response()->json(['error' => __('Failed to save package translations: :error', ['error' => $e->getMessage()])], 500);
        }
    }
}