<?php

use App\Models\Setting;
use App\Models\User;
use App\Models\Coupon;
use Carbon\Carbon;
use App\Models\Plan;
use App\Models\PlanOrder;
use App\Models\Role;
use App\Models\PaymentSetting;
use App\Services\PermissionService;

if (!function_exists('getCacheSize')) {
    /**
     * Get the total cache size in MB
     *
     * @return string
     */
    function getCacheSize()
    {
        $file_size = 0;
        $framework_path = storage_path('framework');
        
        if (is_dir($framework_path)) {
            foreach (\File::allFiles($framework_path) as $file) {
                $file_size += $file->getSize();
            }
        }
        
        return number_format($file_size / 1000000, 2);
    }
}

if (! function_exists('settings')) {
    function settings($user_id = null)
    {
        // Skip database queries during installation
        if (request()->is('install/*') || request()->is('update/*') || !file_exists(storage_path('installed'))) {
            return [];
        }

        if (is_null($user_id)) {
            if (auth()->user()) {
                if (!in_array(auth()->user()->type, ['superadmin', 'company'])) {
                    $user_id = auth()->user()->created_by;
                } else {
                    $user_id = auth()->id();
                }
            } else {
                $user = User::where('type', 'superadmin')->first();
                $user_id = $user ? $user->id : null;
            }
        }

        if (!$user_id) {
            return [];
        }

        $userSettings = Setting::where('user_id', $user_id)->pluck('value', 'key')->toArray();
        
        // If user is not superadmin, merge with superadmin settings for specific keys
        if (auth()->check() && auth()->user()->type !== 'superadmin') {
            $superAdmin = User::where('type', 'superadmin')->first();
            if ($superAdmin) {
                $superAdminKeys = [
                    'decimalFormat', 'defaultCurrency', 'thousandsSeparator', 'floatNumber', 
                    'currencySymbolSpace', 'currencySymbolPosition', 'dateFormat', 'timeFormat', 
                    'calendarStartDay', 'defaultTimezone',
                    // Add storage settings for company users
                    'storage_type', 'storage_file_types', 'storage_max_upload_size',
                    'aws_access_key_id', 'aws_secret_access_key', 'aws_default_region', 
                    'aws_bucket', 'aws_url', 'aws_endpoint',
                    'wasabi_access_key', 'wasabi_secret_key', 'wasabi_region', 
                    'wasabi_bucket', 'wasabi_url', 'wasabi_root'
                ];
                $superAdminSettings = Setting::where('user_id', $superAdmin->id)
                    ->whereIn('key', $superAdminKeys)
                    ->pluck('value', 'key')
                    ->toArray();
                $userSettings = array_merge($superAdminSettings, $userSettings);
            }
        }

        return $userSettings;
    }
}

if (! function_exists('formatDateTime')) {
    function formatDateTime($date, $includeTime = true)
    {
        if (!$date) {
            return null;
        }

        $settings = settings();

        $dateFormat = $settings['dateFormat'] ?? 'Y-m-d';
        $timeFormat = $settings['timeFormat'] ?? 'H:i';
        $timezone = $settings['defaultTimezone'] ?? config('app.timezone', 'UTC');

        $format = $includeTime ? "$dateFormat $timeFormat" : $dateFormat;

        return Carbon::parse($date)->timezone($timezone)->format($format);
    }
}



if (! function_exists('getSetting')) {
    function getSetting($key, $default = null, $user_id = null)
    {
        $settings = settings($user_id);
        // Check if setting exists and has a non-empty value
        if (!isset($settings[$key]) && $default === null) {
            $defaultSettings = defaultSettings();
            $default = $defaultSettings[$key] ?? null;
        }
        
        return $settings[$key] ?? $default;
    }
}

if (! function_exists('updateSetting')) {
    function updateSetting($key, $value, $user_id = null)
    {
        if (is_null($user_id)) {
            if (auth()->user()) {
                if (!in_array(auth()->user()->type, ['superadmin', 'company'])) {
                    $user_id = auth()->user()->created_by;
                } else {
                    $user_id = auth()->id();
                }
            } else {
                $user = User::where('type', 'superadmin')->first();
                $user_id = $user ? $user->id : null;
            }
        }

        if (!$user_id) {
            return false;
        }

        return Setting::updateOrCreate(
            ['user_id' => $user_id, 'key' => $key],
            ['value' => $value]
        );
    }
}

if (! function_exists('isLandingPageEnabled')) {
    function isLandingPageEnabled()
    {
        return getSetting('landingPageEnabled', true) === true || getSetting('landingPageEnabled', true) === '1';
    }
}

if (! function_exists('isRegistrationEnabled')) {
    function isRegistrationEnabled()
    {
        return getSetting('registrationEnabled', true) === true || getSetting('registrationEnabled', true) === '1';
    }
}

if (! function_exists('isTemplatesSectionEnabled')) {
    function isTemplatesSectionEnabled($configSections = null)
    {
        if (!$configSections) {
            return true;
        }

        if (isset($configSections['section_visibility']['templates'])) {
            return $configSections['section_visibility']['templates'] !== false;
        }

        return true;
    }
}

