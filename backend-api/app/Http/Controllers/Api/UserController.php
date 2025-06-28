<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function me(Request $request)
    { 
        return $request->user();
    }

    public function update(Request $request)
    {
        try {
            Log::info('Update Request:', $request->all());

            $request->validate([
                'firstName' => 'nullable|string|max:255',
                'lastName'  => 'nullable|string|max:255',
                'email'     => 'required|email|max:255',
                'phone'     => 'nullable|string|max:20',
            ]);

            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'User not found.'], 404);
            }

            $user->firstName = $request->input('firstName', $user->firstName);
            $user->lastName  = $request->input('lastName',  $user->lastName);
            $user->email     = $request->input('email',     $user->email);
            $user->phone     = $request->input('phone',     $user->phone);
            $user->save();

            return response()->json(['ok' => true]);
        } catch (\Throwable $e) {
            Log::error('Profile update failed: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function changePassword(Request $request)
    {
        try {
            $request->validate([
                'current_password'          => 'required',
                'new_password'              => 'required|min:6|confirmed',
                'new_password_confirmation' => 'required',
            ]);

            $user = $request->user();

            if (!Hash::check($request->current_password, $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['Current password is incorrect.'],
                ]);
            }

            $user->password = bcrypt($request->new_password);
            $user->save();

            return response()->json(['message' => 'Password updated successfully.']);
        } catch (\Throwable $e) {
            Log::error('Password update failed: ' . $e->getMessage());
            return response()->json(['error' => 'Password update failed.'], 500);
        }
    }

    public function uploadAvatar(Request $request)
    {
        try {
            $request->validate([
                'profilePicture' => 'required|image|max:2048',
            ]);

            $path = $request->file('profilePicture')->store('avatars', 'public');

            $user = $request->user();
            $user->profilePicture = $path;
            $user->save();

            return ['profilePicture' => asset('storage/' . $path)];
        } catch (\Throwable $e) {
            Log::error('Avatar upload failed: ' . $e->getMessage());
            return response()->json(['error' => 'Avatar upload failed.'], 500);
        }
    }

    public function deleteAccount(Request $request)
    {
        try {
            $user = $request->user();
            $user->delete();

            return response()->json(['message' => 'Account deleted successfully.']);
        } catch (\Throwable $e) {
            Log::error('Account deletion failed: ' . $e->getMessage());
            return response()->json(['error' => 'Account deletion failed.'], 500);
        }
    }

    public function unlinkBusiness(Request $request)
    {
        try {
            $user = $request->user();
            if ($user->linkedBusinessID) {
                $user->linkedBusiness()->update(['isVerified' => 0]);
                $user->update(['linkedBusinessID' => null]);
            }

            return ['ok' => true];
        } catch (\Throwable $e) {
            Log::error('Unlinking business failed: ' . $e->getMessage());
            return response()->json(['error' => 'Unlinking failed.'], 500);
        }
    }
}
