<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review; // ✅ Correct model name

class ReviewController extends Controller
{
  // List service reviews
  public function index(Request $request, $id)
  {
    return response()->json(
      Review::where('serviceID', $id)
        ->with('user')
        ->get()
    );
  }

  // List event reviews
  public function eventReviews(Request $request, $id)
  {
    return response()->json(
      Review::where('eventID', $id)
        ->with('user')
        ->get()
    );
  }

  // List business reviews
  public function businessReviews(Request $request, $id)
  {
    return response()->json(
      Review::where('businessID', $id)
        ->with('user')
        ->get()
    );
  }

  // Create a review (service/event/business)
  public function store(Request $request)
  {
    $data = $request->validate([
      'type' => 'required|in:service,event,business',
      'type_id' => 'required|integer',
      'rating' => 'required|integer|min:1|max:5',
      'comment' => 'nullable|string',
    ]);

    $fieldMap = [
      'service' => 'serviceID',
      'event' => 'eventID',
      'business' => 'businessID',
    ];

    $field = $fieldMap[$data['type']];

    $review = Review::create([
      'reviewerID' => $request->user()->userID,
      $field => $data['type_id'],
      'rating' => $data['rating'],
      'comment' => $data['comment'] ?? '',
    ]);

    return response()->json($review->load('user'), 201);
  }

  // List all reviews by the authenticated user
  public function userReviews(Request $request)
  {
    return response()->json(
      Review::where('reviewerID', $request->user()->userID)
        ->with(['service', 'event', 'business'])
        ->get()
    );
  }
}
