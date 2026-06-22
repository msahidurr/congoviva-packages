<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ChatGptController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmailTemplateController;
use App\Http\Controllers\FreePlanController;
use App\Http\Controllers\GoogleWalletController;
use App\Http\Controllers\Installer\RequirementsController;
use App\Http\Controllers\LandingPage\NewsletterController;
use App\Http\Controllers\ManualPaymentController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\PlanOrderController;
use App\Http\Controllers\PlanRequestController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\DomainRequestController;
use App\Http\Controllers\ReferralController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\NfcCardController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\CampaignsController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\ImpersonateController;
use App\Http\Controllers\TranslationController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\BusinessDirectoryController;
use App\Http\Controllers\BusinessDirectorySettingsController;
use App\Http\Controllers\BusinessDirectoryCustomPageController;
use App\Http\Controllers\LandingPage\CustomPageController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\RazorpayController;
use App\Http\Controllers\MercadoPagoController;
use App\Http\Controllers\StripePaymentController;
use App\Http\Controllers\PayPalPaymentController;
use App\Http\Controllers\BankPaymentController;
use App\Http\Controllers\PaystackPaymentController;
use App\Http\Controllers\FlutterwavePaymentController;
use App\Http\Controllers\PayTabsPaymentController;
use App\Http\Controllers\SkrillPaymentController;
use App\Http\Controllers\CoinGatePaymentController;
use App\Http\Controllers\PayfastPaymentController;
use App\Http\Controllers\TapPaymentController;
use App\Http\Controllers\XenditPaymentController;
use App\Http\Controllers\PayTRPaymentController;
use App\Http\Controllers\MolliePaymentController;
use App\Http\Controllers\ToyyibPayPaymentController;
use App\Http\Controllers\CashfreeController;
use App\Http\Controllers\IyzipayPaymentController;
use App\Http\Controllers\BenefitPaymentController;
use App\Http\Controllers\OzowPaymentController;
use App\Http\Controllers\EasebuzzPaymentController;
use App\Http\Controllers\KhaltiPaymentController;
use App\Http\Controllers\AuthorizeNetPaymentController;
use App\Http\Controllers\FedaPayPaymentController;
use App\Http\Controllers\PayHerePaymentController;
use App\Http\Controllers\CinetPayPaymentController;
use App\Http\Controllers\PaiementPaymentController;
use App\Http\Controllers\NepalstePaymentController;
use App\Http\Controllers\YooKassaPaymentController;
use App\Http\Controllers\AamarpayPaymentController;
use App\Http\Controllers\MidtransPaymentController;
use App\Http\Controllers\VCardBuilderController;
use App\Http\Controllers\PublicVCardController;
use App\Http\Controllers\PublicFormController;
use App\Http\Controllers\AddonController;
use App\Http\Controllers\BroadcastEmailController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [LandingPageController::class, 'show'])->name('home');

// Custom installer route overrides
Route::get('install/requirements', [RequirementsController::class, 'requirements'])
    ->middleware(['web', 'install'])
    ->name('LaravelInstaller::requirements');

Route::get('install/database', [\App\Http\Controllers\Installer\DatabaseController::class, 'database'])
    ->middleware(['web', 'install'])
    ->name('LaravelInstaller::database');

Route::post('install/run-migration', [\App\Http\Controllers\Installer\DatabaseController::class, 'runMigration'])
    ->middleware(['web', 'install'])
    ->name('LaravelInstaller::runMigration');



// Public form submission routes
Route::post('/customer/contact', [PublicFormController::class, 'storeContact'])->name('public.contact.store');
Route::post('/customer/appointment', [PublicFormController::class, 'storeAppointment'])->name('public.appointment.store');
Route::post('/customer/verify-password', [PublicVCardController::class, 'verifyPassword'])->name('public.vcard.verify-password');
Route::post('/customer/verify-biolink-password', [PublicVCardController::class, 'verifyBioLinkPassword'])->name('public.biolink.verify-password');
Route::post('/check-domain', [VCardBuilderController::class, 'checkDomain'])->name('check-domain');

// Cashfree webhook (public route)
Route::post('cashfree/webhook', [CashfreeController::class, 'webhook'])->name('cashfree.webhook');

// Benefit webhook (public route)
Route::post('benefit/webhook', [BenefitPaymentController::class, 'webhook'])->name('benefit.webhook');
Route::get('payments/benefit/success', [BenefitPaymentController::class, 'success'])->name('benefit.success');
Route::post('payments/benefit/callback', [BenefitPaymentController::class, 'callback'])->name('benefit.callback');

// FedaPay callback (public route)
Route::match(['GET', 'POST'], 'payments/fedapay/callback', [FedaPayPaymentController::class, 'callback'])->name('fedapay.callback');

// YooKassa success/callback (public routes)
Route::get('payments/yookassa/success', [YooKassaPaymentController::class, 'success'])->name('yookassa.success');
Route::post('payments/yookassa/callback', [YooKassaPaymentController::class, 'callback'])->name('yookassa.callback');

// Nepalste success/callback (public routes)
Route::get('payments/nepalste/success', [NepalstePaymentController::class, 'success'])->name('nepalste.success');
Route::post('payments/nepalste/callback', [NepalstePaymentController::class, 'callback'])->name('nepalste.callback');

// PayTR callback (public route)
Route::post('payments/paytr/callback', [PayTRPaymentController::class, 'callback'])->name('paytr.callback');

// PayTabs callback (public route)
Route::match(['GET', 'POST'], 'payments/paytabs/callback', [PayTabsPaymentController::class, 'callback'])->name('paytabs.callback');
Route::get('payments/paytabs/success', [PayTabsPaymentController::class, 'success'])->name('paytabs.success');

// Tap payment routes (public routes)
Route::get('payments/tap/success', [TapPaymentController::class, 'success'])->name('tap.success');
Route::post('payments/tap/callback', [TapPaymentController::class, 'callback'])->name('tap.callback');

