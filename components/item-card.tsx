import React from 'react';

export default function ItemCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full rounded-lg overflow-hidden">
            <div className="flex flex-col space-y-4">
                {children}
            </div>
        </div>
    );
}