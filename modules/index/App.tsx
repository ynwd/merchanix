import React, { useState } from "react";
import TypingText from "../../components/text.tsx";
import Main from "../../components/main.tsx";
import Card from "../../components/card.tsx";
import Title from "../../components/title.tsx";

export const App: React.FC<{ name?: string, serverTime?: string }> = ({ name = "World", serverTime }) => {
    console.log("Rendering App component", { name, serverTime });

    const texts = [
        "Create your own online store for free and take full control of your brand, data, and unique customer experience.",
        "Your business, your rules."
    ];

    const allText = texts.join(" ");
    const [showForm, setShowForm] = useState(false);

    return (
        <>
            <Main>
                <Card>
                    <Title>WELCOME</Title>
                    <TypingText text={allText} onComplete={() => setTimeout(() => setShowForm(true), 500)} />
                    {showForm && (
                        <form className="flex flex-col gap-4 items-center justify-center" id="notify-form" method="post" action="/notify">
                            <div className="flex flex-col md:flex-row gap-2 w-full max-w-md">
                                <input type="email" name="email" placeholder="Enter your email" required aria-label="Email" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 md:max-w-xs" />
                                <button type="submit" className="px-6 py-2 bg-blue-700 text-white font-bold rounded-md hover:bg-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900">Notify Me</button>
                            </div>
                            <span className="text-sm text-gray-700 text-center">We’ll let you know as soon as Fastro Merchant is ready.</span>
                        </form>
                    )}
                </Card>
            </Main >
        </>
    );
};