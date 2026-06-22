<?php

namespace Workdo\Menu\Database\Seeders;

use Illuminate\Database\Seeder;
use Workdo\Menu\Models\Menu;
use Workdo\Menu\Models\MenuAnalytics;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class MenuSeeder extends Seeder
{
    public function run()
    {
        $companyUsers = User::where('type', 'company')->get();
        
        if ($companyUsers->isEmpty()) {
            $this->command->warn('No company users found. Please run UserSeeder first.');
            return;
        }

        $sampleMenus = [
            [
                'name' => 'Cozy Corner Cafe Menu',
                'menu_type' => 'cafe',
                'config_sections' => [
                    'menu_info' => [
                        'cafe_name' => 'Cozy Corner Cafe',
                        'tagline' => 'Where every cup tells a story',
                        'description' => 'A warm and welcoming neighborhood cafe serving freshly roasted coffee and homemade pastries.',
                        'operating_hours' => 'Mon-Fri: 6:00 AM - 8:00 PM\nSat-Sun: 7:00 AM - 9:00 PM'
                    ],
                    'categories' => [
                        'section_title' => 'Our Menu',
                        'category_list' => [
                            [
                                'name' => 'Espresso',
                                'description' => 'Rich and bold espresso shot',
                                'price' => '$2.50',
                                'is_popular' => true,
                                'is_vegetarian' => true
                            ],
                            [
                                'name' => 'Cappuccino',
                                'description' => 'Espresso with steamed milk and foam',
                                'price' => '$4.25',
                                'is_popular' => true,
                                'is_vegetarian' => true
                            ],
                            [
                                'name' => 'Latte',
                                'description' => 'Smooth espresso with steamed milk',
                                'price' => '$4.75',
                                'is_popular' => false,
                                'is_vegetarian' => true
                            ],
                            [
                                'name' => 'Croissant',
                                'description' => 'Buttery, flaky French pastry',
                                'price' => '$3.50',
                                'is_popular' => false,
                                'is_vegetarian' => true
                            ]
                        ]
                    ],
                    'specialties' => [
                        'section_title' => "Today's Specials",
                        'special_items' => [
                            [
                                'name' => 'Seasonal Pumpkin Latte',
                                'description' => 'Our signature fall blend with real pumpkin and warm spices',
                                'price' => '$5.75'
                            ],
                            [
                                'name' => 'Fresh Blueberry Muffin',
                                'description' => 'Made this morning with local blueberries',
                                'price' => '$3.25'
                            ]
                        ]
                    ],
                    'contact' => [
                        'section_title' => 'Visit Us',
                        'address' => '123 Main Street\nAnytown, ST 12345',
                        'phone' => '(555) 123-4567',
                        'email' => 'hello@cozycorner.com'
                    ],
                    'qr_share' => [
                        'enable_qr' => true,
                        'qr_title' => 'Share Our Menu',
                        'qr_description' => 'Share our delicious menu with friends and family',
                        'qr_size' => 'medium'
                    ],
                    'colors' => [
                        'primary' => '#8B4513',
                        'secondary' => '#D2691E',
                        'accent' => '#F4A460',
                        'background' => '#ffffff',
                        'text' => '#2F1B14',
                        'cardBg' => '#fafafa',
                        'borderColor' => '#e5e7eb',
                        'buttonText' => '#ffffff'
                    ]
                ]
            ],
            [
                'name' => 'Le Gourmet Restaurant Menu',
                'menu_type' => 'restaurant',
                'config_sections' => [
                    'menu_info' => [
                        'restaurant_name' => 'Le Gourmet',
                        'cuisine_type' => 'French Contemporary',
                        'description' => 'An exquisite dining experience featuring contemporary French cuisine with seasonal ingredients.',
                        'operating_hours' => 'Tue-Thu: 5:30 PM - 10:00 PM\nFri-Sat: 5:30 PM - 11:00 PM\nSun: 5:00 PM - 9:00 PM\nClosed Mondays'
                    ],
                    'chef_specials' => [
                        'section_title' => "Chef's Recommendations",
                        'chef_recommendations' => [
                            [
                                'name' => 'Pan-Seared Duck Breast',
                                'description' => 'Served with cherry gastrique and roasted vegetables',
                                'ingredients' => 'Duck breast, cherries, seasonal vegetables',
                                'chef_notes' => 'Our signature dish, prepared with locally sourced duck',
                                'price' => '$38',
                                'is_signature' => true
                            ],
                            [
                                'name' => 'Lobster Bisque',
                                'description' => 'Rich and creamy lobster soup with cognac',
                                'ingredients' => 'Fresh lobster, cream, cognac, herbs',
                                'chef_notes' => 'Made daily with fresh Maine lobster',
                                'price' => '$16',
                                'is_signature' => false
                            ]
                        ]
                    ],
                    'categories' => [
                        'section_title' => 'Our Menu',
                        'category_list' => [
                            [
                                'name' => 'Appetizers',
                                'description' => 'Fresh seasonal starters',
                                'price' => '$12-18'
                            ],
                            [
                                'name' => 'Main Courses',
                                'description' => 'Chef-crafted entrees',
                                'price' => '$28-45'
                            ],
                            [
                                'name' => 'Desserts',
                                'description' => 'Artisanal sweet endings',
                                'price' => '$10-14'
                            ]
                        ]
                    ],
                    'wine_list' => [
                        'section_title' => 'Wine Selection',
                        'wine_categories' => [
                            [
                                'name' => 'Château Margaux',
                                'vintage' => '2018',
                                'price' => '$180'
                            ],
                            [
                                'name' => 'Dom Pérignon',
                                'vintage' => '2012',
                                'price' => '$220'
                            ]
                        ]
                    ],
                    'contact' => [
                        'section_title' => 'Visit Us',
                        'address' => '456 Fine Dining Ave\nUptown, ST 12345',
                        'phone' => '(555) 987-6543',
                        'email' => 'reservations@legourmet.com'
                    ],
                    'qr_share' => [
                        'enable_qr' => true,
                        'qr_title' => 'Share Our Menu',
                        'qr_description' => 'Share our exquisite dining experience with others',
                        'qr_size' => 'medium'
                    ],
                    'colors' => [
                        'primary' => '#1a1a1a',
                        'secondary' => '#d4af37',
                        'accent' => '#f5f5f5',
                        'background' => '#ffffff',
                        'text' => '#333333',
                        'cardBg' => '#fafafa',
                        'borderColor' => '#e5e7eb',
                        'buttonText' => '#ffffff'
                    ]
                ]
            ],
            [
                'name' => 'Quick Bites Fast Food Menu',
                'menu_type' => 'fastfood',
                'config_sections' => [
                    'menu_info' => [
                        'restaurant_name' => 'Quick Bites',
                        'slogan' => 'Fast, Fresh, Delicious!',
                        'description' => 'Your favorite fast food made fresh daily with quality ingredients.',
                        'service_time' => '5-10 minutes'
                    ],
                    'combos' => [
                        'section_title' => "Today's Specials",
                        'combo_deals' => [
                            [
                                'name' => 'Big Burger Combo',
                                'items' => 'Double burger, large fries, large drink',
                                'price' => '$9.99',
                                'original_price' => '$12.50',
                                'savings' => '$2.51',
                                'is_popular' => true
                            ],
                            [
                                'name' => 'Chicken Deluxe Combo',
                                'items' => 'Crispy chicken sandwich, fries, drink',
                                'price' => '$8.99',
                                'original_price' => '$11.25',
                                'savings' => '$2.26',
                                'is_popular' => false
                            ]
                        ]
                    ],
                    'categories' => [
                        'section_title' => 'Our Menu',
                        'category_list' => [
                            [
                                'name' => 'Classic Burger',
                                'description' => 'Beef patty with lettuce, tomato, onion',
                                'price' => '$5.99'
                            ],
                            [
                                'name' => 'Chicken Nuggets',
                                'description' => '10-piece crispy chicken nuggets',
                                'price' => '$6.49'
                            ],
                            [
                                'name' => 'French Fries',
                                'description' => 'Golden crispy fries',
                                'price' => '$2.99'
                            ]
                        ]
                    ],
                    'delivery' => [
                        'delivery_available' => true,
                        'delivery_time' => '15-25 minutes',
                        'delivery_fee' => '$2.99',
                        'minimum_order' => '$15.00'
                    ],
                    'contact' => [
                        'section_title' => 'Visit Us',
                        'address' => '789 Fast Lane\nQuicktown, ST 12345',
                        'phone' => '(555) 456-7890',
                        'email' => 'orders@quickbites.com'
                    ],
                    'qr_share' => [
                        'enable_qr' => true,
                        'qr_title' => 'Share Our Menu',
                        'qr_description' => 'Share our fast and delicious menu with friends!',
                        'qr_size' => 'medium'
                    ],
                    'colors' => [
                        'primary' => '#FF6B35',
                        'secondary' => '#F7931E',
                        'accent' => '#FFE5B4',
                        'background' => '#ffffff',
                        'text' => '#2D3748',
                        'cardBg' => '#fafafa',
                        'borderColor' => '#e5e7eb',
                        'buttonText' => '#ffffff'
                    ]
                ]
            ],
            [
                'name' => 'Mama Mia Pizzeria Menu',
                'menu_type' => 'pizza',
                'config_sections' => [
                    'menu_info' => [
                        'pizzeria_name' => 'Mama Mia Pizzeria',
                        'italian_motto' => 'Autentica Pizza Italiana',
                        'description' => 'Authentic Italian pizza made with traditional recipes and the finest ingredients.',
                        'delivery_time' => '25-35 minutes'
                    ],
                    'sizes' => [
                        'size_options' => [
                            [
                                'size' => 'Small',
                                'diameter' => '10"',
                                'serves' => '1-2',
                                'price' => '$12.99'
                            ],
                            [
                                'size' => 'Medium',
                                'diameter' => '14"',
                                'serves' => '2-3',
                                'price' => '$15.99'
                            ],
                            [
                                'size' => 'Large',
                                'diameter' => '16"',
                                'serves' => '3-4',
                                'price' => '$18.99'
                            ]
                        ]
                    ],
                    'pizzas' => [
                        'section_title' => 'Our Menu',
                        'pizza_list' => [
                            [
                                'name' => 'Margherita',
                                'toppings' => 'Fresh mozzarella, tomato sauce, basil',
                                'crust_type' => 'Thin',
                                'base_price' => '$16.99',
                                'is_popular' => true,
                                'is_spicy' => false
                            ],
                            [
                                'name' => 'Pepperoni',
                                'toppings' => 'Pepperoni, mozzarella, tomato sauce',
                                'crust_type' => 'Regular',
                                'base_price' => '$18.99',
                                'is_popular' => true,
                                'is_spicy' => false
                            ],
                            [
                                'name' => 'Diavola',
                                'toppings' => 'Spicy salami, mozzarella, chili flakes',
                                'crust_type' => 'Thin',
                                'base_price' => '$19.99',
                                'is_popular' => false,
                                'is_spicy' => true
                            ]
                        ]
                    ],
                    'sides' => [
                        'section_title' => 'Sides & Extras',
                        'side_items' => [
                            [
                                'name' => 'Garlic Bread',
                                'description' => 'Fresh baked with herbs',
                                'price' => '$4.99'
                            ],
                            [
                                'name' => 'Caesar Salad',
                                'description' => 'Crisp romaine with parmesan',
                                'price' => '$7.99'
                            ]
                        ]
                    ],
                    'contact' => [
                        'section_title' => 'Visit Us',
                        'address' => '321 Pizza Street\nLittle Italy, ST 12345',
                        'phone' => '(555) 321-9876',
                        'email' => 'orders@mamamia.com'
                    ],
                    'qr_share' => [
                        'enable_qr' => true,
                        'qr_title' => 'Share Our Pizza Menu',
                        'qr_description' => 'Share our authentic Italian pizza menu with pizza lovers!',
                        'qr_size' => 'medium'
                    ],
                    'colors' => [
                        'primary' => '#C41E3A',
                        'secondary' => '#228B22',
                        'accent' => '#FFD700',
                        'background' => '#ffffff',
                        'text' => '#2D3748',
                        'cardBg' => '#fafafa',
                        'borderColor' => '#e5e7eb',
                        'buttonText' => '#ffffff'
                    ]
                ]
            ],
            [
                'name' => 'The Golden Lounge Bar Menu',
                'menu_type' => 'bar',
                'config_sections' => [
                    'menu_info' => [
                        'bar_name' => 'The Golden Lounge',
                        'atmosphere' => 'Sophisticated & Elegant',
                        'description' => 'Premium cocktails and spirits in an upscale atmosphere.',
                        'operating_hours' => 'Mon-Thu: 5:00 PM - 12:00 AM\nFri-Sat: 5:00 PM - 2:00 AM\nSun: 6:00 PM - 11:00 PM'
                    ],
                    'happy_hour' => [
                        'is_active' => true,
                        'time_range' => '5:00 PM - 7:00 PM',
                        'discount' => '50%'
                    ],
                    'cocktails' => [
                        'section_title' => 'Our Menu',
                        'cocktail_list' => [
                            [
                                'name' => 'Golden Martini',
                                'ingredients' => 'Premium vodka, dry vermouth, olive',
                                'strength' => 'Strong',
                                'category' => 'Classic',
                                'price' => '$14',
                                'is_signature' => true
                            ],
                            [
                                'name' => 'Whiskey Sour',
                                'ingredients' => 'Bourbon, lemon juice, simple syrup',
                                'strength' => 'Medium',
                                'category' => 'Classic',
                                'price' => '$12',
                                'is_signature' => false
                            ],
                            [
                                'name' => 'Mojito',
                                'ingredients' => 'White rum, mint, lime, soda water',
                                'strength' => 'Mild',
                                'category' => 'Refreshing',
                                'price' => '$11',
                                'is_signature' => false
                            ]
                        ]
                    ],
                    'spirits' => [
                        'spirit_categories' => [
                            [
                                'name' => 'Macallan 18',
                                'brand' => 'Macallan',
                                'age' => '18',
                                'price' => '$45'
                            ],
                            [
                                'name' => 'Hennessy XO',
                                'brand' => 'Hennessy',
                                'age' => 'XO',
                                'price' => '$35'
                            ]
                        ]
                    ],
                    'events' => [
                        'upcoming_events' => [
                            [
                                'name' => 'Jazz Night',
                                'date' => now()->addDays(7)->format('Y-m-d'),
                                'time' => '8:00 PM',
                                'cover_charge' => '$10'
                            ],
                            [
                                'name' => 'Live DJ',
                                'date' => now()->addDays(14)->format('Y-m-d'),
                                'time' => '9:00 PM',
                                'cover_charge' => '$15'
                            ]
                        ]
                    ],
                    'contact' => [
                        'section_title' => 'Visit Us',
                        'address' => '654 Nightlife Blvd\nUptown, ST 12345',
                        'phone' => '(555) 654-3210',
                        'email' => 'info@goldenlounge.com'
                    ],
                    'qr_share' => [
                        'enable_qr' => true,
                        'qr_title' => 'Share Our Bar Menu',
                        'qr_description' => 'Share our premium cocktail menu and nightlife experience',
                        'qr_size' => 'medium'
                    ],
                    'colors' => [
                        'primary' => '#2D1B69',
                        'secondary' => '#FFD700',
                        'accent' => '#4B0082',
                        'background' => '#ffffff',
                        'text' => '#1A1A1A',
                        'cardBg' => '#fafafa',
                        'borderColor' => '#e5e7eb',
                        'buttonText' => '#ffffff'
                    ]
                ]
            ]
        ];

        foreach ($companyUsers as $user) {
            foreach ($sampleMenus as $menuData) {
                $slug = $this->generateUniqueSlug($menuData['name']);
                
                $menu = Menu::create([
                    'user_id' => $user->id,
                    'name' => $menuData['name'],
                    'slug' => $slug,
                    'menu_type' => $menuData['menu_type'],
                    'config_sections' => $menuData['config_sections'],
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                // Generate QR code for the menu
                $this->generateQrCode($menu);

                // Create sample analytics data
                $this->createSampleAnalytics($menu);
                
                $this->command->info("Created menu: {$menu->name} for user: {$user->name}");
            }
        }

        $this->command->info('Menu seeder completed successfully!');
    }

    private function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (Menu::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private function generateQrCode(Menu $menu)
    {
        try {
            $url = url("/menu-qr/{$menu->slug}");
            $qrCodeUrl = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" . urlencode($url);
            
            $qrCodeData = file_get_contents($qrCodeUrl);
            
            if ($qrCodeData !== false) {
                $filename = 'qr-codes/menu-' . $menu->id . '.png';
                Storage::disk('public')->put($filename, $qrCodeData);
                $menu->update(['qr_code_path' => $filename]);
            }
        } catch (\Exception $e) {
            $this->command->warn("Failed to generate QR code for menu: {$menu->name}");
            $menu->update(['qr_code_path' => null]);
        }
    }

    private function createSampleAnalytics(Menu $menu)
    {
        for ($i = 0; $i < rand(30, 120); $i++) {
            MenuAnalytics::create([
                'menu_id' => $menu->id,
                'visitor_id' => null,
                'ip_address' => $this->generateRandomIp(),
                'user_agent' => $this->getRandomUserAgent(),
                'referer' => $this->getRandomReferer(),
                'viewed_at' => now()->subDays(rand(0, 30))->addHours(rand(0, 23))
            ]);
        }
    }

    private function generateRandomIp()
    {
        return rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255);
    }

    private function getRandomUserAgent()
    {
        $userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Android 11; Mobile; rv:89.0) Gecko/89.0 Firefox/89.0'
        ];
        
        return $userAgents[array_rand($userAgents)];
    }

    private function getRandomReferer()
    {
        $referers = ['https://google.com', 'https://facebook.com', 'https://instagram.com', 'direct', null];
        return $referers[array_rand($referers)];
    }
}