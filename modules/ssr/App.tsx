import React, { useState } from "react";
import Card from "../../components/card.tsx";
import Main from "../../components/main.tsx";
import CtaButton from "../../components/cta-button.tsx";
import TypingText from "../../components/text.tsx";
import Title from "../../components/title.tsx";

export const App: React.FC<{ name?: string, serverTime?: string }> = ({ name = "World" }) => {
    const [showButton, setShowButton] = useState(false);

    return (
        <Main>
            <Card>
                <Title>
                    Welcome to Deno SSR with React {name}!
                </Title>
                <TypingText text="Ini adalah aplikasi SSR dengan Deno dan React!" onComplete={() => setTimeout(() => setShowButton(true), 500)} />
                {showButton && <CtaButton text="Get Started" link="/" variant="primary" />}
            </Card>
        </Main>
    );
};