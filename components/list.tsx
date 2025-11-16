import ItemCard from "./item-card.tsx";

export type TodoItem = {
    title: string;
    checked: boolean;
    price?: string;
    description?: string;
};

export default function List({ items }: { items: TodoItem[] }) {
    const gradients = [
        "linear-gradient(135deg, #071025 0%, #20123f 45%, #4b0b75 100%)", // deep navy → indigo → purple
        "linear-gradient(135deg, #081018 0%, #0f2940 40%, #0b3b3c 100%)", // charcoal → deep teal
        "linear-gradient(135deg, #0b0f14 0%, #2b112f 45%, #6b1f4a 100%)", // almost black → burgundy
        "linear-gradient(135deg, #0a0b0f 0%, #1b1833 45%, #3a1f6b 100%)", // black → indigo
        "linear-gradient(135deg, #081018 0%, #2a1b4f 45%, #5a1a6e 100%)"  // dark blue → purple
    ];

    const single = items.length === 1;

    return (
        <div className="w-full flex flex-col items-center gap-y-4">
            <div className={`${single ? 'grid grid-cols-1 place-items-start' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2'} gap-4 w-full max-w-2xl mx-auto`}>
                {items.map((item, idx) => {
                    const seed = (item.title ?? "").split("").reduce((s, ch) => s + ch.charCodeAt(0), idx);
                    const bg = gradients[seed % gradients.length];

                    return (
                        <ItemCard key={idx}>
                            <div className={`${single ? 'w-full max-w-md' : 'w-full'} flex flex-col rounded-xl overflow-hidden h-[20rem] border border-gray-700 relative`}>
                                <div className={`relative flex items-center justify-center flex-1 text-white px-4`}>
                                    <div className="absolute w-full left-0 bottom-0 py-3 z-15">
                                        <div className="flex justify-center gap-x-3 items-center">
                                            <div className="flex items-center">
                                                <button
                                                    type="button"
                                                    disabled
                                                    className="w-6 h-6 flex items-center justify-center text-white/60"
                                                    title="Product ID"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-id"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" /><path d="M9 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M15 8l2 0" /><path d="M15 12l2 0" /><path d="M7 16l10 0" /></svg>

                                                </button>
                                                <span className="inline-flex items-center py-1 text-white/60 text-xs">
                                                    {"SKU-123"}
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                <button
                                                    type="button"
                                                    disabled
                                                    aria-label={item.checked ? "Checked" : "Mark as checked"}
                                                    className={`w-6 h-6 flex items-center justify-center rounded-md border border-black/25 ${item.checked
                                                        ? "text-emerald-500"
                                                        : "text-white/60"
                                                        }`}
                                                    title={item.checked ? "Available" : "Not Available"}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-tag"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11.172 2a3 3 0 0 1 2.121 .879l7.71 7.71a3.41 3.41 0 0 1 0 4.822l-5.592 5.592a3.41 3.41 0 0 1 -4.822 0l-7.71 -7.71a3 3 0 0 1 -.879 -2.121v-5.172a4 4 0 0 1 4 -4zm-3.672 3.5a2 2 0 0 0 -1.995 1.85l-.005 .15a2 2 0 1 0 2 -2" /></svg>
                                                </button>
                                                <span className="inline-flex items-center py-1 rounded-md text-white/60 text-xs ">
                                                    {item.price ?? "FREE"}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <button
                                                    type="button"
                                                    disabled
                                                    className="w-6 h-6 flex items-center justify-center text-white/60"
                                                    title="Stars"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-star"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" /></svg>

                                                </button>
                                                <span className="inline-flex items-center py-1 text-white/60 text-xs ">
                                                    {"0 Stars"}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <button
                                                    type="button"
                                                    disabled
                                                    className="w-6 h-6 flex items-center justify-center text-white/60"
                                                    title="Stars"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-shopping-cart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2zm11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z" /></svg>

                                                </button>
                                                <span className="inline-flex items-center py-1 text-white/60 text-xs ">
                                                    {"0 Sold"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute right-3 top-0 z-30 py-4 h-full flex flex-col gap-y-4 justify-center pointer-events-auto">
                                        <button
                                            type="button"
                                            aria-label="add"
                                            onClick={() => console.log("add", idx)}
                                            className="w-9 h-9 flex items-center justify-center rounded-md bg-white/10 border border-black/25 hover:scale-105 transition-colors text-white/60 hover:text-white"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12.5 17h-6.5v-14h-2" /><path d="M6 5l14 1l-.86 6.017m-2.64 .983h-10.5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
                                        </button>

                                        <button
                                            type="button"
                                            aria-label="Favorite"
                                            onClick={() => console.log("favorite", idx)}
                                            className="w-9 h-9 flex items-center justify-center rounded-md bg-white/10 border border-black/25 hover:scale-105 transition-colors text-white/60 hover:text-white"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-star"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>
                                        </button>

                                        <button
                                            type="button"
                                            aria-label="Bookmark"
                                            onClick={() => console.log("bookmark", idx)}
                                            className="w-9 h-9 flex items-center justify-center rounded-md bg-white/10 border border-black/25 hover:scale-105 transition-colors text-white/60 hover:text-white"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-bookmark-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 17l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
                                        </button>
                                    </div>
                                    <div
                                        className="absolute inset-0"
                                        style={{ backgroundImage: bg }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                                    <div className="absolute inset-0 pointer-events-none rounded-xl shadow-inner" />
                                    {(() => {
                                        const words = item.title.trim().split(/\s+/);
                                        if (words.length > 2) {
                                            return (
                                                <span className="relative z-10 text-center font-semibold text-base drop-shadow-md">
                                                    {words.slice(0, 2).join(' ')}<br />{words.slice(2).join(' ')}
                                                </span>
                                            );
                                        }
                                        return (
                                            <span className="relative z-10 text-center text-base drop-shadow-md">
                                                {item.title}
                                            </span>
                                        );
                                    })()}
                                </div>

                                <div
                                    className="mt-auto bg-white px-4 py-2 flex flex-col gap-y-1 justify-center h-18 overflow-hidden rounded-b-xl relative z-15"
                                //  className="mt-auto bg-white px-4 py-2 flex flex-col gap-y-1 justify-center h-18 overflow-hidden border-l border-r border-gray-300 rounded-b-xl border-b border-b-gray-300  relative z-15"
                                >
                                    <span
                                        className="text-base font-roboto text-center text-gray-700 block"
                                        title={item.description ?? ""}
                                        aria-label={item.description ?? ""}
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {item.description ?? ""}
                                    </span>
                                </div>
                            </div>
                        </ItemCard>
                    );
                })}
            </div>
        </div>
    )
};