// Aamarpay payment routes (public routes)
Route::match(['GET', 'POST'], 'payments/aamarpay/success', [AamarpayPaymentController::class, 'success'])->name('aamarpay.success');
Route::post('payments/aamarpay/callback', [AamarpayPaymentController::class, 'callback'])->name('aamarpay.callback');

// PayFast payment routes (public routes)
Route::get('payments/payfast/success', [PayfastPaymentController::class, 'success'])->name('payfast.success');
Route::post('payments/payfast/callback', [PayfastPaymentController::class, 'callback'])->name('payfast.callback');

// CoinGate callback (public route)
Route::match(['GET', 'POST'], 'payments/coingate/callback', [CoinGatePaymentController::class, 'callback'])->name('coingate.callback');

// Xendit payment routes (public routes)
Route::get('payments/xendit/success', [XenditPaymentController::class, 'success'])->name('xendit.success');
Route::post('payments/xendit/callback', [XenditPaymentController::class, 'callback'])->name('xendit.callback');

// PWA Manifest routes - Must be before other catch-all routes
Route::get('/manifest.json', [PublicVCardController::class, 'manifest'])->name('public.vcard.manifest.root');
Route::get('/{slug}/manifest.json', [PublicVCardController::class, 'manifest'])
    ->where('slug', '[a-zA-Z0-9-_]+')
    ->name('public.vcard.manifest.direct');
Route::get('/{prefix}/{slug}/manifest.json', [PublicVCardController::class, 'manifest'])
    ->where(['prefix' => '[a-zA-Z0-9-_]+', 'slug' => '[a-zA-Z0-9-_]+'])
    ->name('public.vcard.manifest');

// Service Worker route
Route::get('/sw.js', [PublicVCardController::class, 'serviceWorker'])->name('public.service.worker');

// Favicon generation route
Route::get('/favicon/{size}', [PublicVCardController::class, 'generateFavicon'])
    ->where('size', '[0-9]+')
    ->name('favicon.generate');

Route::get('/landing-page', [LandingPageController::class, 'settings'])->name('landing-page');
Route::post('/landing-page/contact', [LandingPageController::class, 'submitContact'])->name('landing-page.contact');
// Landing Page Contacts routes
Route::get('landing-pages/contacts', [\App\Http\Controllers\LandingPage\ContactController::class, 'index'])->name('landing-page.contacts.index');
Route::post('landing-page/contacts/{contact}/reply', [\App\Http\Controllers\LandingPage\ContactController::class, 'reply'])->name('landing-page.contacts.reply');
Route::post('/landing-page/contacts', [\App\Http\Controllers\LandingPage\ContactController::class, 'store'])->name('landing-page.contacts.store');
Route::put('/landing-page/contacts/{contact}', [\App\Http\Controllers\LandingPage\ContactController::class, 'update'])->name('landing-page.contacts.update');
Route::delete('/landing-page/contacts/{contact}', [\App\Http\Controllers\LandingPage\ContactController::class, 'destroy'])->name('landing-page.contacts.destroy');
Route::post('/landing-page/subscribe', [LandingPageController::class, 'subscribe'])->name('landing-page.subscribe');

Route::get('/page/{slug}', [CustomPageController::class, 'show'])->name('custom-page.show');

Route::get('/translations/{locale}', [TranslationController::class, 'getTranslations'])->name('translations');
Route::get('/refresh-language/{locale}', [TranslationController::class, 'refreshLanguage'])->name('refresh-language');
Route::get('/initial-locale', [TranslationController::class, 'getInitialLocale'])->name('initial-locale');

// Business Directory routes
Route::get('/templates', [LandingPageController::class, 'templates'])->name('template.index');

// Business Directory routes
Route::get('/business-directory', [BusinessDirectoryController::class, 'index'])->name('directory.index');

// Business Directory Settings routes (Super Admin only) - Must be before parameterized routes
Route::middleware(['auth', 'App\Http\Middleware\SuperAdminMiddleware'])->group(function () {
    Route::get('directory/settings', [BusinessDirectorySettingsController::class, 'index'])->name('directory.settings');
    Route::post('directory/settings', [BusinessDirectorySettingsController::class, 'update'])->name('directory.settings.update');
    
    // Business Directory global toggle (super admin only)
    Route::post('directory/toggle-global', [BusinessDirectorySettingsController::class, 'toggleGlobal'])->name('directory.toggle-global');
});

Route::get('/directory/{business}', [BusinessDirectoryController::class, 'show'])->name('directory.show');

// Email Templates routes (no middleware for testing)
Route::get('email-templates', [EmailTemplateController::class, 'index'])->name('email-templates.index');
Route::get('email-templates/{emailTemplate}', [EmailTemplateController::class, 'show'])->name('email-templates.show');
Route::put('email-templates/{emailTemplate}/settings', [EmailTemplateController::class, 'updateSettings'])->name('email-templates.update-settings');
Route::put('email-templates/{emailTemplate}/content', [EmailTemplateController::class, 'updateContent'])->name('email-templates.update-content');

