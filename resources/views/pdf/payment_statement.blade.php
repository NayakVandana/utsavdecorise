<!DOCTYPE html>
<html>
<head>
    <title>Payment Statement - {{ $bill->invoice_number }}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .summary { margin-top: 20px; }
    </style>
</head>
<body>
    <h1>Payment Statement for Bill #{{ $bill->invoice_number }}</h1>
    <p><strong>Customer:</strong> {{ $bill->name }}</p>
    <p><strong>Total Amount:</strong> ${{ number_format($total_amount, 2) }}</p>
    <p><strong>Total Received:</strong> ${{ number_format($total_received, 2) }}</p>
    <p><strong>Pending Amount:</strong> ${{ number_format($pending_amount, 2) }}</p>

    <h2>Received Payments</h2>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Mode</th>
                <th>Notes</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($payments as $payment)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($payment->payment_date)->format('Y-m-d H:i') }}</td>
                    <td>${{ number_format($payment->amount, 2) }}</td>
                    <td>{{ ucfirst($payment->payment_type) }}</td>
                    <td>{{ ucfirst(str_replace('_', ' ', $payment->mode_of_payment)) }}</td>
                    <td>{{ $payment->notes ?? 'N/A' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5">No payments received yet.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>