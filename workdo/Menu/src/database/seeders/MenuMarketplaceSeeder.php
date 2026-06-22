<?php

namespace Workdo\Menu\database\seeders;

use Illuminate\Database\Seeder;
use Workdo\Menu\Models\MenuMarketplace;

class MenuMarketplaceSeeder extends Seeder
{
    public function run()
    {
        $defaultSettings = [
            'title' => 'Menu Add-on',
            'subtitle' => 'Create professional digital menus with QR codes. Perfect for restaurants, cafes, bars, and food establishments.',
            'demo_button_text' => 'View Demo',
            'get_started_button_text' => 'Get Started',
            'demo_button_link' => '',
            'primary_color' => '#16A085',
            'secondary_color' => '#1ABC9C',
            'accent_color' => '#A3E4D7',
            'background_image' => '',
            'use_background_image' => false,
            'features_title' => 'Powerful Menu Features',
            'features_subtitle' => 'Everything you need for professional digital menu management and contactless dining.',
            'features_show_icons' => true,
            'features_layout' => 'grid',
            'features_columns' => 4,
            'features_background_color' => '#ffffff',
            'features_icon_color' => '#16A085',
            'screenshots_title' => 'See Menu Add-on in Action',
            'screenshots_subtitle' => 'Discover how easy it is to create and manage digital menus with our intuitive interface and powerful features.',
            'features' => [
                [
                    'title' => 'Multiple Menu Templates',
                    'description' => 'Choose from 5 unique menu designs: Restaurant, Cafe, Fast Food, Pizza, and Bar templates',
                    'icon' => 'utensils'
                ],
                [
                    'title' => 'QR Code Generation',
                    'description' => 'Generate high-quality QR codes for contactless menu viewing and sharing',
                    'icon' => 'qr-code'
                ],
                [
                    'title' => 'Menu Analytics',
                    'description' => 'Track menu views and customer engagement with comprehensive analytics',
                    'icon' => 'bar-chart'
                ],
                [
                    'title' => 'Mobile Optimized',
                    'description' => 'All menu templates are fully responsive and work perfectly on mobile devices',
                    'icon' => 'smartphone'
                ],
            ],
            'stats' => [
                [
                    'value' => '15K+',
                    'label' => 'Digital Menus Created'
                ],
                [
                    'value' => '250K+',
                    'label' => 'QR Codes Generated'
                ],
                [
                    'value' => '99.9%',
                    'label' => 'Uptime'
                ],
            ],
            'screenshots' => [
                [
                    'title' => 'Restaurant Menu',
                    'description' => 'Beautiful, responsive menu pages that work on all devices.',
                    'image' => '/packages/workdo/Menu/src/marketplace/image1.png'
                ],
                [
                    'title' => 'QR Code Designer',
                    'description' => 'Customize QR codes with your brand colors, logos, and styling options',
                    'image' => '/packages/workdo/Menu/src/marketplace/image2.png'
                ],
                [
                    'title' => 'Analytics Dashboard',
                    'description' => 'Track menu performance with detailed analytics and visitor reports',
                    'image' => '/packages/workdo/Menu/src/marketplace/image3.png'
                ]
            ],
            'config_sections' => [
                'section_order' => ['hero', 'features', 'stats', 'screenshots'],
                'section_visibility' => [
                    'hero' => true,
                    'features' => true,
                    'stats' => true,
                    'screenshots' => true
                ]
            ]
        ];

        foreach ($defaultSettings as $key => $value) {
            MenuMarketplace::setValue($key, $value);
        }
    }
}