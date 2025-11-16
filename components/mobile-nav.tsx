import NavButtons from "./nav-buttons.tsx";

export default function MobileNav() {
    return (
        <nav className="flex w-full lg:hidden justify-around items-center">
            <NavButtons />
        </nav>
    );
}
