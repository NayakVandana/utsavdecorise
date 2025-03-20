<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\BillItem;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
class BillController extends Controller
{
    public function index()
    {
        return response()->json(Bill::with(['items', 'termsConditions'])->whereNull('deleted_at')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'mobile' => 'required|string|max:20',
            'address' => 'required|string',
            'invoice_number' => 'required|string|unique:bills,invoice_number|max:255',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after_or_equal:issue_date',
            'status' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_name' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'bill_copy' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'terms_condition_ids' => 'nullable|array',
            'terms_condition_ids.*' => 'exists:terms_conditions,id',
        ]);

        $billData = $request->only([
            'name', 'email', 'mobile', 'address', 'invoice_number',
            'issue_date', 'due_date', 'status', 'notes'
        ]);

        if ($request->hasFile('bill_copy')) {
            $file = $request->file('bill_copy');
            $filename = $file->getClientOriginalName();
            $file->move(public_path('photos'), $filename);
            $billData['bill_copy'] = '/photos/' . $filename;
        }

        $bill = Bill::create($billData);
        foreach ($validated['items'] as $item) {
            $bill->items()->create($item);
        }
        $bill->calculateTotal();

        if ($request->has('terms_condition_ids')) {
            $bill->termsConditions()->sync($validated['terms_condition_ids']);
        }

        return response()->json($bill->load(['items', 'termsConditions']), 201);
    }

    public function show($id)
    {
        return response()->json(Bill::with(['items', 'termsConditions'])->whereNull('deleted_at')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $bill = Bill::whereNull('deleted_at')->findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'mobile' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'invoice_number' => 'sometimes|string|unique:bills,invoice_number,' . $bill->id . '|max:255',
            'issue_date' => 'sometimes|date',
            'due_date' => 'sometimes|date|after_or_equal:issue_date',
            'status' => 'sometimes|string|max:255',
            'notes' => 'nullable|string',
            'items' => 'sometimes|array|min:1',
            'items.*.item_name' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'bill_copy' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'terms_condition_ids' => 'nullable|array',
            'terms_condition_ids.*' => 'exists:terms_conditions,id',
        ]);

        $billData = $request->only([
            'name', 'email', 'mobile', 'address', 'invoice_number',
            'issue_date', 'due_date', 'status', 'notes'
        ]);

        if ($request->hasFile('bill_copy')) {
            if ($bill->bill_copy && file_exists(public_path($bill->bill_copy))) {
                unlink(public_path($bill->bill_copy));
            }
            $file = $request->file('bill_copy');
            $filename = $file->getClientOriginalName();
            $file->move(public_path('photos'), $filename);
            $billData['bill_copy'] = '/photos/' . $filename;
        }

        $bill->update($billData);
        if ($request->has('items')) {
            $bill->items()->delete();
            foreach ($validated['items'] as $item) {
                $bill->items()->create($item);
            }
            $bill->calculateTotal();
        }
        if ($request->has('terms_condition_ids')) {
            $bill->termsConditions()->sync($validated['terms_condition_ids']);
        }

        return response()->json($bill->load(['items', 'termsConditions']));
    }

    public function destroy($id)
    {
        $bill = Bill::whereNull('deleted_at')->findOrFail($id);
        if ($bill->bill_copy && file_exists(public_path($bill->bill_copy))) {
            unlink(public_path($bill->bill_copy));
        }
        $bill->delete();
        return response()->json(null, 204);
    }
    public function downloadPdf($id)
    {
        $bill = Bill::with(['items', 'termsConditions'])->findOrFail($id);
        return response()->json($bill , 200);
        dd( $bill);
        $bill->calculateTotal(); // Updates total_amount based on BillItem records

        // Ensure $bill->items is always a collection, even if no items exist
        if (is_null($bill->items)) {
            $bill->setRelation('items', collect([]));
        }

        // Optional: Debug to verify items
        // dd($bill->items->toArray());

        $pdf = PDF::loadView('pdf.bill', compact('bill'));
        return $pdf->download("bill_{$bill->id}.pdf");
    }


}