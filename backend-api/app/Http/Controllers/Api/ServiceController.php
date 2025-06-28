<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;



class ServiceController extends Controller
{
    // If you want the JsonResponse return type, import it; otherwise omit ": JsonResponse"
    public function index(): JsonResponse
    {
        // Removed named argument; just pass the data directly
        return response()->json(Service::paginate(20));
    }

    public function getApprovedServices(): JsonResponse
    {
        $approvedServices = Service::where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($approvedServices);
    }


    public function show($id): JsonResponse
    {
        return response()->json(Service::findOrFail($id));
    }
}