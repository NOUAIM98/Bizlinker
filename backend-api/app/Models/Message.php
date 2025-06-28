<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table      = 'message';
    public    $timestamps = true;   

    protected $fillable = ['fromID','toID','content'];

    public function sender()
    {
        return $this->belongsTo(User::class, 'fromID');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'toID');
    }
}
