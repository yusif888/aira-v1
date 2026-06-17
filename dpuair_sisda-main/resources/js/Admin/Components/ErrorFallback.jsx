import React from "react";

function ErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <h3 className="font-bold">Terjadi Kesalahan</h3>
            <p>{error.message}</p>
            <button
                onClick={resetErrorBoundary}
                className="mt-2 text-blue-600 underline"
            >
                Coba Lagi
            </button>
        </div>
    );
}

export default ErrorFallback;
