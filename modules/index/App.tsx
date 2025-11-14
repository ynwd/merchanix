import React, { useState, useEffect } from "react";
import Footer from "../../components/footer.tsx";

export const App: React.FC<{ name?: string, serverTime?: string }> = ({ name = "World", serverTime }) => {
    console.log("Rendering App component", { name, serverTime });

    const texts = [
        "Tired of Marketplace Limits? It's Time to Take Full Control.",
        "Create your own online store for free and take full control of your brand, data, and customer experience.",
        "Your business, your rules."
    ];

    const allText = texts.join(" ");
    const [currentTyped, setCurrentTyped] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < allText.length) {
                setCurrentTyped(allText.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 20);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!isTyping) {
            const timer = setTimeout(() => {
                setShowForm(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isTyping]);

    return (
        <>
            <main>
                <span>Fastro</span>
                <h1>MERCHANT</h1>
                {isTyping ? (
                    <span>{currentTyped}<span className="cursor">|</span></span>
                ) : (
                    <>
                        <span>{texts[0]}</span>
                        <span>{texts[1]}</span>
                        <span>{texts[2]}</span>
                    </>
                )}
                {showForm && (
                    <form className="cta-form" id="notify-form" method="post" action="/notify">
                        <input type="email" name="email" placeholder="Enter your email" required aria-label="Email" />
                        <button type="submit">Notify Me</button>
                        <span className="form-note">We’ll let you know as soon as Fastro Merchant is ready.</span>
                    </form>
                )}
            </main>
            <Footer />
        </>
    );
};