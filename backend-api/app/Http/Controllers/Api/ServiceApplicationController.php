<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ServiceApplication;

class ServiceApplicationController extends Controller
{
    public function index(Request $request)
    {
        $apps = ServiceApplication::with('service')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($apps);
    }

    public function store(Request $request, $serviceId)
    {
        $validated = $request->validate([
            'application_data' => 'required|array',
        ]);

        $app = ServiceApplication::create([
            'user_id'          => $request->user()->id,
            'service_id'       => $serviceId,
            'application_data' => $validated['application_data'],
        ]);

        return response()->json($app, 201);
    }
}
