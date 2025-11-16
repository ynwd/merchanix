type Props = {
    text: string;
    link: string;
    variant?: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};

// adjust CtaButton ini lebih menarik dan konsisten dengan design system yg ada
// gunakan tailwindcss
// buat dua variant: primary dan secondary
// primary: bg-blue-600 text-white hover:bg-blue-700
// secondary: bg-gray-200 text-slate-700 hover:bg-gray-300
// tambahkan transition-colors untuk smooth hover effect
// tambahkan focus styles untuk accessibility
export default function CtaButton({ text, link, variant = 'primary', onClick }: Props) {
    const baseClasses = 'px-6 py-3 rounded-md font-bold transition-colors text-center focus:outline-none focus:ring-2 focus:ring-blue-900';
    const variantClasses = variant === 'primary'
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-gray-200 text-slate-700 hover:bg-gray-300';

    return (
        <a
            href={link}
            className={`${baseClasses} ${variantClasses} slide-in-from-left`}
            onClick={onClick}
        >
            {text}
        </a>
    );
}