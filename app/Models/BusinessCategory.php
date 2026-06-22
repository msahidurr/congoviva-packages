<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessCategory extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'status',
        'created_by',
    ];
    
    /**
     * Get the businesses for the category.
     */
    public function businesses()
    {
        return $this->hasMany(Business::class, 'category_id');
    }
}