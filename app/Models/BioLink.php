<?php

namespace App\Models;

class BioLink extends BaseModel
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'created_by',
        'name',
        'slug',
        'link_type',
        'custom_domain',
        'url_prefix',
        'password',
        'password_enabled',
        'config',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'config' => 'json',
        'password_enabled' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user that owns the bio link.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the URL for the bio link.
     */
    public function getUrlAttribute()
    {
        if ($this->custom_domain) {
            return "https://{$this->custom_domain}";
        }

        return url("{$this->url_prefix}/{$this->slug}");
    }
    
    /**
     * Get the full URL for the bio link.
     */
    public function getFullUrlAttribute()
    {
        if ($this->custom_domain) {
            return "https://{$this->custom_domain}";
        }

        $prefix = $this->url_prefix ?: 'bio';
        return url("/{$prefix}/{$this->slug}");
    }

    /**
     * Check if the bio link is password protected.
     */
    public function isPasswordProtected()
    {
        return $this->password_enabled && !empty($this->password);
    }
}