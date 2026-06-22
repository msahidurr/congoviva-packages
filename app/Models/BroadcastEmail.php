<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BroadcastEmail extends Model
{
    protected $fillable = [
        'user_id',
        'user_type',
        'subject',
        'message',
        'total_recipients',
        'sent_count',
        'failed_count',
        'status',
        'scheduled_at',
        'started_at',
        'completed_at',
        'created_by'
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function logs()
    {
        return $this->hasMany(BroadcastEmailLog::class);
    }

    public function incrementSent()
    {
        $this->increment('sent_count');
    }

    public function incrementFailed()
    {
        $this->increment('failed_count');
    }

    public function markAsProcessing()
    {
        $this->update([
            'status'     => 'processing',
            'started_at' => $this->started_at ?? now(),
        ]);
    }

    public function markAsCompleted()
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    public function markAsFailed()
    {
        $this->update([
            'status' => 'failed',
            'completed_at' => now(),
        ]);
    }

    public function getPendingCount()
    {
        return $this->logs()->where('status', 'pending')->count();
    }
}
