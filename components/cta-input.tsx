export default function CtaInput({ placeholder, buttonText, onSubmit }: { placeholder: string; buttonText: string; onSubmit: (value: string) => void }) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.elements.namedItem("cta-input") as HTMLInputElement;
        onSubmit(input.value);
        input.value = "";
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                name="cta-input"
                placeholder={placeholder}
                className="flex-1 px-3 py-2 bg-white/60 border border-white/40 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
                required
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                {buttonText}
            </button>
        </form>
    );
}