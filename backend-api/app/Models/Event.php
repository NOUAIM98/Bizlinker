<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'event';
    protected $primaryKey = 'eventID';
    public $timestamps = false;

    protected $fillable = [
        'organizerID',
        'eventName',
        'eventDate',
        'eventDescription',
        'ticketType',
        'ticketPrice',
        'totalTickets',
        'facebook',
        'instagram',
        'otherPlatforms',
        'photos',
        'eventTime',
        'category',
        'websiteURL',
        'email',
        'phone',
        'address',
        'status'
    ];
}
