<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Service extends Model
{
    protected $table = 'service';
    protected $primaryKey = 'serviceID';
    public $timestamps = true;

    protected $fillable = [
        'userID',
        'fullName',
        'category',
        'portfolioURL',
        'email',
        'phone',
        'location',
        'availability',
        'photos',
        'serviceName',
        'servicePrice',
        'serviceDescription',
        'status',
        'aboutMe',
        'promoted',
    ];

    /**
     * All reviews for this service.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'service_id');
    }

    /**
     * All users who have favorited this service.
     */
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(
            User::class,
            'favorites',     // pivot table name
            'service_id',    // this model’s FK in pivot
            'user_id'        // related model’s FK in pivot
        );
    }
}
