<?php

namespace Workdo\Event\Models;

use Illuminate\Database\Eloquent\Model;

class EventAnalytics extends Model
{
    protected $table = 'event_analytics';
    
    protected $fillable = [
        'event_id',
        'visitor_id',
        'ip_address',
        'user_agent',
        'browser',
        'platform',
        'device',
        'referer',
        'viewed_at'
    ];

    protected $casts = [
        'viewed_at' => 'datetime'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}