
import MobileNav from "./mobile-nav.tsx";

export default function Footer() {
    return (
        <footer className="md:p-6 flex justify-center">
            <div className="md:hidden bg-white/50 backdrop-blur-md w-full border-t border-white/20"><MobileNav /></div>
            <p className="hidden md:hidden text-slate-500 lg:block text-xs text-center">&copy; 2025 Fastro Innovations – Reimagining Commerce</p>
        </footer>
    );
}