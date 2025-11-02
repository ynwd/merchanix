import React from "react";

export const App: React.FC<{ name?: string, serverTime?: string }> = ({ name = "World", serverTime }) => {
    return (
        <main>
            <h1>Hello, {name}!</h1>
            <p>Server time: {serverTime}</p>
        </main>
    );
};