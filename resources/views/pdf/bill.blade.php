<!DOCTYPE html>
<html>
<head>
    <title>Invoice {{ $bill->invoice_number }}</title>
    <meta charset="UTF-8">
    <style>
        /* General Styles */
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
            line-height: 1.5;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }
        .header h1 {
            font-size: 28px;
            font-weight: bold;
            color: #007bff;
            margin: 0;
        }
        .header h2 {
            font-size: 20px;
            font-weight: normal;
            color: #555;
            margin: 5px 0 0;
        }
        .details {
            margin-bottom: 30px;
        }
        .details p {
            margin: 5px 0;
            font-size: 14px;
        }
        .details strong {
            font-weight: bold;
            color: #444;
            display: inline-block;
            width: 120px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
            font-size: 14px;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
            color: #333;
        }
        td {
            vertical-align: top;
        }
        tr:nth-child(even) {
            background-color: #fafafa;
        }
        .total {
            font-weight: bold;
            text-align: right;
            font-size: 16px;
            margin-top: 10px;
            color: #007bff;
        }
        .terms {
            margin-top: 30px;
            border-top: 1px dashed #ddd;
            padding-top: 20px;
        }
        .terms h3 {
            font-size: 18px;
            font-weight: bold;
            color: #444;
            margin-bottom: 10px;
        }
        .terms ul {
            list-style-type: disc;
            padding-left: 20px;
            font-size: 14px;
            color: #555;
        }
        .terms li {
            margin-bottom: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: #777;
        }
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
        <p><strong>Status:</strong> {{ ucfirst($bill->status) }}</p>
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
            @forelse($bill->items ?? [] as $item)
                <tr>
                    <td>{{ $item->item_name }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>${{ number_format($item->price, 2) }}</td>
                    <td>${{ number_format($item->subtotal, 2) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" style="text-align: center;">No items added</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <p class="total">Total Amount: ${{ number_format($bill->total_amount, 2) }}</p>

    @if($bill->termsConditions->isNotEmpty())
        <div class="terms">
            <h3>Terms and Conditions</h3>
            <ul>
                @foreach($bill->termsConditions as $term)
                    <li>{{ $term->content }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="footer">
        <p>Thank you for your business! | Utsav Decorise | Contact: info@utsavdecorise.com</p>
    </div>
</body>
</html>