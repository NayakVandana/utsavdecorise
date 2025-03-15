<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
class Photo extends Model
{
    protected $fillable = ['title', 'path', 'category'];
    protected $appends = ['path'];

    public function getPathAttribute($value)
    {
        $rawPath = $this->getRawOriginal('path');
        Log::info('Photo path transformed', ['original' => $rawPath, 'full' => $rawPath]);
        return $rawPath; // Return relative path directly (e.g., /photos/...)
    }
}