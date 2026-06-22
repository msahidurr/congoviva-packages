<?php

namespace Workdo\Menu\Models;

use Illuminate\Database\Eloquent\Model;

class MenuMarketplace extends Model
{
    protected $table = 'menu_marketplace';

    protected $fillable = [
        'key',
        'value'
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