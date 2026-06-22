<?php

namespace Workdo\Event\Database\Seeders;

use Workdo\Event\Models\Event;
use Workdo\Event\Models\EventAnalytics;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    public function run()
    {
        // Get company users to assign events to
        $companyUsers = User::where('type', 'company')->get();
        
        if ($companyUsers->isEmpty()) {
            $this->command->warn('No company users found. Please run UserSeeder first.');
            return;
        }

        $sampleEvents = [
            [
                'name' => 'Tech Innovation Summit 2024',
                'event_type' => 'conference',
                'config_sections' => [
                    'event_info' => [
                        'event_title' => 'Tech Innovation Summit 2024',
                        'event_description' => 'Join industry leaders for cutting-edge technology discussions and networking opportunities.',
                        'event_date' => '2024-06-15',
                        'event_time' => '09:00',
                        'duration' => '8 hours'
                    ],
                    'venue' => [
                        'venue_name' => 'San Francisco Convention Center',
                        'address' => '747 Howard St, San Francisco, CA 94103',
                        'map_url' => 'https://maps.google.com/?q=San+Francisco+Convention+Center'
                    ],
                    'agenda' => [
                        'schedule_items' => [
                            ['time' => '09:00', 'title' => 'Registration & Welcome Coffee', 'speaker' => 'Event Team', 'description' => 'Check-in and networking'],
                            ['time' => '10:00', 'title' => 'Opening Keynote: Future of AI', 'speaker' => 'Dr. Sarah Johnson', 'description' => 'Exploring AI trends and innovations'],
                            ['time' => '11:30', 'title' => 'Panel: Blockchain Revolution', 'speaker' => 'Michael Chen', 'description' => 'Blockchain applications in business'],
                            ['time' => '13:00', 'title' => 'Lunch & Networking', 'speaker' => '', 'description' => 'Networking lunch break'],
                            ['time' => '14:30', 'title' => 'Workshop: Machine Learning Basics', 'speaker' => 'Emily Rodriguez', 'description' => 'Hands-on ML workshop'],
                            ['time' => '16:00', 'title' => 'Closing Remarks', 'speaker' => 'Event Team', 'description' => 'Summary and next steps']
                        ]
                    ],
                    'speakers' => [
                        'speaker_list' => [
                            ['name' => 'Dr. Sarah Johnson', 'title' => 'AI Research Director', 'company' => 'TechCorp', 'bio' => 'Leading AI researcher with 15+ years experience', 'photo' => ''],
                            ['name' => 'Michael Chen', 'title' => 'Blockchain Expert', 'company' => 'CryptoInnovate', 'bio' => 'Blockchain pioneer and cryptocurrency expert', 'photo' => ''],
                            ['name' => 'Emily Rodriguez', 'title' => 'ML Engineer', 'company' => 'DataSolutions', 'bio' => 'Machine learning specialist and data scientist', 'photo' => '']
                        ]
                    ],
                    'registration' => [
                        'registration_url' => 'https://techinnovationsummit.com/register',
                        'ticket_price' => '$299',
                        'early_bird_price' => '$199',
                        'registration_deadline' => '2024-06-01'
                    ],
                    'design' => [
                        'background_image' => ''
                    ],
                    'contact' => [
                        'organizer_name' => 'Tech Innovation Team',
                        'email' => 'info@techinnovationsummit.com',
                        'phone' => '+1 (555) 123-4567',
                        'website' => 'https://techinnovationsummit.com'
                    ],
                    'qr_share' => [
                        'enable_qr' => true,
                        'qr_title' => 'Share Conference',
                        'qr_description' => 'Scan this QR code to save conference details and share with colleagues.',
                        'qr_size' => 'medium'
                    ],
                    'colors' => [
                        'primary' => '#1e40af',
                        'secondary' => '#3b82f6',
                        'accent' => '#dbeafe',
                        'background' => '#ffffff',
                        'text' => '#1f2937'
                    ]
                ]
            ],
            [
                'name' => 'Sarah & Michael Wedding',
                'event_type' => 'wedding',
                'config_sections' => [
                    'event_info' => [
                        'bride_name' => 'Sarah Johnson',
                        'groom_name' => 'Michael Davis',
                        'wedding_date' => '2024-07-20',
                        'save_the_date' => 'Save the date for our special day!',
                        'wedding_hashtag' => '#SarahAndMichael2024'
                    ],
                    'ceremony' => [
                        'ceremony_time' => '15:00',
                        'ceremony_venue' => 'St. Mary\'s Church',
                        'ceremony_address' => '123 Church St, Wedding City, WC 12345',
                        'ceremony_dress_code' => 'Formal Attire'
                    ],
                    'reception' => [
                        'reception_time' => '18:00',
                        'reception_venue' => 'Grand Ballroom',
                        'reception_address' => '456 Reception Ave, Wedding City, WC 12345',
                        'dinner_style' => 'Plated Dinner'
                    ],
                    'wedding_party' => [
                        'bridal_party' => [
                            ['name' => 'Emma Johnson', 'role' => 'Maid of Honor', 'relationship' => 'Sister'],
                            ['name' => 'David Smith', 'role' => 'Best Man', 'relationship' => 'Brother'],
                            ['name' => 'Lisa Brown', 'role' => 'Bridesmaid', 'relationship' => 'Best Friend'],
                            ['name' => 'Tom Wilson', 'role' => 'Groomsman', 'relationship' => 'College Friend']
                        ]
                    ],
                    'rsvp' => [
                        'rsvp_url' => 'https://sarahandmichael.com/rsvp',
                        'rsvp_deadline' => '2024-06-20',
                        'rsvp_phone' => '+1 (555) 123-4567',
                        'guest_limit' => 'Adults Only'
                    ],
                    'registry' => [
                        'registry_links' => [
                            ['store_name' => 'Amazon', 'registry_url' => 'https://amazon.com/registry/sarah-michael'],
                            ['store_name' => 'Target', 'registry_url' => 'https://target.com/registry/sarah-michael'],
                            ['store_name' => 'Williams Sonoma', 'registry_url' => 'https://williams-sonoma.com/registry/sarah-michael']
                        ]
                    ],
                    'design' => [
                        'background_image' => '',
                        'couple_photo' => ''
                    ],
                    'accommodations' => [
                        'hotel_name' => 'Grand Hotel',
                        'hotel_address' => '789 Hotel Blvd, Wedding City, WC 12345',
                        'hotel_phone' => '+1 (555) 987-6543',
                        'booking_code' => 'SARAHMICHAEL2024'
                    ],
                    'qr_share' => [
                        'enable_qr' => true,
                        'qr_title' => 'Share Our Wedding',
                        'qr_description' => 'Scan this QR code to save our wedding details and share with loved ones.',
                        'qr_size' => 'medium'
                    ],
                    'colors' => [
                        'primary' => '#be185d',
                        'secondary' => '#f9a8d4',
                        'accent' => '#fdf2f8',
                        'background' => '#ffffff',
                        'text' => '#333333'
                    ]
                ]
            ],
            [
                'name' => 'Alex\'s 25th Birthday Bash',
                'event_type' => 'birthday',
                'config_sections' => [
                    'event_info' => [
                        'birthday_person' => 'Alex Thompson',
                        'age_turning' => 25,
                        'party_date' => '2024-08-10',
                        'party_time' => '19:00',
                        'theme' => 'Retro 90s Party',
                        'dress_code' => '90s Themed Attire'
                    ],
                    'venue' => [
                        'venue_name' => 'Community Center Hall',
                        'address' => '789 Party Lane, Fun City, FC 12345',
                        'parking_info' => 'Free parking available in rear lot',
                        'special_instructions' => 'Enter through main entrance, party room B'
                    ],
                    'activities' => [
                        'activity_list' => [
                            ['activity_name' => 'DJ & Dancing', 'description' => '90s music and dancing', 'time' => '19:30'],
                            ['activity_name' => 'Cake Cutting', 'description' => 'Birthday cake celebration', 'time' => '20:30'],
                            ['activity_name' => 'Photo Booth', 'description' => '90s themed photo booth', 'time' => '19:00'],
                            ['activity_name' => 'Karaoke', 'description' => '90s hits karaoke session', 'time' => '21:00']
                        ]
                    ],
                    'food_drinks' => [
                        'menu_type' => 'Buffet Style',
                        'special_dietary' => 'Vegetarian and gluten-free options available',
                        'cake_flavor' => 'Chocolate Fudge',
                        'drinks_provided' => true,
                        'menu_items' => [
                            ['item_name' => 'Pizza Variety', 'description' => 'Pepperoni, Margherita, and Veggie', 'category' => 'Main Course'],
                            ['item_name' => 'Chicken Wings', 'description' => 'Buffalo and BBQ flavors', 'category' => 'Main Course'],
                            ['item_name' => 'Birthday Cake', 'description' => 'Chocolate fudge birthday cake', 'category' => 'Dessert'],
                            ['item_name' => 'Soft Drinks & Juice', 'description' => 'Variety of beverages', 'category' => 'Drinks']
                        ]
                    ],
                    'rsvp' => [
                        'rsvp_phone' => '+1 (555) 456-7890',
                        'rsvp_email' => 'party@alexthompson.com',
                        'rsvp_deadline' => '2024-08-05',
                        'guest_limit' => 'Adults & Kids Welcome'
                    ],
                    'gifts' => [
                        'gift_preference' => 'Your presence is the best present! If you\'d like to bring something, books or music are always appreciated.',
                        'no_gifts' => false,
                        'charity_donation' => ''
                    ],
                    'design' => [
                        'background_image' => '',
                        'birthday_photo' => ''
                    ],
                    'qr_share' => [
                        'enable_qr' => true,
                        'qr_title' => 'Share My Party',
                        'qr_description' => 'Scan this QR code to save party details and share with friends!',
                        'qr_size' => 'medium'
                    ],
                    'colors' => [
                        'primary' => '#9c27b0',
                        'secondary' => '#e1bee7',
                        'accent' => '#f3e5f5',
                        'background' => '#ffffff',
                        'text' => '#333333'
                    ]
                ]
            ],
            [
                'name' => 'Contemporary Expressions Art Exhibition',
                'event_type' => 'art-exhibition',
                'config_sections' => [
                    'event_info' => [
                        'exhibition_title' => 'Contemporary Expressions',
                        'artist_name' => 'Sarah Mitchell',
                        'exhibition_type' => 'Solo Exhibition',
                        'description' => 'A captivating collection of contemporary artworks exploring themes of identity and place.'
                    ],
                    'gallery' => [
                        'gallery_name' => 'Metropolitan Art Gallery',
                        'address' => '123 Gallery Street, Arts District, AD 12345',
                        'location_url' => 'https://maps.google.com/?q=Metropolitan+Art+Gallery',
                        'opening_date' => '2024-09-05',
                        'closing_date' => '2024-10-15'
                    ],
                    'artworks' => [
                        'artwork_list' => [
                            ['title' => 'Urban Landscapes', 'medium' => 'Oil on Canvas', 'year' => '2024', 'description' => 'A vibrant interpretation of city life and architecture'],
                            ['title' => 'Quiet Moments', 'medium' => 'Watercolor', 'year' => '2024', 'description' => 'Intimate scenes capturing everyday beauty'],
                            ['title' => 'Abstract Forms', 'medium' => 'Mixed Media', 'year' => '2024', 'description' => 'Bold compositions exploring color and texture']
                        ]
                    ],
                    'artist_info' => [
                        'artist_bio' => 'Sarah Mitchell is a contemporary artist known for her expressive use of color and exploration of urban themes.',
                        'artist_statement' => 'My work explores the relationship between people and their environments, capturing moments of connection.',
                        'previous_exhibitions' => 'City Gallery (2023), Modern Art Center (2022), Regional Museum (2021)',
                        'artist_website' => 'https://sarahmitchellart.com'
                    ],
                    'ticket_pricing' => [
                        'booking_link' => 'https://metroartgallery.com/tickets',
                        'ticket_price' => '$25',
                        'early_bird_price' => '$20',
                        'group_discount' => '10% off for 5+ tickets'
                    ],
                    'design' => [
                        'background_image' => '',
                        'featured_artist' => ''
                    ],
                    'contact' => [
                        'gallery_contact' => 'Dr. Elizabeth Harper',
                        'email' => 'info@metroartgallery.com',
                        'phone' => '+1 (555) 321-0987',
                        'website' => 'https://metroartgallery.com'
                    ],
                    'qr_share' => [
                        'enable_qr' => true,
                        'qr_title' => 'Share Exhibition',
                        'qr_description' => 'Scan this QR code to save exhibition details and share with friends.',
                        'qr_size' => 'medium'
                    ],
                    'colors' => [
                        'primary' => '#be185d',
                        'secondary' => '#f9a8d4',
                        'accent' => '#f1f5f9',
                        'background' => '#ffffff',
                        'text' => '#8a0039'
                    ]
                ]
            ],
            [
                'name' => 'Summer Music Fest 2024',
                'event_type' => 'music-festival',
                'config_sections' => [
                    'event_info' => [
                        'festival_name' => 'Summer Music Fest 2024',
                        'festival_description' => 'Three days of incredible music featuring top artists from around the world.',
                        'start_date' => '2024-10-12',
                        'end_date' => '2024-10-14',
                        'genre' => 'Multi-Genre'
                    ],
                    'venue' => [
                        'venue_name' => 'Central Park Amphitheater',
                        'address' => '789 Music Ave, Festival City, FC 12345',
                        'capacity' => '50,000',
                        'map_url' => 'https://maps.google.com/?q=Central+Park+Amphitheater'
                    ],
                    'lineup' => [
                        'artist_list' => [
                            ['artist_name' => 'The Electric Waves', 'stage' => 'Main Stage', 'performance_time' => '20:00'],
                            ['artist_name' => 'Rock Legends', 'stage' => 'Rock Stage', 'performance_time' => '21:30'],
                            ['artist_name' => 'Acoustic Dreams', 'stage' => 'Acoustic Stage', 'performance_time' => '19:30'],
                            ['artist_name' => 'Urban Pulse', 'stage' => 'Hip Hop Stage', 'performance_time' => '22:00']
                        ]
                    ],
                    'schedule' => [
                        'daily_schedule' => [
                            ['date' => '2024-10-12', 'start_time' => '12:00', 'end_time' => '23:00', 'special_events' => 'Opening ceremony at 12:30'],
                            ['date' => '2024-10-13', 'start_time' => '11:00', 'end_time' => '23:59', 'special_events' => 'Headliner performances'],
                            ['date' => '2024-10-14', 'start_time' => '11:00', 'end_time' => '22:00', 'special_events' => 'Closing ceremony at 21:30']
                        ]
                    ],
                    'tickets' => [
                        'ticket_url' => 'https://musicfest.com/tickets',
                        'general_admission' => '$89',
                        'vip_price' => '$199',
                        'early_bird_price' => '$69',
                        'sale_deadline' => '2024-10-01'
                    ],
                    'amenities' => [
                        'amenity_list' => [
                            ['amenity_name' => 'Food Courts'],
                            ['amenity_name' => 'First Aid Station'],
                            ['amenity_name' => 'VIP Lounge'],
                            ['amenity_name' => 'Merchandise Booths'],
                            ['amenity_name' => 'Free WiFi']
                        ]
                    ],
                    'design' => [
                        'background_image' => ''
                    ],
                    'contact' => [
                        'organizer_name' => 'Music Fest Productions',
                        'email' => 'info@musicfest.com',
                        'phone' => '+1 (555) 123-4567',
                        'website' => 'https://musicfest.com',
                        'social_media' => '@musicfest2024'
                    ],
                    'qr_share' => [
                        'enable_qr' => true,
                        'qr_title' => 'Share Festival',
                        'qr_description' => 'Scan this QR code to save festival details and share with friends.',
                        'qr_size' => 'medium'
                    ],
                    'colors' => [
                        'primary' => '#8b5cf6',
                        'secondary' => '#a78bfa',
                        'accent' => '#f3f4f6',
                        'background' => '#ffffff',
                        'text' => '#1f2937'
                    ]
                ]
            ]
        ];

        foreach ($companyUsers as $user) {
            foreach ($sampleEvents as $index => $eventData) {
                $slug = $this->generateUniqueSlug($eventData['name']);
                
                $event = Event::create([
                    'user_id' => $user->id,
                    'name' => $eventData['name'],
                    'slug' => $slug,
                    'event_type' => $eventData['event_type'],
                    'config_sections' => $eventData['config_sections'],
                    'is_active' => true,
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now()->subDays(rand(0, 5))
                ]);

                // Generate QR code for the event
                $this->generateQrCode($event);

                // Create sample analytics data
                $this->createSampleAnalytics($event);
                
                // Add specific analytics entries for this event
                for ($i = 0; $i < 50; $i++) {
                    EventAnalytics::create([
                        'event_id' => $event->id,
                        'visitor_id' => rand(1, 1000),
                        'ip_address' => $this->generateRandomIp(),
                        'user_agent' => $this->getRandomUserAgent(),
                        'browser' => $this->getRandomBrowser(),
                        'platform' => $this->getRandomPlatform(),
                        'device' => $this->getRandomDevice(),
                        'referer' => $this->getRandomReferer(),
                        'viewed_at' => now()->subDays(rand(0, 30))->addHours(rand(0, 23))
                    ]);
                }

                $this->command->info("Created event: {$event->name} for user: {$user->name}");
            }
        }

        $this->command->info('Event seeder completed successfully!');
    }

    private function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (Event::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private function generateQrCode(Event $event)
    {
        try {
            $url = url("/event-qr/{$event->slug}");
            $qrCodeUrl = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" . urlencode($url);
            
            $qrCodeData = file_get_contents($qrCodeUrl);
            
            if ($qrCodeData !== false) {
                $filename = 'qr-codes/event-' . $event->id . '.png';
                Storage::disk('public')->put($filename, $qrCodeData);
                $event->update(['qr_code_path' => $filename]);
            }
        } catch (\Exception $e) {
            $this->command->warn("Failed to generate QR code for event: {$event->name}");
            $event->update(['qr_code_path' => null]);
        }
    }

    private function createSampleAnalytics(Event $event)
    {
        $startDate = $event->created_at;
        $endDate = Carbon::create(2024, 12, 31); // Until December 2024
        
        // Generate random analytics data until December
        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            $viewsCount = rand(10, 100); // Random views per day
            
            for ($i = 0; $i < $viewsCount; $i++) {
                EventAnalytics::create([
                    'event_id' => $event->id,
                    'visitor_id' => rand(1, 100),
                    'ip_address' => $this->generateRandomIp(),
                    'user_agent' => $this->getRandomUserAgent(),
                    'browser' => $this->getRandomBrowser(),
                    'platform' => $this->getRandomPlatform(),
                    'device' => $this->getRandomDevice(),
                    'referer' => $this->getRandomReferer(),
                    'viewed_at' => $date->copy()->addHours(rand(0, 23))->addMinutes(rand(0, 59))
                ]);
            }
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
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        ];
        
        return $userAgents[array_rand($userAgents)];
    }

    private function getRandomBrowser()
    {
        $browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
        return $browsers[array_rand($browsers)];
    }

    private function getRandomPlatform()
    {
        $platforms = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];
        return $platforms[array_rand($platforms)];
    }

    private function getRandomDevice()
    {
        $devices = ['Desktop', 'Mobile', 'Tablet'];
        return $devices[array_rand($devices)];
    }

    private function getRandomReferer()
    {
        $referers = [
            'https://google.com',
            'https://facebook.com',
            'https://twitter.com',
            'https://linkedin.com',
            'direct',
            null
        ];
        
        return $referers[array_rand($referers)];
    }
}