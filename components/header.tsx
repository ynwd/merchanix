import Card from "./card.tsx";

type HeaderProps = {
    logoUrl?: string;
    title: string;
    subtitle?: string;
    bgUrl?: string;
    soldCount?: number;
    buyerCount?: number;
    since?: string | number;
};

export default function Header({ logoUrl, title, subtitle, soldCount, buyerCount, since }: HeaderProps) {
    const defaultLogo = (
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-target-arrow"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 7a5 5 0 1 0 5 5" /><path d="M13 3.055a9 9 0 1 0 7.941 7.945" /><path d="M15 6v3h3l3 -3h-3v-3z" /><path d="M15 9l-3 3" /></svg>
    );

    return (

        <Card>
            <div className="flex flex-col gap-y-1 items-center justify-center">
                <div className="flex gap-x-2 items-center justify-center text-slate-800">
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-6 h-6 rounded-full border-2 border-slate-600 shadow" />
                    ) :
                        <div className="h-6 w-6 flex justify-center items-center">{defaultLogo}</div>}
                    <div className="text-2xl md:text-3xl font-bold font-roboto text-slate-800 text-center drop-shadow">{title}</div>
                </div>
                {subtitle && (
                    <div className="text-sm md:text-base text-slate-600 tracking-wide text-center">{subtitle}</div>
                )}

                {(soldCount !== undefined || buyerCount !== undefined || since !== undefined) && (
                    <div className="flex gap-3 items-center justify-center pt-1">
                        {since !== undefined && (
                            <div className="flex items-center gap-1 text-slate-600 text-xs md:text-sm lg:text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-calendar-week"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /><path d="M7 14h.013" /><path d="M10.01 14h.005" /><path d="M13.01 14h.005" /><path d="M16.015 14h.005" /><path d="M13.015 17h.005" /><path d="M7.01 17h.005" /><path d="M10.01 17h.005" /></svg>
                                <span>Since {since}</span>
                            </div>
                        )}
                        {soldCount !== undefined && (
                            <div className="flex items-center gap-1 text-slate-600 text-xs md:text-sm lg:text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>
                                <span>{soldCount} items sold</span>
                            </div>
                        )}
                        {buyerCount !== undefined && (
                            <div className="flex items-center gap-1 text-slate-600 text-xs md:text-sm lg:text-sm ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 7a4 4 0 1 0 0 8a4 4 0 0 0 0-8z" /><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></svg>
                                <span>{buyerCount} customers</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