if (! function_exists('updateSectionVisibility')) {
    function updateSectionVisibility($configSections, $sectionKey, $enabled)
    {
        if (!is_array($configSections)) {
            $configSections = [];
        }

        if (!isset($configSections['section_visibility'])) {
            $configSections['section_visibility'] = [];
        }

        $configSections['section_visibility'][$sectionKey] = $enabled;

        return $configSections;
    }
}

if (! function_exists('isSectionEnabled')) {
    function isSectionEnabled($configSections, $sectionKey)
    {
        if (!$configSections || !isset($configSections['section_visibility'])) {
            return true;
        }

        if (isset($configSections['section_visibility'][$sectionKey])) {
            return $configSections['section_visibility'][$sectionKey] !== false;
        }

        return true;
    }
}

if (! function_exists('defaultRoleAndSetting')) {
    function defaultRoleAndSetting($user)
    {
        $companyRole = Role::where('name', 'company')->first();
            
        if ($companyRole) {
            $user->assignRole($companyRole);
        }
        
        // Create default settings for the user
        if ($user->type === 'superadmin') {
            createDefaultSettings($user->id);
        } elseif ($user->type === 'company') {
            copySettingsFromSuperAdmin($user->id);
        }

        return true;
    }
}

if (! function_exists('getPaymentSettings')) {
    /**
     * Get payment settings for a user
     *
     * @param int|null $userId
     * @return array
     */
    function getPaymentSettings($userId = null)
    {
        if (is_null($userId)) {
            if (auth()->check() && auth()->user()->type == 'superadmin') {
                $userId = auth()->id();
            } else {
                $user = User::where('type', 'superadmin')->first();
                $userId = $user ? $user->id : null;
            }
        }

        return PaymentSetting::getUserSettings($userId);
    }
}

if (! function_exists('updatePaymentSetting')) {
    /**
     * Update or create a payment setting
     *
     * @param string $key
     * @param mixed $value
     * @param int|null $userId
     * @return \App\Models\PaymentSetting
     */
    function updatePaymentSetting($key, $value, $userId = null)
    {
        if (is_null($userId)) {
            $userId = auth()->id();
        }

        return PaymentSetting::updateOrCreateSetting($userId, $key, $value);
    }
}

if (! function_exists('isPaymentMethodEnabled')) {
    /**
     * Check if a payment method is enabled
     *
     * @param string $method (stripe, paypal, razorpay, mercadopago, bank)
     * @param int|null $userId
     * @return bool
     */
    function isPaymentMethodEnabled($method, $userId = null)
    {
        $settings = getPaymentSettings($userId);
        $key = "is_{$method}_enabled";
        
        return isset($settings[$key]) && ($settings[$key] === true || $settings[$key] === '1');
    }
}

