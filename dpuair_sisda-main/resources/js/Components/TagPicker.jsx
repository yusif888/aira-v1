import { useState } from "react";
import RequiredInputLabel from "./RequiredInputLabel";
import InputError from "./InputError";

export default function TagPicker({ 
    label = "Tags", 
    required = true, 
    tags = [], 
    selectedTags = [], 
    onTagsChange, 
    validationErrors = {}, 
    errors = {}, 
    className = "" 
}) {
    const [localValidationErrors, setLocalValidationErrors] = useState({});

    // Helper function untuk mendapatkan tag yang dipilih
    const getCurrentTags = () => {
        if (!selectedTags || selectedTags.length === 0) return [];
        if (!tags || !Array.isArray(tags)) return [];
        
        return tags.filter((tag) => {
            const tagId = String(tag.id);
            return selectedTags.includes(tagId);
        });
    };

    const currentTags = getCurrentTags();

    const handleAddTag = (e) => {
        if (e.target.value && !selectedTags.includes(e.target.value)) {
            onTagsChange([...selectedTags, e.target.value]);
            e.target.value = '';
        }
    };

    const handleRemoveTag = (tagId) => {
        const newTags = selectedTags.filter(id => id !== String(tagId));
        onTagsChange(newTags);
        
        // Clear validation error
        if (validationErrors.tags || localValidationErrors.tags) {
            setLocalValidationErrors(prev => ({
                ...prev,
                tags: null
            }));
        }
    };

    const hasError = validationErrors.tags || errors.tags || localValidationErrors.tags;

    return (
        <div className={`mb-4 ${className}`}>
            <RequiredInputLabel
                value={label}
                required={required}
            />
            <div className="mt-2">
                {/* Dropdown untuk memilih tag */}
                <select
                    id="tags"
                    name="tags"
                    onChange={handleAddTag}
                    className={`w-full border rounded-md px-3 py-2 ${
                        hasError
                            ? "border-red-500"
                            : "border-gray-300"
                    }`}
                    defaultValue=""
                >
                    <option value="">-- Pilih Tag --</option>
                    {tags?.filter(tag => !selectedTags.includes(String(tag.id))).map((tag) => (
                        <option
                            key={tag.id}
                            value={String(tag.id)}
                        >
                            {tag.name}
                        </option>
                    )) || []}
                </select>
                
                {/* Tampilan tag yang dipilih */}
                <div className="mt-3">
                    {selectedTags && selectedTags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {currentTags.map((tag) => (
                                <div
                                    key={tag.id}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                                >
                                    <span>{tag.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag.id)}
                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                    >
                                        <i className="fas fa-times text-xs"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 italic">
                            Belum ada tag yang dipilih
                        </div>
                    )}
                </div>
                
                <div className="text-sm text-gray-500 mt-2">
                    Total: {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} dipilih
                </div>
            </div>
            <InputError
                message={validationErrors.tags || errors.tags || localValidationErrors.tags}
                className="mt-2"
            />
        </div>
    );
}
