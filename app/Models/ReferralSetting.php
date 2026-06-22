<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReferralSetting extends Model
{
    protected $fillable = [
        'is_enabled',
        'commission_percentage',
        'threshold_amount',
        'guidelines',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'commission_percentage' => 'decimal:2',
        'threshold_amount' => 'decimal:2',
    ];

    public static function current()
    {
        return static::first() ?? static::create([
            'is_enabled' => false, // Default to disabled for security
            'commission_percentage' => 10.00,
            'threshold_amount' => 50.00,
        ]);
    }
    
    public static function isEnabled(): bool
    {
        $settings = static::current();
        return $settings && $settings->is_enabled;
    }
}