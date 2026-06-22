<?php

namespace Workdo\Event\Models;

use Illuminate\Database\Eloquent\Model;

class EventMarketplace extends Model
{
    protected $table = 'event_marketplace';
    
    protected $fillable = [
        'key',
        'value'
    ];

    protected $casts = [
        'value' => 'array'
    ];

    public static function getValue($key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        if (!$setting) return $default;
        
        $decoded = json_decode($setting->value, true);
        return $decoded !== null ? $decoded : $setting->value;
    }

    public static function setValue($key, $value)
    {
        $encodedValue = is_array($value) || is_object($value) 
            ? json_encode($value, JSON_UNESCAPED_SLASHES) 
            : (string) $value;
            
        return static::updateOrCreate(
            ['key' => $key],
            ['value' => $encodedValue]
        );
    }
}