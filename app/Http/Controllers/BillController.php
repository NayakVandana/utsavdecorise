<?php

namespace App\Http\Controllers;

use App\Models\Bill;
use App\Models\BillItem;
use App\Models\ReceivePayment;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class BillController extends Controller
{
    public function index(Request $request)
    {
        $query = Bill::with(['items', 'termsConditions', 'receivePayments'])->whereNull('deleted_at');

        // Search functionality
        if ($request->has('search_keywords') && !empty($request->search_keywords)) {
            $search = $request->search_keywords;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('mobile', 'like', "%{$search}%")
                  ->orWhere('invoice_number', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        // Sorting and Pagination
        $perPage = $request->input('per_page', 10); // Default to 10 items per page
        $currentPage = $request->input('page', 1); // Default to page 1
        $bills = $query->orderBy('created_at', 'DESC')->paginate($perPage, ['*'], 'page', $currentPage);

        return response()->json($bills); // Return the paginated response directly
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
            'status' => 'required|string|in:pending', // Force initial status as pending
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_name' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'bill_copy' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'terms_condition_ids' => 'nullable|array',
            'terms_condition_ids.*' => 'exists:terms_conditions,id',
            'payment' => 'nullable|array', // Optional payment at creation
            'payment.amount' => 'required_with:payment|numeric|min:0.01',
            'payment.payment_type' => 'required_with:payment|string|in:advance,to_complete',
            'payment.mode_of_payment' => 'required_with:payment|string|in:cash,cheque,bank_transfer,upi',
            'payment.payment_date' => 'required_with:payment|date',
            'payment.notes' => 'nullable|string',
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
        $bill->calculateTotal(); // Update total_amount after adding items

        // Handle payment if provided
        if ($request->has('payment')) {
            $paymentData = $request->input('payment');
            $bill->receivePayments()->create([
                'amount' => $paymentData['amount'],
                'payment_type' => $paymentData['payment_type'],
                'mode_of_payment' => $paymentData['mode_of_payment'],
                'payment_date' => $paymentData['payment_date'],
                'status' => 'completed', // Assume payment is confirmed
                'notes' => $paymentData['notes'] ?? null,
            ]);
            $bill->updatePaymentStatus(); // Update status based on payment
        }

        if ($request->has('terms_condition_ids')) {
            $bill->termsConditions()->sync($validated['terms_condition_ids']);
        }

        return response()->json($bill->load(['items', 'termsConditions', 'receivePayments']), 201);
    }

    public function show($id)
    {
        $bill = Bill::with(['items', 'termsConditions', 'receivePayments'])->whereNull('deleted_at')->findOrFail($id);
        $bill->calculateTotal(); // Ensure total_amount is current
        $bill->updatePaymentStatus(); // Reflect payment status
        return response()->json($bill);
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
            $bill->items()->delete(); // Remove old items
            foreach ($validated['items'] as $item) {
                $bill->items()->create($item); // Add new items
            }
            $bill->calculateTotal(); // Recalculate total_amount
        }
        if ($request->has('terms_condition_ids')) {
            $bill->termsConditions()->sync($validated['terms_condition_ids']);
        }
        $bill->updatePaymentStatus(); // Ensure status reflects payments

        return response()->json($bill->load(['items', 'termsConditions', 'receivePayments']));
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
        $bill = Bill::with(['items', 'termsConditions', 'receivePayments'])->findOrFail($id);
        $bill->calculateTotal(); // Ensure total_amount is updated
        $bill->updatePaymentStatus(); // Reflect payment status

        // Debug: Log items and total
        Log::info("Bill data for ID: {$id}", [
            'items' => $bill->items ? $bill->items->toArray() : 'null',
            'total_amount' => $bill->total_amount,
            'payments' => $bill->receivePayments ? $bill->receivePayments->toArray() : 'null',
        ]);

        // Convert items to plain array for PDF
        $itemsArray = $bill->items ? $bill->items->map(function ($item) {
            return [
                'item_name' => $item->item_name,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'subtotal' => $item->subtotal,
            ];
        })->toArray() : [];

        $pdf = Pdf::loadView('pdf.bill', compact('bill', 'itemsArray'));
        return $pdf->download("bill_{$bill->id}.pdf");
    }

    public function addPayment(Request $request, $billId)
    {
        $bill = Bill::with('receivePayments')->whereNull('deleted_at')->findOrFail($billId);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01|max:' . $this->getPendingAmount($bill),
            'payment_type' => 'required|string|in:advance,to_complete',
            'mode_of_payment' => 'required|string|in:cash,cheque,bank_transfer,upi',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $payment = $bill->receivePayments()->create([
            'amount' => $validated['amount'],
            'payment_type' => $validated['payment_type'],
            'mode_of_payment' => $validated['mode_of_payment'],
            'payment_date' => $validated['payment_date'],
            'status' => 'completed', // Assume payment is confirmed
            'notes' => $validated['notes'],
        ]);

        $bill->updatePaymentStatus(); // Update bill status

        return response()->json([
            'payment' => $payment,
            'bill' => $bill->load('receivePayments'),
        ], 201);
    }


    private function getPendingAmount(Bill $bill)
    {
        $totalReceived = $bill->receivePayments()->sum('amount');
        return max(0, $bill->total_amount - $totalReceived);
    }

    public function getPayments($billId)
    {
        $bill = Bill::with('receivePayments')->whereNull('deleted_at')->findOrFail($billId);
        return response()->json($bill->receivePayments);
    }

    // Generate a PDF statement of received payments
    public function downloadPaymentStatement($billId)
    {
        $bill = Bill::with(['receivePayments', 'items'])->whereNull('deleted_at')->findOrFail($billId);

        $data = [
            'bill' => $bill,
            'payments' => $bill->receivePayments,
            'total_amount' => $bill->total_amount,
            'total_received' => $bill->receivePayments->sum('amount'),
            'pending_amount' => max(0, $bill->total_amount - $bill->receivePayments->sum('amount')),
        ];

        $pdf = Pdf::loadView('pdf.payment_statement', $data);
        return $pdf->download('payment_statement_bill_' . $bill->invoice_number . '.pdf');
    }

    public function allPayments()
    {
        $payments = ReceivePayment::with('bill')->get();
        return response()->json($payments);
    }

   

    
}