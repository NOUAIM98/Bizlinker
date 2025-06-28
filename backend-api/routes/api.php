<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Service;
use App\Models\Business;

use App\Http\Controllers\Api\{
    AuthController,
    UserController,
    ServiceController,
    BusinessController,
    ReviewController,
    MessageController,
    FavoriteController,
    ServiceApplicationController,
    EventApplicationController,
    ReportController,
    ChatbotController
};

/* ─────────────────────────  PUBLIC ROUTES  ───────────────────────── */

Route::get('/ping', fn () => response()->json(['message' => 'pong']));

Route::get('/events', fn () => response()->json([
    'status' => 'ok',
    'data'   => Event::where('status', 'Approved')->get(),
]));

Route::get('/approved-services', fn () => response()->json([
    'status' => 'ok',
    'data'   => Service::where('status', 'approved')->get(),
]));

Route::get('/verified-businesses', fn () => response()->json([
    'status' => 'ok',
    'data'   => Business::where('isVerified', 1)->get(),
]));

// Public Business and Reviews
Route::get('/businesses',       [BusinessController::class, 'index']);
Route::get('/businesses/{id}',  [BusinessController::class, 'show']);
Route::post('/business-application', [BusinessController::class, 'store']);

Route::get('services/{id}/reviews',   [ReviewController::class, 'index']);
Route::get('events/{id}/reviews',     [ReviewController::class, 'eventReviews']);
Route::get('businesses/{id}/reviews', [ReviewController::class, 'businessReviews']);
Route::get('/{type}/{id}/all-reviews', [ReviewController::class, 'fullReviews']);

// Auth
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login',    [AuthController::class, 'login']);

// Chatbot (public for Expo Go access)
Route::post('chatbot', [ChatbotController::class, 'respond']);

/* ──────────────────────  PROTECTED ROUTES  ─────────────────────── */

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('/token-check', fn (Request $r) => response()->json([
        'status' => 'ok',
        'user'   => $r->user()
    ]));

    // Profile
    Route::get('me',               [UserController::class, 'me']);
    Route::put('profile',          [UserController::class, 'update']);
    Route::post('unlink',          [UserController::class, 'unlinkBusiness']);
    Route::post('change-password', [UserController::class, 'changePassword']);
    Route::post('upload-avatar',   [UserController::class, 'uploadAvatar']);
    Route::delete('delete-account',[UserController::class, 'deleteAccount']);

    // Services & Businesses
    Route::apiResource('services',   ServiceController::class)->only(['index','show']);
    Route::apiResource('businesses', BusinessController::class)->only(['index','show','update']);

    // Favorites
    Route::post('favorites', [FavoriteController::class, 'store']);
    Route::get('favorites',  [FavoriteController::class, 'list']);

    // Reviews
    Route::post('reviews',     [ReviewController::class, 'store']);
    Route::get('reviews/user', [ReviewController::class, 'userReviews']);

    // Messages
    Route::get('messages', [MessageController::class, 'index']);
    Route::post('messages',[MessageController::class, 'store']);

    // Applications
    Route::get('service-applications', [ServiceApplicationController::class, 'index']);
    Route::post('services/{id}/apply', [ServiceApplicationController::class, 'store']);
    Route::get('event-applications',   [EventApplicationController::class, 'index']);
    Route::post('events/{id}/apply',   [EventApplicationController::class, 'store']);

    // Reports
    Route::apiResource('reports', ReportController::class)->only(['index','store','update']);
});

/* ──────────────────────────  CORS PREFLIGHT  ───────────────────────── */

Route::options('/{any}', fn () => response()->json([], 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
)->where('any', '.*');
