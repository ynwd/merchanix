import React, { useState, useEffect, useMemo } from "react";
import TypingText from "../../components/text.tsx";
import Main from "../../components/main.tsx";
import Card from "../../components/card.tsx";
import Title from "../../components/title.tsx";
import List from "../../components/list.tsx";
import CtaButton from "../../components/cta-button.tsx";
import DesktopNav from "../../components/desktop-nav.tsx";
import SearchBar from "../../components/search.tsx";

export type TodoListItem = {
    title: string;
    checked: boolean;
    description: string;
};

export const App: React.FC<{
    todoList: TodoListItem[];
    products?: TodoListItem[];
    news?: { title: string; content?: string }[];
    reviews?: { title: string; rating?: number; content?: string }[];
}> = ({ todoList, products, news, reviews }) => {
    const texts = [
        "Your business, your rules.",
        "Create your own online store for free and take full control of your brand, data, and unique customer experience.",
    ];

    const allText = texts.join(" ");
    const [showForm, setShowForm] = useState<boolean>(true);
    const [showList, setShowList] = useState<boolean>(false);
    const [typingDone, setTypingDone] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [welcome, setWelcome] = useState<string>("");
    const [query, setQuery] = useState<string>("");

    const [clientTodoList, setClientTodoList] = useState<TodoListItem[]>(todoList);
    useEffect(() => {
        setWelcome("Welcome");
        if (typeof window === "undefined") return;
        try {
            const raw = localStorage.getItem("todoList");
            if (raw) {
                const parsed = JSON.parse(raw) as TodoListItem[];
                setClientTodoList(parsed);
            } else {
                localStorage.setItem("todoList", JSON.stringify(todoList));
            }
        } catch (err) {
            console.warn("Failed to read todoList from localStorage:", err);
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            localStorage.setItem("todoList", JSON.stringify(todoList));
            setClientTodoList(todoList);
        } catch (err) {
            console.warn("Failed to write todoList to localStorage:", err);
        }
    }, [todoList]);

    const didHydrate = React.useRef(false);
    useEffect(() => {
        if (typeof window === "undefined") return;
        const sF = localStorage.getItem("showForm");
        const sL = localStorage.getItem("showList");
        const td = localStorage.getItem("typingDone");
        setShowForm(sF === null ? true : sF === "true");
        setShowList(sL === "true");
        setTypingDone(td === "true");
        didHydrate.current = true;
    }, []);

    const getErrorMessage = (err: unknown): string => {
        if (err instanceof Error) return err.message;
        if (typeof err === "string") return err;
        try {
            return JSON.stringify(err);
        } catch {
            return "An unknown error occurred";
        }
    };

    const filteredList = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return clientTodoList;
        return clientTodoList.filter((it) => {
            const title = (it.title ?? "").toLowerCase();
            const desc = (it.description ?? "").toLowerCase();
            return title.includes(q) || desc.includes(q);
        });
    }, [clientTodoList, query]);

    const [activeTab, setActiveTab] = useState<'products' | 'news' | 'reviews'>('products');

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError(null);

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const res = await fetch("/notify", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || `Request failed with status ${res.status}`);
            }

            setShowList(true);
            setTypingDone(true);
            setShowForm(false);
            if (typeof window !== "undefined") {
                localStorage.setItem("showList", "true");
                localStorage.setItem("typingDone", "true");
                localStorage.setItem("showForm", "false");
            }
        } catch (err: unknown) {
            const msg = getErrorMessage(err);
            console.error("[submit] Failed to send form:", msg);
            setSubmitError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Main>
            <div className="flex w-full">
                <DesktopNav />
                <div className="flex-1 flex flex-col justify-start gap-y-4 items-center mb-24 md:mb-0">
                    {showForm ? (
                        <>
                            {showList ? (
                                <Card >
                                    <Title>Get Notified When We Launch!</Title>
                                    <form action="/notify" className="flex flex-col gap-4 items-center justify-center" id="notify-form" method="post" onSubmit={handleFormSubmit}>
                                        <span className="text-base md:text-lg text-center text-slate-600">Subscribe to get notified when Fastro Merchant is ready to launch.</span>
                                        <div className="flex flex-col md:flex-row gap-2 mb-4 w-full max-w-md">
                                            <input type="email" name="email" placeholder="Enter your email" required aria-label="Email" className="px-4 py-2 bg-white/60 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400 flex-1 md:max-w-xs transition-colors" />
                                            <button type="submit" disabled={submitting} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900">
                                                {submitting ? "Sending…" : "Notify Me"}
                                            </button>
                                        </div>
                                        {submitError && <div className="text-red-500 text-sm mt-2">{submitError}</div>}
                                    </form>
                                </Card>
                            ) : welcome ? (
                                <Card>
                                    <Title>{welcome}</Title>
                                    <TypingText text={allText} onComplete={() => {
                                        setTimeout(() => {
                                            if (localStorage.getItem("showForm") === "true") {
                                                setShowForm(true);
                                            }
                                        }, 0);
                                        setTimeout(() => setTypingDone(true), 600);
                                    }} />
                                    {typingDone && !showList && (
                                        <CtaButton text="Show Feature Checklist" link="#" variant="primary" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); setShowList(true); setShowForm(true) }} />
                                    )}
                                </Card>
                            ) :
                                <div className="flex flex-col items-center justify-center py-6">
                                    <div className="relative flex items-center justify-center">
                                        <div className="w-8 h-8 md:w-16 md:h-16 border-4 md:border-8 border-gray-200 border-t-gray-500 rounded-full animate-spin shadow-sm" role="status" aria-label="Loading">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                    <span className="mt-4 text-sm md:text-base text-slate-700">Loading…</span>
                                </div>
                            }
                        </>
                    ) : (
                        <div className={`w-full max-w-2xl mx-auto min-w-[320px]`}>
                            <SearchBar value={query} onChange={setQuery} />
                        </div>
                    )}

                    {typingDone && showList && (
                        <div className={(showList ? 'slide-in-from-left opacity-100' : 'opacity-0') + ' transition-all duration-500 ease-in-out flex justify-center w-full h-full'}>
                            <div className="w-full max-w-2xl flex flex-col items-center min-w-[320px]">
                                <div className="w-full flex gap-2 justify-between mb-4">
                                    {/* buat text-nya kecil untuk layar mobile */}
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('products')}
                                        className={`px-2 py-3 w-full flex justify-center items-center rounded-full font-medium text-sm md:text-base border ${activeTab === 'products' ? 'bg-blue-600 text-white border-blue-700' : 'bg-white/50 text-slate-800 border-slate-300'}`}>

                                        <span className="text-xs md:text-base">Products</span>
                                        <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-white/20 text-white">
                                            {(products ?? filteredList).length}
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('news')}
                                        className={`px-2 py-3 w-full flex justify-center  items-center rounded-full font-medium text-sm md:text-base border ${activeTab === 'news' ? 'bg-blue-600 text-white border-blue-700' : 'bg-white/50 text-slate-800 border-slate-300'}`}>
                                        <span className="text-xs md:text-base">News</span>
                                        {news && (
                                            <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-white/20 text-white">
                                                {news.length}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('reviews')}
                                        className={`px-2 py-3 w-full flex justify-center  items-center rounded-full font-medium text-sm md:text-base border ${activeTab === 'reviews' ? 'bg-blue-600 text-white border-blue-700' : 'bg-white/50 text-slate-800 border-slate-300'}`}>
                                        <span className="text-xs md:text-base">Reviews</span>
                                        {reviews && (
                                            <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded-full bg-white/20 text-white">
                                                {reviews.length}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                <div className="w-full">
                                    {activeTab === 'products' && (
                                        <div className="flex flex-col items-center">
                                            <List items={products ?? filteredList} />
                                        </div>
                                    )}

                                    {activeTab === 'news' && (
                                        <div className="rounded-md w-full">
                                            {(news && news.length > 0) ? (
                                                <ul className="space-y-3">
                                                    {news.map((n, idx) => (
                                                        <Card key={idx} >
                                                            <h3 className="font-semibold text-slate-800">{n.title}</h3>
                                                            {n.content && <p className="text-sm text-slate-600">{n.content}</p>}
                                                        </Card>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="text-slate-600 text-center">No news available.</div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'reviews' && (
                                        <div className="rounded-md w-full">
                                            {(reviews && reviews.length > 0) ? (
                                                <ul className="space-y-3">
                                                    {reviews.map((r, idx) => (
                                                        <Card key={idx} >
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="font-semibold text-slate-800">{r.title}</h3>
                                                                {typeof r.rating === 'number' && <span className="text-sm text-yellow-600">{r.rating}★</span>}
                                                            </div>
                                                            {r.content && <p className="text-sm text-slate-600">{r.content}</p>}
                                                        </Card>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="text-slate-600 text-center">No reviews available.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Main>

    );
};