import React from 'react';

const DataCard = ({
    item,
    index = 0,
    icon = 'fas fa-tag',
    iconColor = null,
    title,
    subtitle = null,
    description = null,
    count = 0,
    countLabel = 'item',
    isProtected = false,
    protectedLabel = 'Terlindungi',
    onEdit = null,
    onDelete = null,
    editTitle = 'Edit',
    deleteTitle = 'Hapus',
    editIcon = 'fas fa-edit',
    deleteIcon = 'fas fa-trash',
    editColor = 'text-blue-600 hover:text-blue-800',
    deleteColor = 'text-red-600 hover:text-red-800',
    disabledDelete = false,
    disabledDeleteColor = 'text-gray-400 cursor-not-allowed',
    gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
    gap = 'gap-3',
    cardStyle = 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-purple-50 hover:to-purple-100',
    showActions = true,
    truncateDescription = true,
    truncateTitle = true,
    truncateSubtitle = true
}) => {
    // Generate color if not provided
    const getItemColor = (index) => {
        const colors = [
            '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
            '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
        ];
        return colors[index % colors.length];
    };

    const itemColor = iconColor || getItemColor(index);

    return (
        <div className={`${gridCols} ${gap}`}>
            <div className={`${cardStyle} rounded-lg p-4 border border-gray-200 hover:shadow-lg hover:from-blue-50 hover:to-indigo-100 transition-all duration-200 group h-full flex flex-col`}>
                <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white shadow-sm flex-shrink-0 text-xs" style={{ backgroundColor: itemColor }}>
                            <i className={icon}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium text-gray-900 ${truncateTitle ? 'truncate' : ''}`} title={title}>
                                {title}
                            </p>
                            {subtitle && (
                                <p className={`text-xs text-gray-500 ${truncateSubtitle ? 'truncate' : ''}`} title={subtitle}>
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {showActions && (
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            {onEdit && (
                                <button 
                                    onClick={() => onEdit(item)} 
                                    className={`p-1 ${editColor}`} 
                                    title={editTitle}
                                >
                                    <i className={`${editIcon} text-xs`}></i>
                                </button>
                            )}
                            {onDelete && (
                                <button 
                                    onClick={() => onDelete(item)} 
                                    className={`p-1 ${disabledDelete ? disabledDeleteColor : deleteColor}`} 
                                    disabled={disabledDelete}
                                    title={disabledDelete ? 'Tidak dapat dihapus' : deleteTitle}
                                >
                                    <i className={`${deleteIcon} text-xs`}></i>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Description */}
                {description && (
                    <div className="mb-3 flex-shrink-0">
                        <p className={`text-sm text-gray-600 ${truncateDescription ? 'truncate' : ''}`} title={description}>
                            {description}
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs mt-auto flex-shrink-0">
                    <span className="text-gray-500">{count || 0} {countLabel}</span>
                    {isProtected && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <i className="fas fa-lock mr-1"></i>
                            {protectedLabel}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// Grid Container Component
export const DataCardGrid = ({ 
    children, 
    gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
    gap = 'gap-3',
    className = ''
}) => {
    return (
        <div className={`grid ${gridCols} ${gap} ${className}`}>
            {children}
        </div>
    );
};

export default DataCard;
