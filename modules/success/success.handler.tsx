import Main from "../../components/main.tsx";
import Card from "../../components/card.tsx";
import { Handler } from "../../core/mod.ts";
import Title from "../../components/title.tsx";
import CtaButton from "../../components/cta-button.tsx";

export const successHandler: Handler = (_req, ctx) => {
    const successFlag = ctx.cookies?.notify_success;
    if (!successFlag) {
        return new Response(null, { status: 302, headers: { Location: "/" } });
    }

    ctx.setCookie?.("notify_success", "", { path: "/", maxAge: 0 });

    // use Main dan Card components to build the success page
    const element = (
        <>
            <Main>
                <Card>
                    <Title>Success!</Title>
                    <p>Thank you for registering. We will notify you as soon as the system is ready.</p>
                    <CtaButton text="Back" link="/" variant="primary" />
                </Card>
            </Main>
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