<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use App\Models\AiSummary;
class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'user';
    protected $primaryKey = 'userID';

    protected $fillable = [
        'firstName',
        'lastName',
        'email',
        'password',
        'phone',
        'profilePicture',
        'linkedBusinessID',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function favorites()
    {
        return $this->belongsToMany(Service::class, 'favorite', 'userID', 'serviceID');
    }

    public function linkedBusiness()
    {
        return $this->hasOne(Business::class, 'ownerID', 'linkedBusinessID');
    }
    public function reports()
    {
    return $this->hasMany(\App\Models\Report::class);
   }
    public function messages()
    {
        return $this->hasMany(Message::class, 'fromID');
    }
}
