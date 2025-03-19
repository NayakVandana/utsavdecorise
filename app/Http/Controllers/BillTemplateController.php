<?php

namespace App\Http\Controllers;

use App\Models\BillTemplate;
use Illuminate\Http\Request;

class BillTemplateController extends Controller
{
    public function index()
    {
        return response()->json(BillTemplate::whereNull('deleted_at')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'template_name' => 'required|string|unique:bill_templates,template_name|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'mobile' => 'required|string|max:20',
            'address' => 'required|string',
            'invoice_number' => 'required|string|max:255',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'status' => 'required|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.item_name' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $validated['total_amount'] = array_sum(array_map(fn($item) => $item['quantity'] * $item['price'], $validated['items']));
        $template = BillTemplate::create($validated);
        return response()->json($template, 201);
    }

    public function show($id)
    {
        return response()->json(BillTemplate::whereNull('deleted_at')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $template = BillTemplate::whereNull('deleted_at')->findOrFail($id);
        $validated = $request->validate([
            'template_name' => 'sometimes|string|unique:bill_templates,template_name,' . $template->id . '|max:255',
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'mobile' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'invoice_number' => 'sometimes|string|max:255',
            'issue_date' => 'sometimes|date',
            'due_date' => 'sometimes|date|after_or_equal:issue_date',
            'status' => 'sometimes|string|max:255',
            'items' => 'sometimes|array|min:1',
            'items.*.item_name' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        if ($request->has('items')) {
            $validated['total_amount'] = array_sum(array_map(fn($item) => $item['quantity'] * $item['price'], $validated['items']));
        }
        $template->update($validated);
        return response()->json($template);
    }

    public function destroy($id)
    {
        $template = BillTemplate::whereNull('deleted_at')->findOrFail($id);
        $template->delete(); // Soft delete
        return response()->json(null, 204);
    }
}