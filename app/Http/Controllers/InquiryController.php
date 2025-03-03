<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\Request;

class InquiryController extends Controller {
    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        Inquiry::create($request->all());
        return response()->json(['message' => 'Inquiry saved'], 201);
    }

    public function index() {
        return Inquiry::all();
    }
}