<?php
namespace App\Http\Controllers;

use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->query('category');
        $query = Photo::query();

        if ($category) {
            $query->where('category', $category);
        }

        $photos = $query->get();
        return response()->json(['success' => true, 'data' => $photos]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|in:Management,Marriage,Birthday',
            'image' => 'required|image|max:2048', // Max 2MB
        ]);

        // Store directly in public/photos/
        $file = $request->file('image');
        $filename = $file->getClientOriginalName(); // Or use a unique name if preferred
        $file->move(public_path('photos'), $filename);
        $path = '/photos/' . $filename;

        Log::info('Photo uploaded', ['path' => $path]);

        $photo = Photo::create([
            'title' => $request->title,
            'path' => $path,
            'category' => $request->category,
        ]);

        return response()->json(['success' => true, 'data' => $photo], 201);
    }
}