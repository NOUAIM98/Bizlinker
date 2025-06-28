<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;
use App\Models\Service;
use App\Models\Event;
use App\Models\Business;

class Review extends Model
{
    protected $table = 'feedback'; // ✅ Table name is correct
    protected $primaryKey = 'feedbackID'; // ✅ Primary key
    public $timestamps = false;

    protected $fillable = [
        'reviewerID',      // ✅ Correct column name for user FK
        'serviceID',
        'eventID',
        'businessID',
        'rating',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
        'comment' => 'string',
    ];

    // ✅ Review belongs to a User (linked via reviewerID)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewerID', 'userID');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'serviceID');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'eventID');
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class, 'businessID');
    }
}