if (! function_exists('getPaymentMethodConfig')) {
    /**
     * Get configuration for a specific payment method
     *
     * @param string $method (stripe, paypal, razorpay, mercadopago)
     * @param int|null $userId
     * @return array
     */
    function getPaymentMethodConfig($method, $userId = null)
    {
        $settings = getPaymentSettings($userId);
        
        switch ($method) {
            case 'stripe':
                return [
                    'enabled' => isPaymentMethodEnabled('stripe', $userId),
                    'key' => $settings['stripe_key'] ?? null,
                    'secret' => $settings['stripe_secret'] ?? null,
                ];
                
            case 'paypal':
                return [
                    'enabled' => isPaymentMethodEnabled('paypal', $userId),
                    'mode' => $settings['paypal_mode'] ?? 'sandbox',
                    'client_id' => $settings['paypal_client_id'] ?? null,
                    'secret' => $settings['paypal_secret_key'] ?? null,
                ];
                
            case 'razorpay':
                return [
                    'enabled' => isPaymentMethodEnabled('razorpay', $userId),
                    'key' => $settings['razorpay_key'] ?? null,
                    'secret' => $settings['razorpay_secret'] ?? null,
                ];
                
            case 'mercadopago':
                return [
                    'enabled' => isPaymentMethodEnabled('mercadopago', $userId),
                    'mode' => $settings['mercadopago_mode'] ?? 'sandbox',
                    'access_token' => $settings['mercadopago_access_token'] ?? null,
                ];
                
            case 'paystack':
                return [
                    'enabled' => isPaymentMethodEnabled('paystack', $userId),
                    'public_key' => $settings['paystack_public_key'] ?? null,
                    'secret_key' => $settings['paystack_secret_key'] ?? null,
                ];
                
            case 'flutterwave':
                return [
                    'enabled' => isPaymentMethodEnabled('flutterwave', $userId),
                    'public_key' => $settings['flutterwave_public_key'] ?? null,
                    'secret_key' => $settings['flutterwave_secret_key'] ?? null,
                ];
                
            case 'manual':
                return [
                    'enabled' => isPaymentMethodEnabled('manually', $userId),
                ];
                
            case 'free':
                return [
                    'enabled' => true, // Free plans are always enabled
                ];
                
            case 'bank':
                return [
                    'enabled' => isPaymentMethodEnabled('bank', $userId),
                    'details' => $settings['bank_detail'] ?? null,
                ];
                
            case 'paytabs':
                return [
                    'enabled' => isPaymentMethodEnabled('paytabs', $userId),
                    'mode' => $settings['paytabs_mode'] ?? 'sandbox',
                    'profile_id' => $settings['paytabs_profile_id'] ?? null,
                    'server_key' => $settings['paytabs_server_key'] ?? null,
                    'region' => $settings['paytabs_region'] ?? 'ARE',
                ];
                
            case 'skrill':
                return [
                    'enabled' => isPaymentMethodEnabled('skrill', $userId),
                    'merchant_id' => $settings['skrill_merchant_id'] ?? null,
                    'secret_word' => $settings['skrill_secret_word'] ?? null,
                ];
                
            case 'coingate':
                return [
                    'enabled' => isPaymentMethodEnabled('coingate', $userId),
                    'mode' => $settings['coingate_mode'] ?? 'sandbox',
                    'api_token' => $settings['coingate_api_token'] ?? null,
                ];
                
            case 'payfast':
                return [
                    'enabled' => isPaymentMethodEnabled('payfast', $userId),
                    'mode' => $settings['payfast_mode'] ?? 'sandbox',
                    'merchant_id' => $settings['payfast_merchant_id'] ?? null,
                    'merchant_key' => $settings['payfast_merchant_key'] ?? null,
                    'passphrase' => $settings['payfast_passphrase'] ?? null,
                ];
                
            case 'tap':
                return [
                    'enabled' => isPaymentMethodEnabled('tap', $userId),
                    'secret_key' => $settings['tap_secret_key'] ?? null,
                ];
                
            case 'xendit':
                return [
                    'enabled' => isPaymentMethodEnabled('xendit', $userId),
                    'api_key' => $settings['xendit_api_key'] ?? null,
                ];
                
            case 'paytr':
                return [
                    'enabled' => isPaymentMethodEnabled('paytr', $userId),
                    'merchant_id' => $settings['paytr_merchant_id'] ?? null,
                    'merchant_key' => $settings['paytr_merchant_key'] ?? null,
                    'merchant_salt' => $settings['paytr_merchant_salt'] ?? null,
                ];
                
            case 'mollie':
                return [
                    'enabled' => isPaymentMethodEnabled('mollie', $userId),
                    'api_key' => $settings['mollie_api_key'] ?? null,
                ];
                
            case 'toyyibpay':
                return [
                    'enabled' => isPaymentMethodEnabled('toyyibpay', $userId),
                    'category_code' => $settings['toyyibpay_category_code'] ?? null,
                    'secret_key' => $settings['toyyibpay_secret_key'] ?? null,
                    'mode' => $settings['toyyibpay_mode'] ?? 'sandbox',
                ];
                
            case 'cashfree':
                return [
                    'enabled' => isPaymentMethodEnabled('cashfree', $userId),
                    'mode' => $settings['cashfree_mode'] ?? 'sandbox',
                    'public_key' => $settings['cashfree_public_key'] ?? null,
                    'secret_key' => $settings['cashfree_secret_key'] ?? null,
                ];
                
            case 'iyzipay':
                return [
                    'enabled' => isPaymentMethodEnabled('iyzipay', $userId),
                    'mode' => $settings['iyzipay_mode'] ?? 'sandbox',
                    'public_key' => $settings['iyzipay_public_key'] ?? null,
                    'secret_key' => $settings['iyzipay_secret_key'] ?? null,
                ];
                
            case 'benefit':
                return [
                    'enabled' => isPaymentMethodEnabled('benefit', $userId),
                    'mode' => $settings['benefit_mode'] ?? 'sandbox',
                    'public_key' => $settings['benefit_public_key'] ?? null,
                    'secret_key' => $settings['benefit_secret_key'] ?? null,
                ];
                
            case 'ozow':
                return [
                    'enabled' => isPaymentMethodEnabled('ozow', $userId),
                    'mode' => $settings['ozow_mode'] ?? 'sandbox',
                    'site_key' => $settings['ozow_site_key'] ?? null,
                    'private_key' => $settings['ozow_private_key'] ?? null,
                    'api_key' => $settings['ozow_api_key'] ?? null,
                ];
                
            case 'easebuzz':
                return [
                    'enabled' => isPaymentMethodEnabled('easebuzz', $userId),
                    'merchant_key' => $settings['easebuzz_merchant_key'] ?? null,
                    'salt_key' => $settings['easebuzz_salt_key'] ?? null,
                    'environment' => $settings['easebuzz_environment'] ?? 'test',
                ];
                
            case 'khalti':
                return [
                    'enabled' => isPaymentMethodEnabled('khalti', $userId),
                    'public_key' => $settings['khalti_public_key'] ?? null,
                    'secret_key' => $settings['khalti_secret_key'] ?? null,
                ];
                
            case 'authorizenet':
                return [
                    'enabled' => isPaymentMethodEnabled('authorizenet', $userId),
                    'mode' => $settings['authorizenet_mode'] ?? 'sandbox',
                    'merchant_id' => $settings['authorizenet_merchant_id'] ?? null,
                    'transaction_key' => $settings['authorizenet_transaction_key'] ?? null,
                    'supported_countries' => ['US', 'CA', 'GB', 'AU'],
                    'supported_currencies' => ['USD', 'CAD', 'CHF', 'DKK', 'EUR', 'GBP', 'NOK', 'PLN', 'SEK', 'AUD', 'NZD'],
                ];
                
            case 'fedapay':
                return [
                    'enabled' => isPaymentMethodEnabled('fedapay', $userId),
                    'mode' => $settings['fedapay_mode'] ?? 'sandbox',
                    'public_key' => $settings['fedapay_public_key'] ?? null,
                    'secret_key' => $settings['fedapay_secret_key'] ?? null,
                ];
                
            case 'payhere':
                return [
                    'enabled' => isPaymentMethodEnabled('payhere', $userId),
                    'mode' => $settings['payhere_mode'] ?? 'sandbox',
                    'merchant_id' => $settings['payhere_merchant_id'] ?? null,
                    'merchant_secret' => $settings['payhere_merchant_secret'] ?? null,
                    'app_id' => $settings['payhere_app_id'] ?? null,
                    'app_secret' => $settings['payhere_app_secret'] ?? null,
                ];
                
            case 'cinetpay':
                return [
                    'enabled' => isPaymentMethodEnabled('cinetpay', $userId),
                    'site_id' => $settings['cinetpay_site_id'] ?? null,
                    'api_key' => $settings['cinetpay_api_key'] ?? null,
                    'secret_key' => $settings['cinetpay_secret_key'] ?? null,
                ];
                
            default:
                return [];
        }
    }
}

