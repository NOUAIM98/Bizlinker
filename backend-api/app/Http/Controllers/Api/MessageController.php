<?php // MessageController.php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $r){ return $r->user()->messages()->latest()->get(); }
    public function store(Request $r){
        Message::create(['fromID'=>$r->user()->userID,'toID'=>$r->to_id,'content'=>$r->content]);
        return ['ok'=>true];
    }
}