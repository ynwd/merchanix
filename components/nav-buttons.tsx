export default function NavButtons({ vertical = false }: { vertical?: boolean }) {
    const btnClass = (vertical ? "mb-6 " : "") + "min-w-14 p-2 rounded flex flex-col items-center hover:bg-slate-100/50 hover:text-blue-600 transition-colors text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-200";
    return (
        <>
            {/* kasih minimal widht yg proper untuk tiap button ini */}
            <button type="button" className={btnClass} title="Home" aria-label="Home">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-home"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>
                <span className="mt-1 text-[11px] leading-none">Home</span>
            </button>
            <button type="button" className={btnClass} title="Shop">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>
                <span className="mt-1 text-[11px] leading-none">Shop</span>
            </button>
            <button type="button" className={btnClass} title="Features">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-star"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>
                <span className="mt-1 text-[11px] leading-none">Starred</span>
            </button>
            <button type="button" className={btnClass} title="Settings" aria-label="Settings">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-bookmark-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 17l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
                <span className="mt-1 text-[11px] leading-none">Saved</span>
            </button>
            <button type="button" className={btnClass} title="Profile" aria-label="Profile">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 7a4 4 0 1 0 0 8a4 4 0 0 0 0-8z" /><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></svg>
                <span className="mt-1 text-[11px] leading-none">Profile</span>
            </button>

        </>
    );
}
