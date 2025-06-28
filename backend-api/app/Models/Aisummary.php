<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiSummary extends Model
{
    protected $table = 'aisummary'; // adjust if your table name is different
    protected $primaryKey = 'id'; // or whatever your primary key is

    protected $fillable = [
        'businessID',
        'eventID',
        'serviceID',
        'summary',
        'lastReviewCount',
        'updated_at'
    ];

    public $timestamps = false; // if your table doesn’t use created_at/updated_at
}
