<?php

    namespace App\Http\Controllers\Api;

    use App\Http\Controllers\Controller;
    use App\Models\Event;

    class EventController extends Controller
    {
        public function index()
        {
            return response()->json(Event::paginate(20));
        }

        public function show($id)
        {
            return response()->json(Event::findOrFail($id));
        }
    }
