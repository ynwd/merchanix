import Footer from "../../components/footer.tsx";
import { Handler } from "../../core/mod.ts";

export const successHandler: Handler = (_req, ctx) => {
    const successFlag = ctx.cookies?.notify_success;
    if (!successFlag) {
        return new Response(null, { status: 302, headers: { Location: "/" } });
    }

    ctx.setCookie?.("notify_success", "", { path: "/", maxAge: 0 });

    const element = (
        <>
            <main>
                <h1>Success!</h1>
                <p>Thank you for registering. We will notify you as soon as the system is ready.</p>
                <a href="/" className="btn-back">Back to Home</a>
            </main>
            <Footer />
        </>
    );
    const html = ctx.renderToString!(element, {
        includeDoctype: true, title: "Success - Merhanix", head: `
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Success - Merhanix</title>
      <link rel="stylesheet" href="/css/app.css">
      <script src="/js/app.js" defer></script>
    </head>
  ` });
    return new Response(html, {
        headers: { "Content-Type": "text/html" },
    });
};