<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    protected $table = 'businessowner';   // Table name in DB
    protected $primaryKey = 'ownerID';    // Primary key
    public $timestamps = true;            // Uses created_at & updated_at

    protected $fillable = [
        'businessName',
        'email',
        'password',
        'phone',
        'category',
        'websiteURL',
        'location',
        'description',
        'photos',
        'status',
        'verificationCode',
        'isVerified',
        'promoted',
    ];

    protected $casts = [
        'isVerified' => 'boolean',
        'promoted'   => 'boolean',
    ];
}
