<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Documents\DocumentsCategory;
use App\Models\Documents\DocumentsEntry;
use App\Models\Documents\DocumentsTag;
use App\Models\Documents\DocumentsType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{

    // ========================================================================================== Public Document
    public function index(Request $request)
    {
        $search = $request->input('search');
        $categoryId = $request->input('category_id');
        $typeId = $request->input('type_id');
        $year = $request->input('year');
        $tag = $request->input('tag');

        $entries = DocumentsEntry::query()
            ->with(['type:id,name,category_id', 'type.category:id,name', 'tags:id,name,slug'])
            ->when($search, function ($q) use ($search) {
                $needle = mb_strtolower($search);
                $q->where(function ($inner) use ($needle) {
                    $inner->whereRaw('LOWER(title) LIKE ?', ["%{$needle}%"]) // title
                        ->orWhereRaw('LOWER(description) LIKE ?', ["%{$needle}%"]) // description
                        ->orWhereRaw('LOWER(document_number) LIKE ?', ["%{$needle}%"]); // doc number
                });
            })
            ->when($categoryId, function ($q) use ($categoryId) {
                $q->whereHas('type', function ($tq) use ($categoryId) {
                    $tq->where('category_id', $categoryId);
                });
            })
            ->when($typeId, fn($q) => $q->where('type_id', $typeId))
            ->when($year, fn($q) => $q->where('year', $year))
            ->when($tag, function ($q) use ($tag) {
                $q->whereHas('tags', function ($tq) use ($tag) {
                    $tq->where('slug', $tag)->orWhere('name', $tag);
                });
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $categories = DocumentsCategory::select('id', 'name')->orderBy('name')->get();
        $types = DocumentsType::select('id', 'name', 'category_id')->orderBy('name')->get();
        $tags = DocumentsTag::select('id', 'name', 'slug')->orderBy('name')->get();

        return Inertia::render('Documents/Index', [
            'entries' => $entries,
            'filters' => [
                'search' => $search,
                'category_id' => $categoryId,
                'type_id' => $typeId,
                'year' => $year,
                'tag' => $tag,
            ],
            'categories' => $categories,
            'types' => $types,
            'tags' => $tags,
        ]);
    }

    public function show($id)
    {
        $entry = DocumentsEntry::findOrFail($id);
        $entry->load(['type.category', 'tags']);

        return Inertia::render('Documents/Show', [
            'entry' => [
                'id' => $entry->id,
                'title' => $entry->title,
                'document_number' => $entry->document_number,
                'year' => $entry->year,
                'description' => $entry->description,
                'file_path' => $entry->file_path,
                'type' => [
                    'id' => $entry->type->id,
                    'name' => $entry->type->name,
                    'category' => [
                        'id' => $entry->type->category->id,
                        'name' => $entry->type->category->name,
                    ],
                ],
                'tags' => $entry->tags->map(fn($t) => ['id' => $t->id, 'name' => $t->name, 'slug' => $t->slug])->values(),
            ],
        ]);
    }
}
