<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EventApplication;

class EventApplicationController extends Controller
{
    public function index(Request $request)
    {
        $apps = EventApplication::with('event')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($apps);
    }

    public function store(Request $request, $eventId)
    {
        $validated = $request->validate([
            'application_data' => 'required|array',
        ]);

        $app = EventApplication::create([
            'user_id'          => $request->user()->id,
            'event_id'         => $eventId,
            'application_data' => $validated['application_data'],
        ]);

        return response()->json($app, 201);
    }
}
