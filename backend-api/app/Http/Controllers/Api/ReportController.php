<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportRequest;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;   // <─ add this

class ReportController extends Controller
{
    /*--------------------------------------------------------------
    | List the current user’s reports
    | GET /api/reports
    --------------------------------------------------------------*/
    public function index(Request $request)
    {
        return Report::where('reportedBy', $request->user()->id)
                     ->latest('created_at')
                     ->get();
    }

    /*--------------------------------------------------------------
    | Store a new report (legacy-table columns)
    | POST /api/reports
    --------------------------------------------------------------*/
    public function store(StoreReportRequest $request)
{
    /* convert UI choice -> DB enum */
    $dbType = [
        'Restaurant'        => 'business',
        'Event'             => 'event',
        'Freelance Service' => 'service',
        'Business'          => 'business',
    ][$request->targetType] ?? 'other';

    $row = Report::create([
        'reportedBy' => $request->user()->id,
        'targetName' => $request->targetName,
        'details'    => $request->details,
        'issue'      => $request->issue,
        'targetType' => $dbType,          // ← enum value that MySQL accepts
        'status'     => 'Under Review',
    ]);

    return response()->json($row, 201);
}
    /*--------------------------------------------------------------
    | Update status — only owner or admin
    | PATCH /api/reports/{report}
    --------------------------------------------------------------*/
    public function update(Request $request, Report $report)
    {
        $this->authorize('update', $report);

        $report->update(
            $request->validate([
                'status' => 'required|in:Pending,In Progress,Resolved',
            ])
        );

        return $report;
    }
}
