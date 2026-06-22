<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'key',
        'value',
    ];

    /**
     * Get the user that owns the setting.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function getUserSettings($userId)
    {
        return self::where('user_id', $userId)->pluck('value', 'key')->toArray();
    }

    public static function getNfcCardVisibility($userId)
    {
        return self::where('user_id', $userId)
            ->where('key', 'nfc_card_menu_visible')
            ->value('value') ?? 'true';
    }

    public static function setNfcCardVisibility($userId, $visible)
    {
        return self::updateOrCreate(
            ['user_id' => $userId, 'key' => 'nfc_card_menu_visible'],
            ['value' => $visible ? 'true' : 'false']
        );
    }
}