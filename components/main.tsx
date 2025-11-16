import React from 'react';
import Footer from "./footer.tsx";

export default function Main({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen bg-gray-100 p-4 flex flex-col">
            <div className="flex-grow flex items-center justify-center">{children}</div>
            <Footer />
        </main>
    );
}