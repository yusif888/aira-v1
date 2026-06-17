<?php

namespace App\Models\Documents;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class DocumentsEntry extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'documents_entries';

    protected $fillable = [
        'type_id',
        'title',
        'document_number',
        'year',
        'description',
        'file_path',
        'uploader_id',
    ];

    protected $casts = [
        'year' => 'integer',
    ];

    public function getRouteKeyName()
    {
        return 'id';
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(DocumentsType::class, 'type_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(DocumentsTag::class, 'document_entry_tag', 'document_entry_id', 'tag_id');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'uploader_id');
    }
}
