<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Addon extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'version',
        'description',
        'image',
        'category',
        'is_enabled',
        'package_name',
        'monthly_price',
        'yearly_price',
        'config'
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'config' => 'array'
    ];
}
