import InputLabel from '@/Components/InputLabel';

export default function RequiredInputLabel({ htmlFor, value, required = false, className = '' }) {
    return (
        <label htmlFor={htmlFor} className={`block font-medium text-sm text-gray-700 ${className}`}>
            {value}
            {required && <span className="text-red-600 font-bold">*</span>}
        </label>
    );
}