if (! function_exists('getEnabledPaymentMethods')) {
    /**
     * Get all enabled payment methods
     *
     * @param int|null $userId
     * @return array
     */
    function getEnabledPaymentMethods($userId = null)
    {
        $methods = ['free', 'manually', 'stripe', 'paypal', 'razorpay', 'mercadopago', 'paystack', 'flutterwave', 'bank', 'paytabs', 'skrill', 'coingate', 'payfast', 'tap', 'xendit', 'paytr', 'mollie', 'toyyibpay', 'cashfree', 'iyzipay', 'benefit', 'ozow', 'easebuzz', 'khalti', 'authorizenet', 'fedapay', 'payhere', 'cinetpay'];
        $enabled = [];
        
        foreach ($methods as $method) {
            if ($method === 'free' || isPaymentMethodEnabled($method, $userId)) {
                $enabled[$method] = getPaymentMethodConfig($method, $userId);
            }
        }
        
        return $enabled;
    }
}

if (! function_exists('validatePaymentMethodConfig')) {
    /**
     * Validate payment method configuration
     *
     * @param string $method
     * @param array $config
     * @return array [valid => bool, errors => array]
     */
    function validatePaymentMethodConfig($method, $config)
    {
        $errors = [];
        
        switch ($method) {
            case 'stripe':
                if (empty($config['key'])) {
                    $errors[] = 'Stripe publishable key is required';
                }
                if (empty($config['secret'])) {
                    $errors[] = 'Stripe secret key is required';
                }
                break;
                
            case 'paypal':
                if (empty($config['client_id'])) {
                    $errors[] = 'PayPal client ID is required';
                }
                if (empty($config['secret'])) {
                    $errors[] = 'PayPal secret key is required';
                }
                break;
                
            case 'razorpay':
                if (empty($config['key'])) {
                    $errors[] = 'Razorpay key ID is required';
                }
                if (empty($config['secret'])) {
                    $errors[] = 'Razorpay secret key is required';
                }
                break;
                
            case 'mercadopago':
                if (empty($config['access_token'])) {
                    $errors[] = 'MercadoPago access token is required';
                }
                break;
                
            case 'manual':
                // Manual payment doesn't require any configuration
                break;
                
            case 'bank':
                if (empty($config['details'])) {
                    $errors[] = 'Bank details are required';
                }
                break;
                
            case 'paytabs':
                if (empty($config['server_key'])) {
                    $errors[] = 'PayTabs server key is required';
                }
                if (empty($config['profile_id'])) {
                    $errors[] = 'PayTabs profile id is required';
                }
                if (empty($config['region'])) {
                    $errors[] = 'PayTabs region is required';
                }
                break;
                
            case 'skrill':
                if (empty($config['merchant_id'])) {
                    $errors[] = 'Skrill merchant ID is required';
                }
                if (empty($config['secret_word'])) {
                    $errors[] = 'Skrill secret word is required';
                }
                break;
                
            case 'coingate':
                if (empty($config['api_token'])) {
                    $errors[] = 'CoinGate API token is required';
                }
                break;
                
            case 'payfast':
                if (empty($config['merchant_id'])) {
                    $errors[] = 'Payfast merchant ID is required';
                }
                if (empty($config['merchant_key'])) {
                    $errors[] = 'Payfast merchant key is required';
                }
                break;
                
            case 'tap':
                if (empty($config['secret_key'])) {
                    $errors[] = 'Tap secret key is required';
                }
                break;
                
            case 'xendit':
                if (empty($config['api_key'])) {
                    $errors[] = 'Xendit api key is required';
                }
                break;
                
            case 'paytr':
                if (empty($config['merchant_id'])) {
                    $errors[] = 'PayTR merchant ID is required';
                }
                if (empty($config['merchant_key'])) {
                    $errors[] = 'PayTR merchant key is required';
                }
                if (empty($config['merchant_salt'])) {
                    $errors[] = 'PayTR merchant salt is required';
                }
                break;
                
            case 'mollie':
                if (empty($config['api_key'])) {
                    $errors[] = 'Mollie API key is required';
                }
                break;
                
            case 'toyyibpay':
                if (empty($config['category_code'])) {
                    $errors[] = 'toyyibPay category code is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'toyyibPay secret key is required';
                }
                break;
                
            case 'cashfree':
                if (empty($config['public_key'])) {
                    $errors[] = 'Cashfree App ID is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'Cashfree Secret Key is required';
                }
                break;
                
            case 'iyzipay':
                if (empty($config['public_key'])) {
                    $errors[] = 'Iyzipay API key is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'Iyzipay secret key is required';
                }
                break;
                
            case 'benefit':
                if (empty($config['public_key'])) {
                    $errors[] = 'Benefit API key is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'Benefit secret key is required';
                }
                break;
                
            case 'ozow':
                if (empty($config['site_key'])) {
                    $errors[] = 'Ozow site key is required';
                }
                if (empty($config['private_key'])) {
                    $errors[] = 'Ozow private key is required';
                }
                break;
                
            case 'easebuzz':
                if (empty($config['merchant_key'])) {
                    $errors[] = 'Easebuzz merchant key is required';
                }
                if (empty($config['salt_key'])) {
                    $errors[] = 'Easebuzz salt key is required';
                }
                break;
                
            case 'khalti':
                if (empty($config['public_key'])) {
                    $errors[] = 'Khalti public key is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'Khalti secret key is required';
                }
                break;
                
            case 'authorizenet':
                if (empty($config['merchant_id'])) {
                    $errors[] = 'AuthorizeNet merchant ID is required';
                }
                if (empty($config['transaction_key'])) {
                    $errors[] = 'AuthorizeNet transaction key is required';
                }
                break;
                
            case 'fedapay':
                if (empty($config['public_key'])) {
                    $errors[] = 'FedaPay public key is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'FedaPay secret key is required';
                }
                break;
                
            case 'payhere':
                if (empty($config['merchant_id'])) {
                    $errors[] = 'PayHere merchant ID is required';
                }
                if (empty($config['merchant_secret'])) {
                    $errors[] = 'PayHere merchant secret is required';
                }
                break;
                
            case 'cinetpay':
                if (empty($config['site_id'])) {
                    $errors[] = 'CinetPay site ID is required';
                }
                if (empty($config['api_key'])) {
                    $errors[] = 'CinetPay API key is required';
                }
                break;
                
            case 'paiement':
                if (empty($config['merchant_id'])) {
                    $errors[] = 'Paiement Pro merchant ID is required';
                }
                break;
                
            case 'nepalste':
                if (empty($config['public_key'])) {
                    $errors[] = 'Nepalste public key is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'Nepalste secret key is required';
                }
                break;
                
            case 'yookassa':
                if (empty($config['shop_id'])) {
                    $errors[] = 'YooKassa shop ID is required';
                }
                if (empty($config['secret_key'])) {
                    $errors[] = 'YooKassa secret key is required';
                }
                break;
                
            case 'midtrans':
                if (empty($config['secret_key'])) {
                    $errors[] = 'Midtrans secret key is required';
                }
                break;
                
            case 'aamarpay':
                if (empty($config['store_id'])) {
                    $errors[] = 'Aamarpay store ID is required';
                }
                if (empty($config['signature'])) {
                    $errors[] = 'Aamarpay signature is required';
                }
                break;
                            
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
}

if (! function_exists('calculatePlanPricing')) {
    function calculatePlanPricing($plan, $couponCode = null, $billingCycle = 'monthly')
    {
        $originalPrice = $plan->getPriceForCycle($billingCycle);
        $discountAmount = 0;
        $finalPrice = $originalPrice;
        $couponId = null;
        
        if ($couponCode) {
            $coupon = Coupon::where('code', $couponCode)
                ->where('status', 1)
                ->first();
            
            if ($coupon) {
                if ($coupon->type === 'percentage') {
                    $discountAmount = ($originalPrice * $coupon->discount_amount) / 100;
                } else {
                    $discountAmount = min($coupon->discount_amount, $originalPrice);
                }
                $finalPrice = max(0, $originalPrice - $discountAmount);
                $couponId = $coupon->id;
            }
        }
        
        return [
            'original_price' => $originalPrice,
            'discount_amount' => $discountAmount,
            'final_price' => $finalPrice,
            'coupon_id' => $couponId,
            'is_free' => $finalPrice <= 0
        ];
    }
}

if (! function_exists('createPlanOrder')) {
    function createPlanOrder($data)
    {
        $plan = Plan::findOrFail($data['plan_id']);
        $billingCycle = $data['billing_cycle'] ?? 'monthly';
        $pricing = calculatePlanPricing($plan, $data['coupon_code'] ?? null, $billingCycle);
        

        
        return PlanOrder::create([
            'user_id' => $data['user_id'],
            'plan_id' => $plan->id,
            'coupon_id' => $pricing['coupon_id'],
            'billing_cycle' => $billingCycle,
            'payment_method' => $data['payment_method'],
            'coupon_code' => $data['coupon_code'] ?? null,
            'original_price' => $pricing['original_price'],
            'discount_amount' => $pricing['discount_amount'],
            'final_price' => $pricing['final_price'],
            'payment_id' => $data['payment_id'],
            'status' => $data['status'] ?? 'pending',
            'ordered_at' => now(),
        ]);
    }
}

if (! function_exists('assignPlanToUser')) {
    function assignPlanToUser($user, $plan, $billingCycle)
    {
        $expiresAt = $billingCycle === 'yearly' ? now()->addYear() : now()->addMonth();
        
        \Log::info('Assigning plan ' . $plan->id . ' to user ' . $user->id . ' with billing cycle ' . $billingCycle);
        
        $updated = $user->update([
            'plan_id' => $plan->id,
            'plan_expire_date' => $expiresAt,
            'plan_is_active' => 1,
            'is_trial' => null,
            'trial_day' => 0,
            'trial_expire_date' => null,
        ]);
        
        \Log::info('Plan assignment result: ' . ($updated ? 'success' : 'failed'));
    }
}

if (! function_exists('processPaymentSuccess')) {
    function processPaymentSuccess($data)
    {
        $plan = Plan::findOrFail($data['plan_id']);
        $user = User::findOrFail($data['user_id']);
        
        $planOrder = createPlanOrder(array_merge($data, ['status' => 'approved']));
        assignPlanToUser($user, $plan, $data['billing_cycle']);
        
        // Verify the plan was assigned
        $user->refresh();
        
        // Create referral record if user was referred
        \App\Http\Controllers\ReferralController::createReferralRecord($user);
        
        return $planOrder;
    }
}

if (! function_exists('getPaymentGatewaySettings')) {
    function getPaymentGatewaySettings()
    {
        $superAdminId = User::where('type', 'superadmin')->first()?->id;
        
        return [
            'payment_settings' => PaymentSetting::getUserSettings($superAdminId),
            'general_settings' => Setting::getUserSettings($superAdminId),
            'super_admin_id' => $superAdminId
        ];
    }
}

if (! function_exists('validatePaymentRequest')) {
    function validatePaymentRequest($request, $additionalRules = [])
    {
        $baseRules = [
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
            'coupon_code' => 'nullable|string',
        ];
        
        $validated = $request->validate(array_merge($baseRules, $additionalRules));
        
        // Check if plan is free and handle it
        $plan = Plan::findOrFail($validated['plan_id']);
        $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null, $validated['billing_cycle']);
        

        
        return $validated;
    }
}

if (! function_exists('handlePaymentError')) {
    function handlePaymentError($e, $method = 'payment')
    {
        return back()->withErrors(['error' => __('Payment processing failed: :message', ['message' => $e->getMessage()])]);
    }
}

if (! function_exists('defaultSettings')) {
    /**
     * Get default settings for System, Brand, Storage, and Currency configurations
     *
     * @return array
     */
    function defaultSettings()
    {
        return [
            // System Settings
            'defaultLanguage' => 'en',
            'dateFormat' => 'Y-m-d',
            'timeFormat' => 'H:i',
            'calendarStartDay' => 'sunday',
            'defaultTimezone' => 'UTC',
            'emailVerification' => false,
            'landingPageEnabled' => false,
            'registrationEnabled' => false,
            
            // Brand Settings
            'logoDark' => 'images/logos/logo-dark.png',
            'logoLight' => 'images/logos/logo-light.png',
            'favicon' => 'images/logos/favicon.ico',
            'titleText' => 'vCard',
            'footerText' => '© 2025 vCard. All rights reserved.',
            'themeColor' => 'green',
            'customColor' => '#10b77f',
            'sidebarVariant' => 'inset',
            'sidebarStyle' => 'plain',
            'layoutDirection' => 'ltr',
            'themeMode' => 'light',
            
            // Storage Settings
            'storage_type' => 'local',
            'storage_file_types' => 'jpg,png,webp,gif,pdf,doc,docx,txt,csv',
            'storage_max_upload_size' => '2048',
            'aws_access_key_id' => '',
            'aws_secret_access_key' => '',
            'aws_default_region' => 'us-east-1',
            'aws_bucket' => '',
            'aws_url' => '',
            'aws_endpoint' => '',
            'wasabi_access_key' => '',
            'wasabi_secret_key' => '',
            'wasabi_region' => 'us-east-1',
            'wasabi_bucket' => '',
            'wasabi_url' => '',
            'wasabi_root' => '',
            
            // Currency Settings
            'decimalFormat' => '2',
            'defaultCurrency' => 'USD',
            'decimalSeparator' => '.',
            'thousandsSeparator' => ',',
            'floatNumber' => true,
            'currencySymbolSpace' => false,
            'currencySymbolPosition' => 'before',
            
            // Terms and Conditions
            'termsConditionsUrl' => '',
            
            // Business Directory
            'business_directory_enabled' => true,
        ];
    }
}

if (! function_exists('createDefaultSettings')) {
    /**
     * Create default settings for a user
     *
     * @param int $userId
     * @return void
     */
    function createDefaultSettings($userId)
    {
        $defaults = defaultSettings();
        $settingsData = [];
        
        foreach ($defaults as $key => $value) {
            $settingsData[] = [
                'user_id' => $userId,
                'key' => $key,
                'value' => is_bool($value) ? ($value ? '1' : '0') : (string)$value,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        Setting::insert($settingsData);
    }
}

if (! function_exists('copySettingsFromSuperAdmin')) {
    /**
     * Copy system and brand settings from superadmin to company user
     *
     * @param int $companyUserId
     * @return void
     */
    function copySettingsFromSuperAdmin($companyUserId)
    {
        $superAdmin = User::where('type', 'superadmin')->first();
        if (!$superAdmin) {
            createDefaultSettings($companyUserId);
            return;
        }
        
        // Settings to copy from superadmin (system and brand settings)
        $settingsToCopy = [
            'defaultLanguage', 'dateFormat', 'timeFormat', 'calendarStartDay', 
            'defaultTimezone', 'emailVerification', 'landingPageEnabled', 'registrationEnabled',
            'logoDark', 'logoLight', 'favicon', 'titleText', 'footerText',
            'themeColor', 'customColor', 'sidebarVariant', 'sidebarStyle',
            'layoutDirection', 'themeMode'
        ];
        
        $superAdminSettings = Setting::where('user_id', $superAdmin->id)
            ->whereIn('key', $settingsToCopy)
            ->get()
            ->keyBy('key');
        
        $settingsData = [];
        $defaultSettings = defaultSettings();
        
        // Copy all required settings, using superadmin values or defaults
        foreach ($settingsToCopy as $key) {
            $value = $superAdminSettings->has($key) 
                ? $superAdminSettings[$key]->value 
                : ($defaultSettings[$key] ?? null);


            // Special handling for defaultLanguage - ensure it uses super admin's current setting
            if ($key === 'defaultLanguage' && $superAdminSettings->has('defaultLanguage')) {
                $value = $superAdminSettings['defaultLanguage']->value;
            }
            
            if ($value !== null) {
                $settingsData[] = [
                    'user_id' => $companyUserId,
                    'key' => $key,
                    'value' => is_bool($value) ? ($value ? '1' : '0') : (string)$value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        if (!empty($settingsData)) {
            foreach ($settingsData as $setting) {
                Setting::updateOrCreate(
                    ['user_id' => $setting['user_id'], 'key' => $setting['key']],
                    ['value' => $setting['value'], 'updated_at' => $setting['updated_at']]
                );
            }
        }
        
        // Clear cached settings for the new user
        \Cache::forget('user_settings_' . $companyUserId);
    }
}

if (!function_exists('create_new_build')) {
    function create_new_build()
    {
        $projectRoot = realpath(__DIR__ . '/../../'); // adjust depending on your actual structure
        $vitePath = $projectRoot . '/vite.config.ts';
        if (file_exists($vitePath)) {
            chdir($projectRoot); // go to the correct project root before running npm
            exec('npm run build 2>&1', $output, $status);

            if ($status !== 0) {
                Log::error('Vite build failed', ['output' => $output]);
            } else {
                Log::info('Vite build succeeded', ['output' => $output]);
            }
        }
        
        return true;
    }
}

if (!function_exists('apiSuccess')) {
    function apiSuccess($message = 'Success', $data = null, $statusCode = 200)
    {
        $response = [
            'status' => 1,
            'message' => $message,
            'data' => $data ?? []
        ];
        
        return response()->json($response, $statusCode);
    }
}

if (!function_exists('apiError')) {
    function apiError($message = 'Error', $errors = null, $statusCode = 400)
    {
        $response = [
            'status' => 0,
            'message' => $message,
            'data' => $errors ?? []
        ];
        
        return response()->json($response, $statusCode);
    }
}

if (!function_exists('hasPermission')) {
    /**
     * Check if the current user has a specific permission
     *
     * @param string $permission
     * @param User|null $user
     * @return bool
     */
    function hasPermission($permission, $user = null)
    {
        $user = $user ?: auth()->user();
        
        if (!$user) {
            return false;
        }

        return $user->hasPermissionTo($permission);
    }
}

if (!function_exists('hasRole')) {
    /**
     * Check if the current user has a specific role
     *
     * @param string|array $role
     * @param User|null $user
     * @return bool
     */
    function hasRole($role, $user = null)
    {
        $user = $user ?: auth()->user();
        
        if (!$user) {
            return false;
        }

        return $user->hasRole($role);
    }
}

if (!function_exists('getUserPermissions')) {
    /**
     * Get all permissions for the current user
     *
     * @param User|null $user
     * @return array
     */
    function getUserPermissions($user = null)
    {
        $user = $user ?: auth()->user();
        
        if (!$user) {
            return [];
        }

        return $user->getAllPermissions()->pluck('name')->toArray();
    }
}

if (!function_exists('canAccess')) {
    /**
     * Check if user can access a specific module/feature
     *
     * @param string $module
     * @param string $action (view, create, edit, delete, manage)
     * @param User|null $user
     * @return bool
     */
    function canAccess($module, $action = 'view', $user = null)
    {
        $user = $user ?: auth()->user();
        
        if (!$user) {
            return false;
        }

        // Check for specific permission first
        $permission = "{$action}-{$module}";
        if ($user->hasPermissionTo($permission)) {
            return true;
        }

        // Check for manage permission as fallback
        $managePermission = "manage-{$module}";
        if ($user->hasPermissionTo($managePermission)) {
            return true;
        }

        return false;
    }
}

if (!function_exists('getImageUrlPrefix')) {
    function getImageUrlPrefix(): string
    {
        $storageType = getSetting('storage_type', 'local');

        switch ($storageType) {
            case 's3':
            case 'aws_s3':
                $url = getSetting('aws_url');
                if ($url) {
                    return rtrim($url, '/');
                }
                $endpoint = getSetting('aws_endpoint');
                if ($endpoint) {
                    return rtrim($endpoint, '/');
                }
                $bucket = getSetting('aws_bucket');
                $region = getSetting('aws_default_region', 'us-east-1');
                return "https://{$bucket}.s3.{$region}.amazonaws.com";

            case 'wasabi':
                $url = getSetting('wasabi_url');
                $bucket = getSetting('wasabi_bucket');
                if ($url) {
                    // Check if URL already includes bucket name
                    if ($bucket && !str_contains($url, $bucket)) {
                        return rtrim($url, '/') . '/' . $bucket;
                    }
                    return rtrim($url, '/');
                }
                $region = getSetting('wasabi_region', 'us-east-1');
                return "https://s3.{$region}.wasabisys.com/{$bucket}";
                
            case 'local':
            default:
                return url('');
        }
    }
}

if (!function_exists('stripStoragePrefix')) {
    /**
     * Strip storage type prefix from path (e.g., "aws_s3:media/file.jpg" -> "media/file.jpg")
     *
     * @param string $path
     * @return string
     */
    function stripStoragePrefix($path): string
    {
        if (!$path || !str_contains($path, ':')) {
            return $path;
        }
        
        return explode(':', $path, 2)[1];
    }
}

if (!function_exists('getAssetUrl')) {
    /**
     * Generate proper asset URL by stripping storage prefix and using correct base URL
     *
     * @param string $path
     * @return string
     */
    function getAssetUrl($path): string
    {
        if (!$path) {
            return '';
        }
        
        // If already a full URL, return as is
        if (str_starts_with($path, 'http')) {
            return $path;
        }
        
        // Strip storage prefix if present
        $cleanPath = stripStoragePrefix($path);
        
        // Handle default assets in public/images
        if (str_starts_with($cleanPath, 'images/')) {
            $storageType = getSetting('storage_type', 'local');
            if ($storageType == 'local') {
                if (file_exists($cleanPath)) {
                    return getImageUrlPrefix() . '/' . $cleanPath;
                } elseif (file_exists('storage/'.$cleanPath)) {
                    return getImageUrlPrefix() . '/storage/' . $cleanPath;
                } else {
                    return getImageUrlPrefix() . '/' . $cleanPath;
                }
            }
            return getImageUrlPrefix() . '/' . $cleanPath;
        }
        
        // Get storage type and construct URL accordingly
        $storageType = getSetting('storage_type', 'local');
        $imagePrefix = getImageUrlPrefix();
        
        if ($storageType === 'local') {
            return $imagePrefix . '/storage/' . ltrim($cleanPath, '/');
        } else {
            return $imagePrefix . '/' . ltrim($cleanPath, '/');
        }
    }
}
if (! function_exists('setEmailConfigurations')) {

    function setEmailConfigurations($userId = null): void
    {
        try {
            $settings = [
                'driver'      => getSetting('email_driver', 'smtp', $userId),
                'host'        => getSetting('email_host', 'smtp.example.com', $userId),
                'port'        => getSetting('email_port', '587', $userId),
                'username'    => getSetting('email_username', 'user@example.com', $userId),
                'encryption'  => getSetting('email_encryption', 'tls', $userId),
                'fromAddress' => getSetting('email_from_address', 'noreply@example.com', $userId),
                'fromName'    => getSetting('email_from_name', config('app.name'), $userId),
            ];

            $password = getSetting('email_password', '', $userId);

            config([
                'mail.default'                 => $settings['driver'],
                'mail.mailers.smtp.host'       => $settings['host'],
                'mail.mailers.smtp.port'       => $settings['port'],
                'mail.mailers.smtp.encryption' => $settings['encryption'] === 'none' ? null : $settings['encryption'],
                'mail.mailers.smtp.username'   => $settings['username'],
                'mail.mailers.smtp.password'   => $password,
                'mail.from.address'            => $settings['fromAddress'],
                'mail.from.name'               => $settings['fromName'],
            ]);
        } catch (\Exception $e) {
            throw new \Exception('Email config error: '.$e->getMessage());
        }
    }
}
