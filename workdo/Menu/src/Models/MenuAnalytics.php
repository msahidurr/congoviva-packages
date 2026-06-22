<?php

namespace Workdo\Menu\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MenuAnalytics extends Model
{
    use HasFactory;

    protected $table = 'menu_analytics';

    protected $fillable = [
        'menu_id',
        'visitor_id',
        'ip_address',
        'user_agent',
        'referer',
        'viewed_at'
    ];

    protected $casts = [
        'viewed_at' => 'datetime'
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    public function visitor()
    {
        return $this->belongsTo(\App\Models\User::class, 'visitor_id');
    }
}