<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NfcCard extends Model
{
    protected $fillable = [
        'name',
        'price',
        'quantity',
        'front_image',
        'back_image',
        'is_enabled',
        'created_by'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_enabled' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public static function isMenuVisible($userId)
    {
        return \App\Models\Setting::where('user_id', $userId)
            ->where('key', 'nfc_card_menu_visible')
            ->value('value') !== 'false';
    }
}
