<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CampaignSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'pricing_tiers'
    ];

    protected $casts = [
        'pricing_tiers' => 'array'
    ];

    public static function getSettings()
    {
        return self::first() ?? self::create([
            'pricing_tiers' => [
                [
                    'min_days' => 1,
                    'max_days' => 30,
                    'per_day_price' => 15.00
                ],
                [
                    'min_days' => 31,
                    'max_days' => 90,
                    'per_day_price' => 12.00
                ],
                [
                    'min_days' => 91,
                    'max_days' => 365,
                    'per_day_price' => 10.00
                ]
            ]
        ]);
    }
}