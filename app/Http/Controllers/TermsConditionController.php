<?php

namespace App\Http\Controllers;

use App\Models\TermsCondition;
use Illuminate\Http\Request;

class TermsConditionController extends Controller
{
    public function index()
    {
        return response()->json(TermsCondition::whereNull('deleted_at')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $terms = TermsCondition::create($validated);
        return response()->json($terms, 201);
    }

    public function show($id)
    {
        return response()->json(TermsCondition::whereNull('deleted_at')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $terms = TermsCondition::whereNull('deleted_at')->findOrFail($id);
        $validated = $request->validate([
            'content' => 'sometimes|string',
        ]);

        $terms->update($validated);
        return response()->json($terms);
    }

    public function destroy($id)
    {
        $terms = TermsCondition::whereNull('deleted_at')->findOrFail($id);
        $terms->delete();
        return response()->json(null, 204);
    }
}