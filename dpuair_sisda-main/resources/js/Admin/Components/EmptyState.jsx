import React from 'react';
import { Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

const EmptyState = ({ 
    // Icon options
    icon, // FontAwesome class
    iconSize = 'text-6xl',
    iconClassName = "",
    showIcon = true,
    
    // Content
    title, 
    description, 
    titleSize = 'text-sm',
    descriptionSize = 'text-sm',
    titleClassName = "",
    descriptionClassName = "",
    
    // Action options
    actionButton, // Custom button component
    actionLink,
    actionText,
    actionIcon, // Icon for action button
    
    // Styling options
    variant = 'default', // 'default', 'gradient', 'minimal'
    className = "",
    containerClassName = "",
    
    // Layout options
    centerContent = true
}) => {
    // Icon rendering
    const renderIcon = () => {
        if (!showIcon || !icon) return null;
        
        const baseIconClasses = `mx-auto ${iconSize} text-gray-400 mb-4 ${iconClassName}`;
        return <i className={`${icon} ${baseIconClasses}`}></i>;
    };

    // Action button rendering
    const renderAction = () => {
        if (actionButton) {
            return <div className="mt-6">{actionButton}</div>;
        }
        
        if (actionLink && actionText) {
            return (
                <div className="mt-6">
                    <Link href={actionLink}>
                        <PrimaryButton type="button">
                            {actionIcon && <i className={`${actionIcon} mr-2`}></i>}
                            {actionText}
                        </PrimaryButton>
                    </Link>
                </div>
            );
        }
        
        return null;
    };

    // Variant styling
    const getVariantClasses = () => {
        switch (variant) {
            case 'gradient':
                return 'py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300';
            case 'minimal':
                return 'py-8';
            case 'default':
            default:
                return 'py-12';
        }
    };

    const getTitleClasses = () => {
        const baseClasses = `mt-2 font-medium text-gray-900 ${titleSize} ${titleClassName}`;
        return baseClasses;
    };

    const getDescriptionClasses = () => {
        const baseClasses = `mt-1 text-gray-500 ${descriptionSize} ${descriptionClassName}`;
        return baseClasses;
    };

    const contentClasses = centerContent ? 'text-center' : '';

    return (
        <div className={`${getVariantClasses()} ${contentClasses} ${containerClassName} ${className}`}>
            {renderIcon()}
            <h3 className={getTitleClasses()}>
                {title}
            </h3>
            <p className={getDescriptionClasses()}>
                {description}
            </p>
            {renderAction()}
        </div>
    );
};

export default EmptyState;
