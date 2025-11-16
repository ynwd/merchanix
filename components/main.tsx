import React from 'react';
import Footer from "./footer.tsx";

export default function Main({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen w-full bg-[url('/images/3334896.jpg')] bg-cover bg-center bg-no-repeat bg-fixed flex flex-col">
            <div className="flex-grow flex items-center justify-center pl-4 pr-4 pt-4">{children}</div>
            <div className="w-full md:static fixed bottom-0 left-0 z-50 md:z-auto">
                <Footer />
            </div>
        </main>
    );
}