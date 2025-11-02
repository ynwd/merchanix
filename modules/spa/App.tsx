import React from "react";

export const App = () => {
    const [count, setCount] = React.useState(0);

    return (
        <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
            <h1>Hello from React + TypeScript + Deno!</h1>
            <p>
                <button type="button" onClick={() => setCount(c => c + 1)}>
                    Count: {count}
                </button>
            </p>
            <p>Built with <strong>esbuild</strong> via <strong>Deno</strong>.</p>
        </main>
    );
};