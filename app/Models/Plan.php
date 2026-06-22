<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'price',
        'yearly_price',
        'duration',
        'description',
        'business',
        'bio_links',
        'max_users',
        'themes',
        'bio_links_themes',
        'addons',
        'enable_custdomain',
        'enable_custsubdomain',
        'enable_branding',
        'pwa_business',
        'enable_chatgpt',
        'storage_limit',
        'is_trial',
        'trial_day',
        'is_plan_enable',
        'is_default',
        'module',
        'features',
    ];
    
    protected $casts = [
        'themes' => 'array',
        'bio_links_themes' => 'array',
        'addons' => 'array',
        'module' => 'array',
        'features' => 'array',
        'is_default' => 'boolean',
        'price' => 'float',
        'yearly_price' => 'float',
    ];
    
    /**
     * Get the default plan
     *
     * @return Plan|null
     */
    public static function getDefaultPlan()
    {
        return self::where('is_default', true)->first();
    }
    
    /**
     * Check if the plan is the default plan
     *
     * @return bool
     */
    public function isDefault()
    {
        return (bool) $this->is_default;
    }
    
    /**
     * Get the price based on billing cycle
     *
     * @param string $cycle 'monthly' or 'yearly'
     * @return float
     */
    public function getPriceForCycle($cycle = 'monthly')
    {
        if ($cycle === 'yearly' && $this->yearly_price) {
            return $this->yearly_price;
        }
        
        return $this->price;
    }
    
    /**
     * Get the yearly price (calculated or actual)
     *
     * @return float
     */
    public function getYearlyPrice()
    {
        return $this->yearly_price ?: ($this->price * 12 * 0.8);
    }
    
    /**
     * Get formatted yearly price for display
     *
     * @return string
     */
    public function getFormattedYearlyPrice()
    {
        return '$' . number_format($this->getYearlyPrice(), 2);
    }
    
    /**
     * Get users subscribed to this plan
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }
    
    /**
     * Check if a specific feature is enabled for this plan
     *
     * @param string $feature
     * @return bool
     */
    public function hasFeature($feature)
    {
        $features = $this->features ?? [];
        
        // Ensure features is an array
        if (!is_array($features)) {
            $features = [];
        }
        
        return isset($features[$feature]) && $features[$feature] === true;
    }
    
    /**
     * Get all enabled features for this plan
     *
     * @return array
     */
    public function getEnabledFeatures()
    {
        $features = $this->features ?? [];
        
        // Ensure features is an array
        if (!is_array($features)) {
            $features = [];
        }
        
      return array_keys(array_filter($features, function($value) {
            return $value === true;
        }));
    }
    
    /**
     * Get business template sections allowed for this plan
     *
     * @return array
     */
    public function getAllowedTemplateSections()
    {
        $features = $this->features ?? [];
        
        // Ensure features is an array
        if (!is_array($features)) {
            $features = [];
        }
        
        return $features['business_template_sections'] ?? [];
    }
    
    /**
     * Check if a business template section is allowed
     *
     * @param string $section
     * @return bool
     */
    public function hasTemplateSection($section)
    {
        $allowedSections = $this->getAllowedTemplateSections();
        return empty($allowedSections) || in_array($section, $allowedSections);
    }
    
    /**
     * Get the default features structure
     *
     * @return array
     */
    public static function getDefaultFeatures()
    {
        return [
            // Core Features
            'custom_domain' => false,
            'custom_subdomain' => false,
            'pwa_support' => false,
            'ai_integration' => false,
            'password_protection' => false,
            'custom_css_js' => false,
            'google_wallet' => false,
            'bio_link' => true,
            'vcard_builder' => true,
            'broadcast_email' => false,
            
            // Business Template Sections
            'business_template_sections' => [
                'header',
                'about',
                'contact',
                'social',
                'custom_html',
                'qr_share'
            ]
        ];
    }
    
    /**
     * Get addons allowed for this plan
     *
     * @return array
     */
    public function getAllowedAddons()
    {
        return $this->addons ?? [];
    }
    
    /**
     * Check if an addon is allowed for this plan
     *
     * @param string $packageName
     * @return bool
     */
    public function hasAddon($packageName)
    {
        $allowedAddons = $this->getAllowedAddons();
        return in_array($packageName, $allowedAddons);
    }
    
    /**
     * Check if broadcast email feature is enabled for this plan
     *
     * @return bool
     */
    public function hasBroadcastEmail()
    {
        return $this->hasFeature('broadcast_email');
    }
    
    /**
     * Get all available business template sections
     *
     * @return array
     */
    public static function getAllTemplateSections()
    {
        return [
            'header' => 'Header & Logo',
            'about' => 'About Section',
            'services' => 'Services & Offerings',
            'portfolio' => 'Portfolio & Gallery',
            'testimonials' => 'Testimonials & Reviews',
            'contact' => 'Contact Information',
            'social' => 'Social Media Links',
            'business_hours' => 'Business Hours',
            'gallery' => 'Photo Gallery',
            'appointments' => 'Appointment Booking',
            'google_map' => 'Location & Maps',
            'app_download' => 'App Download Links',
            'contact_form' => 'Contact Form',
            'custom_html' => 'Custom HTML Content',
            'qr_share' => 'QR Code Sharing',
            'language' => 'Language Settings',
            'thank_you' => 'Thank You Message',
            'seo' => 'SEO Settings',
            'pixels' => 'Analytics & Pixels',
            'copyright' => 'Copyright Information',
            'footer' => 'Footer'
        ];
    }
}