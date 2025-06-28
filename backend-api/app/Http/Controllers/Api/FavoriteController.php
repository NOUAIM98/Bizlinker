<?php 
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function __invoke(Request $r){ $r->user()->favorites()->toggle($r->service_id); return ['ok'=>true]; }
    public function list(Request $r){ return $r->user()->favorites()->get(); }
}