<?php

namespace App\Policies;

use App\Models\Report;
use App\Models\User;

class ReportPolicy
{
    public function update(User $user, Report $report): bool
    {
        return $user->role === 'admin' || $user->id === $report->user_id;
    }
}
