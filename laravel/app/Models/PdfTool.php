<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PdfTool extends Model
{
    protected $fillable = [
        'tool_id',
        'name',
        'category',
        'description',
        'is_active',
        'usages_count'
    ];

    /**
     * Increment usage count for analytics
     */
    public function incrementUsage()
    {
        $this->increment('usages_count');
    }
}
