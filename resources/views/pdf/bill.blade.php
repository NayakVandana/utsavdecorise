<!DOCTYPE html>
<html>
<head>
    <title>Invoice {{ $bill->invoice_number }}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .details { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total { font-weight: bold; text-align: right; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Utsav Decorise</h1>
        <h2>Invoice {{ $bill->invoice_number }}</h2>
    </div>

    <div class="details">
        <p><strong>Name:</strong> {{ $bill->name }}</p>
        <p><strong>Email:</strong> {{ $bill->email }}</p>
        <p><strong>Mobile:</strong> {{ $bill->mobile }}</p>
        <p><strong>Address:</strong> {{ $bill->address }}</p>
        <p><strong>Issue Date:</strong> {{ $bill->issue_date->format('Y-m-d H:i') }}</p>
        <p><strong>Due Date:</strong> {{ $bill->due_date->format('Y-m-d H:i') }}</p>
        <p><strong>Status:</strong> {{ $bill->status }}</p>
        @if($bill->notes)
            <p><strong>Notes:</strong> {{ $bill->notes }}</p>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($bill->items as $item)
                <tr>
                    <td>{{ $item->item_name }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>${{ number_format($item->price, 2) }}</td>
                    <td>${{ number_format($item->subtotal, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p class="total">Total Amount: ${{ number_format($bill->total_amount, 2) }}</p>
</body>
</html>