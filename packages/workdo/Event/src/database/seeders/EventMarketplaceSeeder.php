<?php

namespace Workdo\Event\database\seeders;

use Illuminate\Database\Seeder;
use Workdo\Event\Models\EventMarketplace;

class EventMarketplaceSeeder extends Seeder
{
    public function run()
    {
        $defaultSettings = [
            'title' => 'Event QR Code Add-on',
            'subtitle' => 'Create professional event experiences with QR codes. Streamline event management and enhance attendee engagement.',
            'demo_button_text' => 'View Demo',
            'get_started_button_text' => 'Get Started',
            'demo_button_link' => '',
            'primary_color' => '#10b77f',
            'secondary_color' => '#3b82f6',
            'accent_color' => '#8b5cf6',
            'background_image' => '',
            'use_background_image' => false,
            'features_title' => 'Powerful Event Features',
            'features_subtitle' => 'Everything you need for professional event QR code management and attendee engagement.',
            'features_show_icons' => true,
            'features_layout' => 'grid',
            'features_columns' => 4,
            'features_background_color' => '#ffffff',
            'features_icon_color' => '#10b77f',
            'screenshots_title' => 'See Event QR Code in Action',
            'screenshots_subtitle' => 'Discover how easy it is to create and manage event QR codes with our intuitive interface and powerful features.',
            'features' => [
                [
                    'title' => 'Easy Event Creation',
                    'description' => 'Create event QR codes in minutes with our intuitive drag-and-drop interface',
                    'icon' => 'calendar'
                ],
                [
                    'title' => 'QR Code Generation',
                    'description' => 'Generate high-quality QR codes for events with customizable designs and branding',
                    'icon' => 'qr-code'
                ],
                [
                    'title' => 'Real-time Analytics',
                    'description' => 'Track event attendance and engagement with comprehensive analytics dashboard',
                    'icon' => 'bar-chart'
                ],
            ],
            'stats' => [
                [
                    'value' => '50K+',
                    'label' => 'Events Created'
                ],
                [
                    'value' => '1M+',
                    'label' => 'QR Codes Generated'
                ],
                [
                    'value' => '99.9%',
                    'label' => 'Uptime'
                ],
            ],
            'screenshots' => [
                [
                    'title' => 'Event Page',
                    'description' => 'Beautiful, responsive Event pages that work on all devices.',
                    'image' => '/packages/workdo/Event/src/marketplace/image1.png'
                ],
                [
                    'title' => 'QR Code Designer',
                    'description' => 'Customize QR codes with your brand colors, logos, and styling options',
                    'image' => '/packages/workdo/Event/src/marketplace/image2.png'
                ],
                [
                    'title' => 'Analytics Overview',
                    'description' => 'Track event performance with detailed analytics and attendance reports',
                    'image' => '/packages/workdo/Event/src/marketplace/image3.png'
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
            EventMarketplace::setValue($key, $value);
        }
    }
}