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
        return response()->json(Bill::with('items')->whereNull('deleted_at')->get());
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
        ]);

        $bill = Bill::create($validated);
        foreach ($validated['items'] as $item) {
            $bill->items()->create($item);
        }
        $bill->calculateTotal();

        return response()->json($bill->load('items'), 201);
    }

    public function show($id)
    {
        return response()->json(Bill::with('items')->whereNull('deleted_at')->findOrFail($id));
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
        ]);

        $bill->update($validated);
        if ($request->has('items')) {
            $bill->items()->delete(); // Soft delete items
            foreach ($validated['items'] as $item) {
                $bill->items()->create($item);
            }
            $bill->calculateTotal();
        }

        return response()->json($bill->load('items'));
    }

    public function destroy($id)
    {
        $bill = Bill::whereNull('deleted_at')->findOrFail($id);
        $bill->delete(); // Soft delete
        return response()->json(null, 204);
    }

    // public function downloadPdf($id)
    // {
    //     $bill = Bill::with('items')->whereNull('deleted_at')->findOrFail($id);
    //     $pdf = PDF::loadView('pdf.bill', compact('bill'));
    //     return $pdf->download("invoice_{$bill->invoice_number}.pdf");
    // }


    public function downloadPdf($id)
    {
        $bill = Bill::findOrFail($id); // Fetch the bill
        $pdf = Pdf::loadView('pdf.bill', compact('bill')); // Load the view with bill data
        return $pdf->download("bill_{$bill->id}.pdf"); // Trigger download
    }
}