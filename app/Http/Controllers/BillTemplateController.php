<?php

namespace App\Http\Controllers;

use App\Models\BillTemplate;
use App\Models\BillItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class BillTemplateController extends Controller
{
    public function index()
    {
        return response()->json(BillTemplate::with(['items', 'termsConditions'])->whereNull('deleted_at')->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'template_name' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'mobile' => 'required|string|max:15',
            'address' => 'required|string',
            'invoice_number' => 'required|string|max:255',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'status' => 'required|in:pending,paid,overdue',
            'items' => 'required|json', // Expect items as JSON string
            'terms_condition_ids' => 'nullable|array',
            'terms_condition_ids.*' => 'exists:terms_conditions,id',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $billTemplate = BillTemplate::create([
            'template_name' => $request->template_name,
            'name' => $request->name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'address' => $request->address,
            'invoice_number' => $request->invoice_number,
            'issue_date' => $request->issue_date,
            'due_date' => $request->due_date,
            'status' => $request->status,
            'items' => $request->items, // Store as JSON
            'notes' => $request->notes,
        ]);

        if ($request->has('terms_condition_ids')) {
            $billTemplate->termsConditions()->sync($request->terms_condition_ids);
        }

        return response()->json($billTemplate, 201);
    }

    public function show($id)
    {
        return response()->json(BillTemplate::with(['items', 'termsConditions'])->whereNull('deleted_at')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $billTemplate = BillTemplate::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'template_name' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'mobile' => 'required|string|max:15',
            'address' => 'required|string',
            'invoice_number' => 'required|string|max:255',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'status' => 'required|in:pending,paid,overdue',
            'items' => 'required|json',
            'terms_condition_ids' => 'nullable|array',
            'terms_condition_ids.*' => 'exists:terms_conditions,id',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $billTemplate->update([
            'template_name' => $request->template_name,
            'name' => $request->name,
            'email' => $request->email,
            'mobile' => $request->mobile,
            'address' => $request->address,
            'invoice_number' => $request->invoice_number,
            'issue_date' => $request->issue_date,
            'due_date' => $request->due_date,
            'status' => $request->status,
            'items' => $request->items, // Update as JSON
            'notes' => $request->notes,
        ]);

        if ($request->has('terms_condition_ids')) {
            $billTemplate->termsConditions()->sync($request->terms_condition_ids);
        }

        return response()->json($billTemplate, 200);
    }

    public function destroy($id)
    {
        $template = BillTemplate::whereNull('deleted_at')->findOrFail($id);
        $template->delete();
        return response()->json(null, 204);
    }
}