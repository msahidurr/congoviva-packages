<?php

namespace Workdo\Event\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GuestArrival extends Model
{
    use HasFactory;

    protected $table = 'guest_arrivals';

    protected $fillable = [
        'event_id',
        'first_name',
        'last_name',
        'table_number',
        'seat_number',
        'arrived_at',
        'checked_in_by'
    ];

    protected $casts = [
        'arrived_at' => 'datetime'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function isArrived()
    {
        return $this->arrived_at !== null;
    }
}
