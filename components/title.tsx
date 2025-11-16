export default function Title({ children }: { children: string | string[] }) {
    return (
        <h1 className="text-2xl md:text-3xl font-bold font-roboto text-center tracking-tight text-slate-800">
            {Array.isArray(children) ? (
                children.map((child, index) => (
                    <span key={index}>{child}</span>
                ))
            ) : (
                <span>{children}</span>
            )}
        </h1>
    );
}