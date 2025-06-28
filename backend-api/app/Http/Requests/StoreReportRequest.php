<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool { return true; }

   public function rules(): array
{
    return [
        'targetName'  => 'required|min:5',                     // title
        'details'     => 'required|min:10',                    // description
        'issue'       => 'required|in:Customer Experience,Pricing,Staff Conduct,Other',
        'targetType'  => 'required|in:Restaurant,Event,Freelance Service,Business',
    ];
}
}
