<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatLearningData extends Model
{
    // use HasFactory;

    protected $table = 'chat_learning_data';

    protected $fillable = [
        'session_id',
        'user_ip',
        'conversation',
        'message_count',
        'started_at',
        'ended_at',
        'is_processed',
        'satisfaction_rating',
        'feedback',
        'metadata',
    ];

    protected $casts = [
        'conversation' => 'array',
        'metadata' => 'array',
        'is_processed' => 'boolean',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    /**
     * Scope untuk data yang belum diproses
     */
    public function scopeUnprocessed($query)
    {
        return $query->where('is_processed', false);
    }

    /**
     * Scope untuk data dengan rating tertentu
     */
    public function scopeWithRating($query, $rating)
    {
        return $query->where('satisfaction_rating', $rating);
    }

    /**
     * Mark as processed
     */
    public function markAsProcessed()
    {
        $this->update(['is_processed' => true]);
    }
}
