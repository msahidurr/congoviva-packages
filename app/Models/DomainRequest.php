<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DomainRequest extends Model
{
    protected $fillable = [
        'user_id',
        'business_id',
        'biolink_id',
        'domain',
        'status',
        'message',
        'approved_at',
        'rejected_at',
        'approved_by',
        'rejected_by',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function rejector()
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    public function biolink()
    {
        return $this->belongsTo(BioLink::class);
    }
}
