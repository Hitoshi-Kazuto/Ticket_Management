import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                <div className="absolute top-0 left-0 right-0 bottom-0 m-auto border-t-4 border-solid border-blue-300 rounded-full h-12 w-12 animate-spin-slow"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;