<?php

namespace Workdo\Menu\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Menu extends Model
{
    use HasFactory;

    protected $table = 'menus';

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'menu_type',
        'qr_code_path',
        'is_active',
        'config_sections'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'config_sections' => 'array'
    ];

    protected $appends = ['public_url', 'qr_code_url'];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function analytics()
    {
        return $this->hasMany(MenuAnalytics::class);
    }

    public function getMenuUrlAttribute()
    {
        return url("/menu-qr/{$this->slug}");
    }

    public function getPublicUrlAttribute()
    {
        return url("/menu-qr/{$this->slug}");
    }

    public function getQrCodeUrlAttribute()
    {
        return $this->qr_code_path ? asset('storage/' . $this->qr_code_path) : null;
    }
}