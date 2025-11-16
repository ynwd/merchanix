import React from 'react';

type CardProps = {
    children: React.ReactNode;
    className?: string;
};

export default function Card({ children, className }: CardProps) {
    return (
        <div className={`w-full h-full max-w-2xl mx-auto bg-white/60 backdrop-blur-xl shadow-sm rounded-xl overflow-hidden border border-white/50 text-slate-800 ${className || ""}`.trim()}>
            <div className="p-4 flex flex-col space-y-2">
                {children}
            </div>
        </div>
    );
}