Route::middleware(['auth', 'verified','setting'])->group(function () {
    // Plans routes - accessible without plan check
    Route::get('plans', [PlanController::class, 'index'])->name('plans.index');
    Route::post('plans/request', [PlanController::class, 'requestPlan'])->name('plans.request');
    Route::post('plans/cancel-request', [PlanController::class, 'cancelRequest'])->name('plans.cancel-request');
    Route::post('plans/trial', [PlanController::class, 'startTrial'])->name('plans.trial');
    Route::post('plans/subscribe', [PlanController::class, 'subscribe'])->name('plans.subscribe');
    Route::post('plans/coupons/validate', [CouponController::class, 'validate'])->name('coupons.validate');
    
    // Payment routes - accessible without plan check
    Route::post('payments/stripe', [StripePaymentController::class, 'processPayment'])->name('stripe.payment');
    Route::post('payments/paypal', [PayPalPaymentController::class, 'processPayment'])->name('paypal.payment');
    Route::post('payments/bank', [BankPaymentController::class, 'processPayment'])->name('bank.payment');
    Route::post('payments/paystack', [PaystackPaymentController::class, 'processPayment'])->name('paystack.payment');
    Route::post('payments/flutterwave', [FlutterwavePaymentController::class, 'processPayment'])->name('flutterwave.payment');
    Route::post('payments/paytabs', [PayTabsPaymentController::class, 'processPayment'])->name('paytabs.payment');
    Route::post('payments/skrill', [SkrillPaymentController::class, 'processPayment'])->name('skrill.payment');
    Route::post('payments/coingate', [CoinGatePaymentController::class, 'processPayment'])->name('coingate.payment');
    Route::post('payments/payfast', [PayfastPaymentController::class, 'processPayment'])->name('payfast.payment');
    Route::post('payments/mollie', [MolliePaymentController::class, 'processPayment'])->name('mollie.payment');
    Route::post('payments/toyyibpay', [ToyyibPayPaymentController::class, 'processPayment'])->name('toyyibpay.payment');
    Route::post('payments/iyzipay', [IyzipayPaymentController::class, 'processPayment'])->name('iyzipay.payment');
    Route::post('payments/benefit', [BenefitPaymentController::class, 'processPayment'])->name('benefit.payment');
    Route::post('payments/ozow', [OzowPaymentController::class, 'processPayment'])->name('ozow.payment');
    Route::post('payments/easebuzz', [EasebuzzPaymentController::class, 'processPayment'])->name('easebuzz.payment');
    Route::post('payments/khalti', [KhaltiPaymentController::class, 'processPayment'])->name('khalti.payment');
    Route::post('payments/authorizenet', [AuthorizeNetPaymentController::class, 'processPayment'])->name('authorizenet.payment');
    Route::post('payments/fedapay', [FedaPayPaymentController::class, 'processPayment'])->name('fedapay.payment');
    Route::post('payments/payhere', [PayHerePaymentController::class, 'processPayment'])->name('payhere.payment');
    Route::post('payments/cinetpay', [CinetPayPaymentController::class, 'processPayment'])->name('cinetpay.payment');
    Route::post('payments/paiement', [PaiementPaymentController::class, 'processPayment'])->name('paiement.payment');
    Route::post('payments/nepalste', [NepalstePaymentController::class, 'processPayment'])->name('nepalste.payment');
    Route::post('payments/yookassa', [YooKassaPaymentController::class, 'processPayment'])->name('yookassa.payment');
    Route::post('payments/aamarpay', [AamarpayPaymentController::class, 'processPayment'])->name('aamarpay.payment');
    Route::post('payments/midtrans', [MidtransPaymentController::class, 'processPayment'])->name('midtrans.payment');

    
    // Manual payment routes
    Route::post('payments/manual', [ManualPaymentController::class, 'processPayment'])->name('manual.payment');
    
    // Free plan routes
    Route::post('free-plan/subscribe', [FreePlanController::class, 'subscribe'])->name('free-plan.subscribe');
    
    // Payment gateway specific routes
    Route::post('razorpay/create-order', [RazorpayController::class, 'createOrder'])->name('razorpay.create-order');
    Route::post('razorpay/verify-payment', [RazorpayController::class, 'verifyPayment'])->name('razorpay.verify-payment');
    Route::post('cashfree/create-session', [CashfreeController::class, 'createPaymentSession'])->name('cashfree.create-session');
    Route::post('cashfree/verify-payment', [CashfreeController::class, 'verifyPayment'])->name('cashfree.verify-payment');
    Route::post('mercadopago/create-preference', [MercadoPagoController::class, 'createPreference'])->name('mercadopago.create-preference');
    Route::post('mercadopago/process-payment', [MercadoPagoController::class, 'processPayment'])->name('mercadopago.process-payment');
    
    // Other payment creation routes
    Route::post('tap/create-payment', [TapPaymentController::class, 'createPayment'])->name('tap.create-payment');
    Route::post('xendit/create-payment', [XenditPaymentController::class, 'createPayment'])->name('xendit.create-payment');
    Route::post('payments/paytr/create-token', [PayTRPaymentController::class, 'createPaymentToken'])->name('paytr.create-token');
    Route::post('iyzipay/create-form', [IyzipayPaymentController::class, 'createPaymentForm'])->name('iyzipay.create-form');
    Route::post('benefit/create-session', [BenefitPaymentController::class, 'createPaymentSession'])->name('benefit.create-session');
    Route::post('ozow/create-payment', [OzowPaymentController::class, 'createPayment'])->name('ozow.create-payment');
    Route::post('easebuzz/create-payment', [EasebuzzPaymentController::class, 'createPayment'])->name('easebuzz.create-payment');
    Route::post('khalti/create-payment', [KhaltiPaymentController::class, 'createPayment'])->name('khalti.create-payment');
    Route::post('authorizenet/create-form', [AuthorizeNetPaymentController::class, 'createPaymentForm'])->name('authorizenet.create-form');
    Route::post('fedapay/create-payment', [FedaPayPaymentController::class, 'createPayment'])->name('fedapay.create-payment');
    Route::post('payhere/create-payment', [PayHerePaymentController::class, 'createPayment'])->name('payhere.create-payment');
    Route::post('cinetpay/create-payment', [CinetPayPaymentController::class, 'createPayment'])->name('cinetpay.create-payment');
    Route::post('paiement/create-payment', [PaiementPaymentController::class, 'createPayment'])->name('paiement.create-payment');
    Route::post('nepalste/create-payment', [NepalstePaymentController::class, 'createPayment'])->name('nepalste.create-payment');
    Route::post('yookassa/create-payment', [YooKassaPaymentController::class, 'createPayment'])->name('yookassa.create-payment');
    Route::post('aamarpay/create-payment', [AamarpayPaymentController::class, 'createPayment'])->name('aamarpay.create-payment');
    Route::post('midtrans/create-payment', [MidtransPaymentController::class, 'createPayment'])->name('midtrans.create-payment');

    
    // Payment success/callback routes
    Route::post('payments/skrill/callback', [SkrillPaymentController::class, 'callback'])->name('skrill.callback');
    Route::get('payments/paytr/success', [PayTRPaymentController::class, 'success'])->name('paytr.success');
    Route::get('payments/paytr/failure', [PayTRPaymentController::class, 'failure'])->name('paytr.failure');
    Route::get('payments/mollie/success', [MolliePaymentController::class, 'success'])->name('mollie.success');
    Route::post('payments/mollie/callback', [MolliePaymentController::class, 'callback'])->name('mollie.callback');
    Route::match(['GET', 'POST'], 'payments/toyyibpay/success', [ToyyibPayPaymentController::class, 'success'])->name('toyyibpay.success');
    Route::post('payments/toyyibpay/callback', [ToyyibPayPaymentController::class, 'callback'])->name('toyyibpay.callback');
    Route::post('payments/iyzipay/callback', [IyzipayPaymentController::class, 'callback'])->name('iyzipay.callback');
    Route::get('payments/ozow/success', [OzowPaymentController::class, 'success'])->name('ozow.success');
    Route::post('payments/ozow/callback', [OzowPaymentController::class, 'callback'])->name('ozow.callback');
    Route::get('payments/payhere/success', [PayHerePaymentController::class, 'success'])->name('payhere.success');
    Route::post('payments/payhere/callback', [PayHerePaymentController::class, 'callback'])->name('payhere.callback');
    Route::get('payments/cinetpay/success', [CinetPayPaymentController::class, 'success'])->name('cinetpay.success');
    Route::post('payments/cinetpay/callback', [CinetPayPaymentController::class, 'callback'])->name('cinetpay.callback');
    Route::get('payments/paiement/success', [PaiementPaymentController::class, 'success'])->name('paiement.success');
    Route::post('payments/paiement/callback', [PaiementPaymentController::class, 'callback'])->name('paiement.callback');
    Route::post('payments/midtrans/callback', [MidtransPaymentController::class, 'callback'])->name('midtrans.callback');

    Route::get('mercadopago/success', [MercadoPagoController::class, 'success'])->name('mercadopago.success');
    Route::get('mercadopago/failure', [MercadoPagoController::class, 'failure'])->name('mercadopago.failure');
    Route::get('mercadopago/pending', [MercadoPagoController::class, 'pending'])->name('mercadopago.pending');
    Route::post('mercadopago/webhook', [MercadoPagoController::class, 'webhook'])->name('mercadopago.webhook');
    Route::post('authorizenet/test-connection', [AuthorizeNetPaymentController::class, 'testConnection'])->name('authorizenet.test-connection');

    // Dashboard redirect route - accessible without plan check for login flow
    Route::get('dashboard/redirect', [DashboardController::class, 'redirectToFirstAvailablePage'])->name('dashboard.redirect');
    
    // All other routes require plan access check
    Route::middleware('plan.access')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
        // Analytics routes
        Route::get('analytics', [AnalyticsController::class, 'index'])->middleware('permission:manage-analytics')->name('analytics');
        Route::get('visitor-analytics', [AnalyticsController::class, 'index'])->middleware('permission:manage-analytics')->name('company.analytics');
        Route::get('analytics/realtime', [AnalyticsController::class, 'realtime'])->middleware('permission:manage-analytics')->name('analytics.realtime');
        Route::get('dashboard/export-report', [AnalyticsController::class, 'exportReport'])->name('dashboard.export-report');
        
        Route::get('media-library', function () {
            return Inertia::render('media-library');
        })->name('media-library');
        
    

    // Media Library API routes
    Route::get('media', [MediaController::class, 'index'])->middleware('permission:manage-media')->name('media.index');
    Route::post('media/batch', [MediaController::class, 'batchStore'])->middleware('permission:create-media')->name('media.batch');
    Route::get('media/{id}/download', [MediaController::class, 'download'])->middleware('permission:download-media')->name('media.download');
    Route::delete('media/{id}', [MediaController::class, 'destroy'])->middleware('permission:delete-media')->name('media.destroy');
    
    // File upload route for brand assets
    Route::post('upload/brand-asset', [MediaController::class, 'uploadBrandAsset'])->name('upload.brand-asset');

        // Permissions routes with granular permissions
        Route::middleware('permission:manage-permissions')->group(function () {
            Route::get('permissions', [PermissionController::class, 'index'])->middleware('permission:manage-permissions')->name('permissions.index');
            Route::get('permissions/create', [PermissionController::class, 'create'])->middleware('permission:create-permissions')->name('permissions.create');
            Route::post('permissions', [PermissionController::class, 'store'])->middleware('permission:create-permissions')->name('permissions.store');
            Route::get('permissions/{permission}', [PermissionController::class, 'show'])->middleware('permission:view-permissions')->name('permissions.show');
            Route::get('permissions/{permission}/edit', [PermissionController::class, 'edit'])->middleware('permission:edit-permissions')->name('permissions.edit');
            Route::put('permissions/{permission}', [PermissionController::class, 'update'])->middleware('permission:edit-permissions')->name('permissions.update');
            Route::patch('permissions/{permission}', [PermissionController::class, 'update'])->middleware('permission:edit-permissions');
            Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->middleware('permission:delete-permissions')->name('permissions.destroy');
        });

        // Roles routes with granular permissions
        Route::middleware('permission:manage-roles')->group(function () {
            Route::get('roles', [RoleController::class, 'index'])->middleware('permission:manage-roles')->name('roles.index');
            Route::get('roles/create', [RoleController::class, 'create'])->middleware('permission:create-roles')->name('roles.create');
            Route::post('roles', [RoleController::class, 'store'])->middleware('permission:create-roles')->name('roles.store');
            Route::get('roles/{role}', [RoleController::class, 'show'])->middleware('permission:view-roles')->name('roles.show');
            Route::get('roles/{role}/edit', [RoleController::class, 'edit'])->middleware('permission:edit-roles')->name('roles.edit');
            Route::put('roles/{role}', [RoleController::class, 'update'])->middleware('permission:edit-roles')->name('roles.update');
            Route::patch('roles/{role}', [RoleController::class, 'update'])->middleware('permission:edit-roles');
            Route::delete('roles/{role}', [RoleController::class, 'destroy'])->middleware('permission:delete-roles')->name('roles.destroy');
        });

        // Users routes with granular permissions
        Route::middleware('permission:manage-users')->group(function () {
            Route::get('users', [UserController::class, 'index'])->middleware('permission:manage-users')->name('users.index');
            Route::get('users/create', [UserController::class, 'create'])->middleware('permission:create-users')->name('users.create');
            Route::post('users', [UserController::class, 'store'])->middleware('permission:create-users')->name('users.store');
            Route::get('users/{user}', [UserController::class, 'show'])->middleware('permission:view-users')->name('users.show');
            Route::get('users/{user}/edit', [UserController::class, 'edit'])->middleware('permission:edit-users')->name('users.edit');
            Route::put('users/{user}', [UserController::class, 'update'])->middleware('permission:edit-users')->name('users.update');
            Route::patch('users/{user}', [UserController::class, 'update'])->middleware('permission:edit-users');
            Route::delete('users/{user}', [UserController::class, 'destroy'])->middleware('permission:delete-users')->name('users.destroy');

            // Additional user routes
            Route::put('users/{user}/reset-password', [UserController::class, 'resetPassword'])->middleware('permission:reset-password-users')->name('users.reset-password');
            Route::put('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->middleware('permission:toggle-status-users')->name('users.toggle-status');
        });

        // Plans management routes (admin only)
        Route::middleware('permission:manage-plans')->group(function () {
            Route::get('plans/create', [PlanController::class, 'create'])->middleware('permission:create-plans')->name('plans.create');
            Route::post('plans', [PlanController::class, 'store'])->middleware('permission:create-plans')->name('plans.store');
            Route::get('plans/{plan}/edit', [PlanController::class, 'edit'])->middleware('permission:edit-plans')->name('plans.edit');
            Route::put('plans/{plan}', [PlanController::class, 'update'])->middleware('permission:edit-plans')->name('plans.update');
            Route::delete('plans/{plan}', [PlanController::class, 'destroy'])->middleware('permission:delete-plans')->name('plans.destroy');
            Route::post('plans/{plan}/toggle-status', [PlanController::class, 'toggleStatus'])->name('plans.toggle-status');
        });

        // Plan Orders routes
        Route::middleware('permission:manage-plan-orders')->group(function () {
            Route::get('plan-orders', [PlanOrderController::class, 'index'])->middleware('permission:manage-plan-orders')->name('plan-orders.index');
            Route::post('plan-orders/{planOrder}/approve', [PlanOrderController::class, 'approve'])->middleware('permission:approve-plan-orders')->name('plan-orders.approve');
            Route::post('plan-orders/{planOrder}/reject', [PlanOrderController::class, 'reject'])->middleware('permission:reject-plan-orders')->name('plan-orders.reject');
        });


        // Companies routes
        Route::middleware('permission:manage-companies')->group(function () {
            Route::get('companies', [CompanyController::class, 'index'])->middleware('permission:manage-companies')->name('companies.index');
            Route::post('companies', [CompanyController::class, 'store'])->middleware('permission:create-companies')->name('companies.store');
            Route::put('companies/{company}', [CompanyController::class, 'update'])->middleware('permission:edit-companies')->name('companies.update');
            Route::delete('companies/{company}', [CompanyController::class, 'destroy'])->middleware('permission:delete-companies')->name('companies.destroy');
            Route::put('companies/{company}/reset-password', [CompanyController::class, 'resetPassword'])->middleware('permission:reset-password-companies')->name('companies.reset-password');
            Route::put('companies/{company}/toggle-status', [CompanyController::class, 'toggleStatus'])->middleware('permission:toggle-status-companies')->name('companies.toggle-status');
            Route::get('companies/{company}/plans', [CompanyController::class, 'getPlans'])->middleware('permission:manage-plans-companies')->name('companies.plans');
            Route::put('companies/{company}/upgrade-plan', [CompanyController::class, 'upgradePlan'])->middleware('permission:upgrade-plan-companies')->name('companies.upgrade-plan');
            Route::get('companies/{company}/business-links', [CompanyController::class, 'getBusinessLinks'])->middleware('permission:manage-companies')->name('companies.business-links');
        });

        // Contacts routes
        Route::middleware('permission:manage-contacts')->group(function () {
            Route::get('contacts', [ContactController::class, 'index'])->middleware('permission:manage-contacts')->name('contacts.index');
            Route::post('contacts', [ContactController::class, 'store'])->middleware('permission:create-contacts')->name('contacts.store');
            Route::put('contacts/{contact}', [ContactController::class, 'update'])->middleware('permission:edit-contacts')->name('contacts.update');
            Route::post('contacts/{contact}/reply', [ContactController::class, 'reply'])->middleware('permission:reply-contacts')->name('contacts.reply');
            Route::delete('contacts/{contact}', [ContactController::class, 'destroy'])->middleware('permission:delete-contacts')->name('contacts.destroy');
        });

        // Appointments routes
        Route::middleware('permission:manage-appointments')->group(function () {
            Route::get('appointments', [AppointmentController::class, 'index'])->middleware('permission:manage-appointments')->name('appointments.index');
            Route::post('appointments', [AppointmentController::class, 'store'])->middleware('permission:create-appointments')->name('appointments.store');
            Route::put('appointments/{appointment}', [AppointmentController::class, 'update'])->middleware('permission:edit-appointments')->name('appointments.update');
            Route::post('appointments/{appointment}/reply', [AppointmentController::class, 'reply'])->middleware('permission:reply-appointments')->name('appointments.reply');
            Route::delete('appointments/{appointment}', [AppointmentController::class, 'destroy'])->middleware('permission:delete-appointments')->name('appointments.destroy');
        });

        // Calendar routes
        Route::middleware('permission:manage-calendar')->group(function () {
            Route::get('calendar', [AppointmentController::class, 'calendar'])->middleware('permission:manage-calendar')->name('calendar.index');
        });

        // NFC Cards routes
        Route::middleware('permission:manage-nfc-cards')->group(function () {
            Route::get('nfc-cards', [NfcCardController::class, 'index'])->middleware('permission:manage-nfc-cards')->name('nfc-cards.index');
            Route::post('nfc-cards/order-request', [NfcCardController::class, 'orderRequest'])->middleware('permission:create-nfc-card-order-requests')->name('nfc-cards.order-request');
            Route::post('nfc-cards', [NfcCardController::class, 'store'])->middleware('permission:create-nfc-cards')->name('nfc-cards.store');
            Route::put('nfc-cards/{nfcCard}', [NfcCardController::class, 'update'])->middleware('permission:edit-nfc-cards')->name('nfc-cards.update');
            Route::delete('nfc-cards/{nfcCard}', [NfcCardController::class, 'destroy'])->middleware('permission:delete-nfc-cards')->name('nfc-cards.destroy');
            Route::put('nfc-cards/{nfcCard}/toggle-status', [NfcCardController::class, 'toggleStatus'])->middleware('permission:toggle-status-nfc-cards')->name('nfc-cards.toggle-status');
        });
        
        // NFC Card global toggle (super admin only)
        Route::post('nfc-cards/toggle-global', [NfcCardController::class, 'toggleGlobal'])->middleware('App\Http\Middleware\SuperAdminMiddleware')->name('nfc-cards.toggle-global');

        Route::middleware('permission:order-nfc-cards')->group(function () {
            Route::get('nfc-cards-request', [NfcCardController::class, 'orderRequests'])->middleware('permission:order-nfc-cards')->name('nfc-cards.order-requests');
            Route::post('nfc-cards/order-requests/{orderRequest}/approve', [NfcCardController::class, 'approveOrderRequest'])->middleware('permission:approve-nfc-card-order-requests')->name('nfc-cards.approve-order');
            Route::post('nfc-cards/order-requests/{orderRequest}/reject', [NfcCardController::class, 'rejectOrderRequest'])->middleware('permission:reject-nfc-card-order-requests')->name('nfc-cards.reject-order');
            Route::delete('nfc-cards/order-requests/{orderRequest}', [NfcCardController::class, 'destroyOrderRequest'])->middleware('permission:delete-nfc-card-order-requests')->name('nfc-cards.order-requests.destroy');
        });


        // Coupons routes
        Route::middleware('permission:manage-coupons')->group(function () {
            Route::get('coupons', [CouponController::class, 'index'])->middleware('permission:manage-coupons')->name('coupons.index');
            Route::get('coupons/{coupon}', [CouponController::class, 'show'])->middleware('permission:view-coupons')->name('coupons.show');
            Route::post('coupons', [CouponController::class, 'store'])->middleware('permission:create-coupons')->name('coupons.store');
            Route::put('coupons/{coupon}', [CouponController::class, 'update'])->middleware('permission:edit-coupons')->name('coupons.update');
            Route::put('coupons/{coupon}/toggle-status', [CouponController::class, 'toggleStatus'])->middleware('permission:toggle-status-coupons')->name('coupons.toggle-status');
            Route::delete('coupons/{coupon}', [CouponController::class, 'destroy'])->middleware('permission:delete-coupons')->name('coupons.destroy');
        });

        // Plan Requests routes
        Route::middleware('permission:manage-plan-requests')->group(function () {
            Route::get('plan-requests', [PlanRequestController::class, 'index'])->middleware('permission:manage-plan-requests')->name('plan-requests.index');
            Route::post('plan-requests/{planRequest}/approve', [PlanRequestController::class, 'approve'])->middleware('permission:approve-plan-requests')->name('plan-requests.approve');
            Route::post('plan-requests/{planRequest}/reject', [PlanRequestController::class, 'reject'])->middleware('permission:reject-plan-requests')->name('plan-requests.reject');
            Route::delete('plan-requests/{planRequest}', [PlanRequestController::class, 'destroy'])->middleware('permission:delete-plan-requests')->name('plan-requests.destroy');
        });

        // Domain Requests routes
        Route::middleware('permission:manage-domain-requests')->group(function () {
            Route::get('domain-requests', [DomainRequestController::class, 'index'])->middleware('permission:manage-domain-requests')->name('domain-requests.index');
            Route::post('domain-requests/{domainRequest}/approve', [DomainRequestController::class, 'approve'])->middleware('permission:approve-domain-requests')->name('domain-requests.approve');
            Route::post('domain-requests/{domainRequest}/reject', [DomainRequestController::class, 'reject'])->middleware('permission:reject-domain-requests')->name('domain-requests.reject');
            Route::delete('domain-requests/{domainRequest}', [DomainRequestController::class, 'destroy'])->middleware('permission:delete-domain-requests')->name('domain-requests.destroy');
        });

        // Referral routes
        Route::middleware('permission:manage-referral')->group(function () {
            Route::get('referral', [ReferralController::class, 'index'])->middleware('permission:manage-referral')->name('referral.index');
            Route::get('referral/referred-users', [ReferralController::class, 'getReferredUsers'])->middleware('permission:manage-users-referral')->name('referral.referred-users');
            Route::post('referral/settings', [ReferralController::class, 'updateSettings'])->middleware('permission:manage-setting-referral')->name('referral.settings.update');
            Route::post('referral/payout-request', [ReferralController::class, 'createPayoutRequest'])->name('referral.payout-request.create');
            Route::post('referral/payout-request/{payoutRequest}/approve', [ReferralController::class, 'approvePayoutRequest'])->middleware('permission:approve-payout-referral')->name('referral.payout-request.approve');
            Route::post('referral/payout-request/{payoutRequest}/reject', [ReferralController::class, 'rejectPayoutRequest'])->middleware('permission:reject-payout-referral')->name('referral.payout-request.reject');
        });

        // Campaigns routes
        Route::middleware('permission:manage-campaigns')->group(function () {
            Route::get('campaigns', [CampaignsController::class, 'index'])->middleware('permission:manage-campaigns')->name('campaigns.index');
            Route::post('campaigns', [CampaignsController::class, 'store'])->middleware('permission:create-campaigns')->name('campaigns.store');
            Route::put('campaigns/{campaign}', [CampaignsController::class, 'update'])->middleware('permission:edit-campaigns')->name('campaigns.update');
            Route::delete('campaigns/{campaign}', [CampaignsController::class, 'destroy'])->middleware('permission:delete-campaigns')->name('campaigns.destroy');
            Route::put('campaigns/{campaign}/toggle-status', [CampaignsController::class, 'toggleStatus'])->middleware('permission:toggle-status-campaigns')->name('campaigns.toggle-status');
            Route::put('campaigns/{campaign}/activate', [CampaignsController::class, 'activate'])->middleware('permission:edit-campaigns')->name('campaigns.activate');
            Route::get('campaigns/{campaign}/analytics', [CampaignsController::class, 'analytics'])->middleware('permission:analytics-campaigns')->name('campaigns.analytics');
        });
        
        // Broadcast Emails routes
        Route::middleware('permission:manage-broadcast-emails')->group(function () {
            Route::get('broadcast-emails', [BroadcastEmailController::class, 'index'])->middleware('permission:manage-broadcast-emails')->name('broadcast-emails.index');
            Route::get('broadcast-emails/create', [BroadcastEmailController::class, 'create'])->middleware('permission:create-broadcast-emails')->name('broadcast-emails.create');
            Route::post('broadcast-emails', [BroadcastEmailController::class, 'store'])->middleware('permission:create-broadcast-emails')->name('broadcast-emails.store');
            Route::get('broadcast-emails/{id}', [BroadcastEmailController::class, 'show'])->middleware('permission:view-broadcast-emails')->name('broadcast-emails.show');
            Route::delete('broadcast-emails/{id}', [BroadcastEmailController::class, 'destroy'])->middleware('permission:delete-broadcast-emails')->name('broadcast-emails.destroy');
        });
        
        // Campaign payment routes
        Route::post('campaigns/stripe-payment', [CampaignsController::class, 'stripePayment'])->name('campaigns.stripe.payment');
        Route::post('campaigns/paypal-payment', [CampaignsController::class, 'paypalPayment'])->name('campaigns.paypal.payment');
        Route::post('campaigns/bank-payment', [CampaignsController::class, 'bankPayment'])->name('campaigns.bank.payment');
        // Campaign Settings routes (Super Admin only)
        Route::middleware('App\Http\Middleware\SuperAdminMiddleware')->group(function () {
            Route::get('campaign/settings', [CampaignsController::class, 'settings'])->middleware('permission:manage-settings-campaigns')->name('campaigns.settings');
            Route::post('campaign/settings', [CampaignsController::class, 'settings'])->middleware('permission:manage-settings-campaigns')->name('campaigns.settings.update');
        });
        
        // Campaign global toggle (super admin only)
        Route::post('campaigns/toggle-global', [CampaignsController::class, 'toggleGlobal'])->middleware('App\Http\Middleware\SuperAdminMiddleware')->name('campaigns.toggle-global');

        // Currencies routes
        Route::middleware('permission:manage-currencies')->group(function () {
            Route::get('currencies', [CurrencyController::class, 'index'])->middleware('permission:manage-currencies')->name('currencies.index');
            Route::post('currencies', [CurrencyController::class, 'store'])->middleware('permission:create-currencies')->name('currencies.store');
            Route::put('currencies/{currency}', [CurrencyController::class, 'update'])->middleware('permission:edit-currencies')->name('currencies.update');
            Route::delete('currencies/{currency}', [CurrencyController::class, 'destroy'])->middleware('permission:delete-currencies')->name('currencies.destroy');
        });

        // ChatGPT routes
        Route::post('api/chatgpt/generate', [ChatGptController::class, 'generate'])->name('chatgpt.generate');
        
        // Language management
        Route::get('manage-language', [LanguageController::class, 'managePage'])->middleware('permission:manage-language')->name('manage-language');
        Route::get('language/load', [LanguageController::class, 'load'])->name('language.load');
        Route::match(['POST', 'PATCH'], 'language/save', [LanguageController::class, 'save'])->middleware('permission:edit-language')->name('language.save');
        Route::post('/languages/create', [LanguageController::class, 'createLanguage'])->name('languages.create');
        Route::delete('/languages/{languageCode}', [LanguageController::class, 'deleteLanguage'])->name('languages.delete');
        Route::patch('/languages/{languageCode}/toggle', [LanguageController::class, 'toggleLanguageStatus'])->name('languages.toggle');
        Route::post('/languages/{locale}/update', [LanguageController::class, 'updateTranslations'])->name('languages.update');
        Route::get('/languages/{locale}/package/{packageName}', [LanguageController::class, 'getPackageTranslations'])->name('languages.package.translations');
        Route::post('/languages/{locale}/package/{packageName}/update', [LanguageController::class, 'updatePackageTranslations'])->name('languages.package.update');

        // Landing Page content management (Super Admin only)
        Route::middleware('App\Http\Middleware\SuperAdminMiddleware')->group(function () {
            Route::get('landing-page/settings', [LandingPageController::class, 'settings'])->name('landing-page.settings');
            Route::post('landing-page/settings', [LandingPageController::class, 'updateSettings'])->name('landing-page.settings.update');
            
            // Newsletter routes
            Route::resource('landing-pages/newsletters', NewsletterController::class)->names([
                'index' => 'landing-page.newsletters.index',
                'store' => 'landing-page.newsletters.store',
                'update' => 'landing-page.newsletters.update',
                'destroy' => 'landing-page.newsletters.destroy'
            ])->except(['show']);
            Route::post('landing-page/newsletters/bulk-action', [NewsletterController::class, 'bulkAction'])->name('landing-page.newsletters.bulk-action');
            
            // API routes for slug validation
            Route::post('api/landing-page/custom-pages/check-slug', [CustomPageController::class, 'checkSlug'])->name('api.custom-pages.check-slug');
            Route::post('api/landing-page/custom-pages/generate-slug', [CustomPageController::class, 'generateSlug'])->name('api.custom-pages.generate-slug');
        });
        
        // Impersonation routes
        Route::middleware('App\Http\Middleware\SuperAdminMiddleware')->group(function () {
            Route::get('impersonate/{userId}', [ImpersonateController::class, 'start'])->name('impersonate.start');
        });

       

        // vCard Builder routes
        Route::get('vcard-builders', [VCardBuilderController::class, 'index'])->middleware('permission:manage-vcard-builder')->name('vcard-builder.index');
        Route::get('vcard-builder/create', [VCardBuilderController::class, 'create'])->middleware('permission:create-vcard-builder')->name('vcard-builder.create');
        Route::get('vcard-builder/{slug}/calendar', [VCardBuilderController::class, 'indexCalendar'])->middleware('permission:calendar-vcard-builder')->name('vcard-builder.calendar');
        Route::get('vcard-builder/{slug}/contacts', [VCardBuilderController::class, 'indexContacts'])->middleware('permission:contacts-vcard-builder')->name('vcard-builder.contacts');
        Route::get('vcard-builder/{slug}/analytics', [VCardBuilderController::class, 'indexAnalytics'])->middleware('permission:analytics-vcard-builder')->name('vcard-builder.analytics');
        Route::any('vcard-builder', [VCardBuilderController::class, 'store'])->middleware('permission:create-vcard-builder')->name('vcard-builder.store');
        Route::get('vcard-builder/{business}/edit', [VCardBuilderController::class, 'edit'])->middleware('permission:edit-vcard-builder')->name('vcard-builder.edit');
        Route::get('vcard-builder/{business}/preview', [VCardBuilderController::class, 'preview'])->middleware('permission:view-vcard-builder')->name('vcard-builder.preview');
        Route::post('vcard-builder/{business}/duplicate', [VCardBuilderController::class, 'duplicate'])->middleware('permission:duplicate-vcard-builder')->name('vcard-builder.duplicate');
        Route::put('vcard-builder/{business}', [VCardBuilderController::class, 'update'])->middleware('permission:edit-vcard-builder')->name('vcard-builder.update');
        Route::delete('vcard-builder/{business}', [VCardBuilderController::class, 'destroy'])->middleware('permission:delete-vcard-builder')->name('vcard-builder.destroy');
        
        // API routes for slug validation
        Route::post('landing-page/custom-pages/check-slug', [CustomPageController::class, 'checkSlug'])->name('custom-pages.check-slug');
        Route::post('landing-page/custom-pages/generate-slug', [CustomPageController::class, 'generateSlug'])->name('custom-pages.generate-slug');
    });

    Route::post('impersonate/leave', [ImpersonateController::class, 'leave'])->name('impersonate.leave');
    
    Route::get('enabled-addons', [AddonController::class, 'getEnabledAddons'])->name('enabled-addons');
    // Impersonation routes
    
    // API routes for slug validation
    Route::post('vcard-builder/check-slug', [VCardBuilderController::class, 'checkSlug'])->name('vcard-builder.check-slug');
    Route::post('vcard-builder/generate-slug', [VCardBuilderController::class, 'generateSlug'])->name('vcard-builder.generate-slug');
     
    // Addon routes
    Route::middleware('permission:manage-addons')->group(function () {
        Route::get('addons', [AddonController::class, 'index'])->name('addons.index');
        Route::post('addons/upload', [AddonController::class, 'upload'])->name('addons.upload');
        Route::post('addons/{id}/toggle-status', [AddonController::class, 'toggleStatus'])->name('addons.toggle-status');
        Route::delete('addons/{id}', [AddonController::class, 'remove'])->name('addons.remove');
    });
    
    // Business switching route
    Route::post('switch-business', [UserController::class, 'switchBusiness'])->name('switch-business');
    
    // Google Wallet routes
    Route::get('google-wallet', [GoogleWalletController::class, 'index'])->middleware('permission:manage-google-wallet')->name('google-wallet.index');
    Route::post('google-wallet/{business}/add', [GoogleWalletController::class, 'addToWallet'])->middleware('permission:create-google-wallet')->name('google-wallet.add');
    
    }); // End plan.access middleware group


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/link-bio.php';

