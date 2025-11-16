import React from 'react';

export default function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 md:min-w-[384px]">
            <div className="p-4 flex flex-col items-center justify-center space-y-4">
                {children}
            </div>
        </div>
    );
}