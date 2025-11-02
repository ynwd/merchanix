import React from "react";
import { renderToString } from "react-dom/server";
import type { Middleware } from "../core/server.ts";

type RenderToStringOptions = {
    identifierPrefix?: string;
    signal?: AbortSignal;
    nonceProvider?: () => string;
    onError?: (error: unknown) => void;
};

type RenderOptions = {
    module?: string;
    includeDoctype?: boolean;
    includeHead?: boolean;
    head?: string;
    title?: string;
    initialProps?: Record<string, unknown>;
} & RenderToStringOptions;

const createRenderToString = (includeDoctype: boolean = false) => {
    return (component: React.ReactElement, opts: RenderOptions = {}) => {
        const {
            module,
            identifierPrefix,
            signal,
            nonceProvider,
            onError,
            includeDoctype: doctypeOpt,
            includeHead,
            head,
            title,
            initialProps,
        } = opts;

        const renderOptions: RenderToStringOptions = {};
        if (identifierPrefix) renderOptions.identifierPrefix = identifierPrefix;
        if (signal) renderOptions.signal = signal;
        if (nonceProvider) renderOptions.nonceProvider = nonceProvider;
        if (onError) renderOptions.onError = onError;

        const componentWithProps = initialProps ? React.cloneElement(component, initialProps) : component;
        const bodyHtml = renderToString(componentWithProps, renderOptions);
        let html = bodyHtml;
        if (includeHead ?? true) {
            const headContent = head || `
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${title || "Hello World"}</title>
                    <link rel="stylesheet" href="/css/app.css">
                    <script src="/js/app.js" defer></script>
                </head>
            `;
            const minifiedHeadContent = headContent.replace(/\n/g, "").replace(/\s+/g, " ");

            const initialPropsScript = initialProps
                ? `<script>window.__INITIAL_PROPS__ = ${JSON.stringify(initialProps)}</script>`
                : "";
            const timestamp = Deno.env.get('ENV') !== 'production' ? `?t=${Date.now()}` : '';
            const clientScript = initialProps ? `<script src="/js/${module}/client.js${timestamp}" defer></script>` : "";
            html = `<html lang="en">${minifiedHeadContent}<body id="root">${bodyHtml}${initialPropsScript}${clientScript}</body></html>`;
        }
        return (doctypeOpt ?? includeDoctype) ? `<!DOCTYPE html>${html}` : html;
    };
};

export const renderMiddleware: Middleware = (_req, context, next) => {
    if (!context.renderToString) {
        context.renderToString = createRenderToString();
    }
    return next();
};

export type RenderFunction = (component: React.ReactElement, options?: RenderOptions) => string;