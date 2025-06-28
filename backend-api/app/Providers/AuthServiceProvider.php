<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }
protected $policies = [
    \App\Models\Report::class => \App\Policies\ReportPolicy::class,
];
    public function boot(): void
    {
        //
    }
}
