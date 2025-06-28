<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Business;
use Illuminate\Support\Facades\Log;

class BusinessController extends Controller
{
    // ✅ Get all verified businesses with pagination
    public function index()
    {
        return Business::where('isVerified', 1)->paginate(20);
    }

    // ✅ Get a specific verified business by ID
    public function show($id)
    {
        return Business::where('isVerified', 1)->findOrFail($id);
    }

    // ✅ Store new business application
    public function store(Request $request)
    {
        // Log and return sample response for now
        Log::info('Business Application Submitted:', $request->all());

        return response()->json(['message' => 'Business application received!'], 200);
    }

    // ✅ Update existing business
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'businessName' => 'required|string|max:255',
            'email'        => 'required|email',
            'phone'        => 'required|string|max:20',
            'websiteURL'   => 'nullable|url|max:255',
            'location'     => 'nullable|string|max:255',
            'description'  => 'nullable|string',
            'photos'       => 'nullable|string',
            'isVerified'   => 'required|boolean',
        ]);

        $business = Business::findOrFail($id);
        $business->update($data);

        return response()->json($business, 200);
    }
}
