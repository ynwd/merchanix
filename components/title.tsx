export default function Title({ children }: { children: string | string[] }) {
    return (
        <h1 className="text-2xl font-bold mb-4 text-center">
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