import React from 'react';

const StatusBadge = ({ status, variant = 'default' }) => {
    const getStatusConfig = (status, variant) => {
        const configs = {
            // STATUS_NEWS
            published: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                icon: 'fa-check-circle'
            },
            draft: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                icon: 'fa-file'
            },
            archived: {
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                icon: 'fa-archive'
            },
            deleted: {
                bg: 'bg-red-100',
                text: 'text-red-800',
                icon: 'fa-times-circle'
            },
            // GENERIC
            protected: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                icon: 'fa-lock'
            },
            // STATUS_USER
            active: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                icon: 'fa-check-circle'
            },
            inactive: {
                bg: 'bg-red-100',
                text: 'text-red-800',
                icon: 'fa-times-circle'
            },
            pending: {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                icon: 'fa-clock'
            }
        };

        return configs[status] || configs.archived;
    };

    const config = getStatusConfig(status, variant);

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
            <i className={`fas text-[10px] mr-1 ${config.icon}`}></i>
            {status}
        </span>
    );
};

export default StatusBadge;
