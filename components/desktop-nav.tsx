import NavButtons from "./nav-buttons.tsx";

/**

add this button on this nav bar too, put it on the top.
and the rest of the buttons, stick to the bottom.

<button type="button" className="p-1 rounded-full transition-colors h-9 w-9 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-cpu"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 5m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" /><path d="M9 9h6v6h-6z" /><path d="M3 10h2" /><path d="M3 14h2" /><path d="M10 3v2" /><path d="M14 3v2" /><path d="M21 10h-2" /><path d="M21 14h-2" /><path d="M14 21v-2" /><path d="M10 21v-2" /></svg>
                </button>

*/

export default function DesktopNav() {
    return (
        <>
            {/* make this nav little transparant */}
            <nav className="hidden md:hidden lg:flex fixed top-0 left-0 flex-col items-center w-16 h-screen py-4 bg-white/50 backdrop-blur-md border-r border-white/20 shadow-sm z-20">
                {/* adjust the color to be inline with another button on this nav */}
                <div className="flex flex-col items-center">
                    <button type="button" aria-label="Tools" className="p-1 rounded-full transition-colors h-9 w-9 text-slate-500 hover:bg-slate-100/50 hover:text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-cpu"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 5m0 1a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1z" /><path d="M9 9h6v6h-6z" /><path d="M3 10h2" /><path d="M3 14h2" /><path d="M10 3v2" /><path d="M14 3v2" /><path d="M21 10h-2" /><path d="M21 14h-2" /><path d="M14 21v-2" /><path d="M10 21v-2" /></svg>
                    </button>
                </div>

                {/* Spacer pushes the rest of the buttons to the bottom */}
                <div className="flex-1" />

                {/* Bottom: other nav buttons */}
                <div className="flex flex-col items-center">
                    <NavButtons vertical />
                </div>
            </nav>
        </>
    );
}
