<?php
namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string',
            'message' => 'required|string'
        ]);

        $inquiry = Inquiry::create($request->all());
        return response()->json(['success' => true, 'message' => 'Inquiry submitted'], 201);
    }

    public function index()
    {
        $inquiries = Inquiry::all();
        return response()->json(['success' => true, 'data' => $inquiries]);
    }

    
}