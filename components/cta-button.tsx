export default function CtaButton({ text, link, variant = 'primary' }: { text: string; link: string; variant?: string }) {
    const baseClasses = 'px-6 py-2 rounded-md font-bold transition-colors text-center focus:outline-none focus:ring-2 focus:ring-blue-900';
    const variantClasses = variant === 'primary'
        ? 'bg-blue-700 text-white hover:bg-blue-900'
        : 'bg-gray-500 text-white hover:bg-gray-600';

    return (
        <a href={link} className={`${baseClasses} ${variantClasses} slide-in-from-left`}>
            {text}
        </a>
    );
}