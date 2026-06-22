<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'is_landing_page',
        'name',
        'email',
        'subject',
        'phone',
        'message',
        'status',
        'notes',
    ];

    protected $casts = [
        'is_landing_page' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Scope for landing page contacts
     */
    public function scopeLandingPage($query)
    {
        return $query->where('is_landing_page', true);
    }

    /**
     * Scope for business contacts
     */
    public function scopeBusiness($query)
    {
        return $query->where('is_landing_page', false);
    }

    /**
     * Get the business that owns the contact.
     */
    public function business()
    {
        return $this->belongsTo(Business::class);
    }
}