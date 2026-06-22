<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NfcCardOrderRequest extends Model
{
    protected $fillable = [
        "user_id",
        "nfc_card_id", 
        "quantity",
        "status",
        "original_price",
        "total_price",
        "logo",
        "shipping_address",
        "business_id",
    ];
    
    protected $casts = [
        "original_price" => "decimal:2",
        "total_price" => "decimal:2",
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function nfcCard(): BelongsTo
    {
        return $this->belongsTo(NfcCard::class);
    }
    
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }
}
