import React from "react";
import Footer from "../../components/footer.tsx";

export const App: React.FC<{ name?: string, serverTime?: string }> = ({ name = "World", serverTime }) => {
    console.log("Rendering App component", { name, serverTime });
    return (
        <>
            <main>
                <span>Fastro</span>
                <h1>MERCHANT</h1>
                <span>Tired of Marketplace Limits? It's Time to Take Full Control.</span>
                <span>Create your own online store for free and take full control of your brand, data, and customer experience.</span>
                <span>Your business, your rules.</span>
                <form className="cta-form" id="notify-form" method="post" action="/notify">
                    <input type="email" name="email" placeholder="Enter your email" required aria-label="Email" />
                    <button type="submit">Notify Me</button>
                    <span className="form-note">We’ll let you know as soon as Fastro Merchant is ready.</span>
                </form>
            </main>
            <Footer />
        </>
    );
};