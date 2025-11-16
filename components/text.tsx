import { useEffect, useState } from 'react';

export default function TypingText({ text, onComplete }: { text: string; onComplete?: () => void }) {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text.charAt(index));
                setIndex(index + 1);
            }, 15);
            return () => clearTimeout(timeout);
        } else {
            onComplete?.();
        }
    }, [index, text, onComplete]);

    return (
        <>
            {displayedText && (
                <p className="text-base md:text-lg text-center mb-4 text-slate-600">
                    {displayedText}
                    {index < text.length && <span className="blinking-cursor text-slate-400">|</span>}
                </p>
            )}
        </>
    );
}