import { useState, useEffect } from "react";
import Header from "./header.tsx";

export default function SearchBar({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    const fullPlaceholder = "Try product ID, title, or description — e.g. SKU123, \"blue mug\"";
    const [placeholder, setPlaceholder] = useState("");

    useEffect(() => {
        if (placeholder.length < fullPlaceholder.length) {
            const timeout = setTimeout(() => {
                setPlaceholder(fullPlaceholder.substring(0, placeholder.length + 1));
            }, 20);
            return () => clearTimeout(timeout);
        }
    }, [placeholder]);

    return (
        <div className="flex flex-col items-center gap-y-4 w-full" role="search" aria-label="Product search">
            <Header
                title="Fastro Merchant"
                subtitle="Your gateway to seamless online selling"
                soldCount={0}
                buyerCount={0}
                since={2025}
            />
            <div className="w-full">
                <label htmlFor="product-search" className="sr-only">Search products</label>
                <input
                    id="product-search"
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.currentTarget.value)}
                    className="w-full py-3 px-8 text-sm md:text-base rounded-full bg-white/60 backdrop-blur-md border border-slate-300 shadow placeholder:text-sm md:placeholder:text-base placeholder-slate-400 text-slate-800 transition-colors outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-opacity-90 hover:border-slate-400"
                    aria-label="Search products by ID, title, or description"
                />
            </div>
        </div>
    );
}