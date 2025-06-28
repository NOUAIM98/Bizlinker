<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// app/Models/Report.php
class Report extends Model
{
    protected $table = 'reports';        // same table
    protected $primaryKey = 'reportID';  // legacy PK

    protected $fillable = [
        'reportedBy',     // user_id
        'targetType',     // Restaurant / Event …
        'targetName',     // short title
        'issue',          // Customer Experience / Pricing …
        'details',        // long description
        'status',         // default: Under Review
    ];

   public $timestamps = true;
   const UPDATED_AT = null;          // table has only created_at

    /** link to User model */
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reportedBy');
    }
}
