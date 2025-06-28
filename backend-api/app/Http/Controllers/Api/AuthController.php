<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $r)
    {
        $r->validate([
            'first_name' => 'required',
            'last_name'  => 'required',
            'email'      => 'required|email|unique:user,email',
            'password'   => 'required|min:6',
        ]);

        try {
            $user = User::create([
                'firstName' => $r->first_name,
                'lastName'  => $r->last_name,
                'email'     => $r->email,
                'password'  => Hash::make($r->password),
            ]);

            return response()->json([
                'token' => $user->createToken('mobile')->plainTextToken,
                'user'  => $user,
            ]);
        } catch (\Exception $e) {
            Log::error('Register failed: ' . $e->getMessage());
            return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
        }
    }
public function login(Request $r)
{
    try {
        $r->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $r->email)->first();

        if (!$user || !Hash::check($r->password, $user->password)) {
            return response(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'token' => $user->createToken('mobile')->plainTextToken,
            'user'  => $user,
        ]);
    } catch (\Exception $e) {
        return response([
            'message' => 'Server error',
            'error'   => $e->getMessage(),
        ], 500);
    }
}


    public function logout(Request $r)
    {
        $r->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
