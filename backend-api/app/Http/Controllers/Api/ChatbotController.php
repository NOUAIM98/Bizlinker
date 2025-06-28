<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatbotController extends Controller
{
    public function respond(Request $request)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        $userMessage = $request->input('message');

      $apiKey = env('OPENAI_API_KEY');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => "You are Nova, the multilingual AI assistant for BizLinker — a platform where businesses, events, and service providers can list their offerings for visibility and promotion.

You automatically detect and respond in the user's language.

If someone wants to list a business, direct them to: http://localhost:3000/business-application-form
If they want to list a service, direct them to: http://localhost:3000/service-application-form
If they want to post an event, direct them to: http://localhost:3000/event-application-form

If a user asks to speak with a real person, give them this contact info:
Email: help@bizlinker.com
Phone: +1-312-841-8827 (Toll Free)

Only help with questions related to the BizLinker platform."
                ],
                [
                    'role' => 'user',
                    'content' => $userMessage
                ]
            ]
        ]);

        $reply = $response->json()['choices'][0]['message']['content'] ?? "Sorry, I couldn't respond.";

        return response()->json(['reply' => $reply]);
    }
}