Route::match(['GET', 'POST'], 'payments/easebuzz/success', [EasebuzzPaymentController::class, 'success'])->name('easebuzz.success');
Route::post('payments/easebuzz/callback', [EasebuzzPaymentController::class, 'callback'])->name('easebuzz.callback');
   
// Preview template route
Route::middleware(['auth', 'verified', 'setting', 'plan.access'])->group(function () {
    Route::get('vcard-preview', [VCardBuilderController::class, 'previewTemplate'])->name('vcard.preview');
});

// Public bio link routes - Must be before vCard routes to avoid conflicts
Route::match(['GET', 'POST'], '/{prefix}/{slug}', [PublicVCardController::class, 'show'])
    ->where('prefix', '(?!dashboard|admin|login|register|password|email|users|roles|permissions|plans|companies|contacts|appointments|calendar|nfc-cards|coupons|campaigns|currencies|vcard-builder|landing-page|page|translations|refresh-language|initial-locale|impersonate|referral|link-bio-builder|customer|contact|appointment|verify-password|verify-biolink-password|check-domain)[a-zA-Z0-9-_]+')
    ->where('slug', '[a-zA-Z0-9-_]+')
    ->name('public.vcard.show');

Route::match(['GET', 'POST'], '/{slug}', [PublicVCardController::class, 'showDirect'])
    ->where('slug', '(?!dashboard|admin|login|register|password|email|users|roles|permissions|plans|companies|contacts|appointments|calendar|nfc-cards|coupons|campaigns|currencies|vcard-builder|landing-page|page|translations|refresh-language|initial-locale|impersonate|referral|link-bio-builder|customer|contact|appointment|verify-password|verify-biolink-password|check-domain)[a-zA-Z0-9-_]+')
    ->name('public.vcard.show.direct');
