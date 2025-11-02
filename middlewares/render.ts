import React from "react";
import { renderToString } from "react-dom/server";
import type { Middleware } from "../core/server.ts";

const createRenderFunction = (includeDoctype: boolean = false) => {
    return (component: React.ReactElement, opts: { includeDoctype?: boolean } = {}) => {
        const html = renderToString(component);
        return (opts.includeDoctype ?? includeDoctype) ? `<!DOCTYPE html>${html}` : html;
    };
};

const defaultRender = createRenderFunction();

export const renderMiddleware: Middleware = (_req, context, next) => {
    if (!context.render) {
        context.render = defaultRender;
    }
    return next();
};

export const renderWithParams = (component: React.ReactElement, opts: { includeDoctype?: boolean } = {}) => {
    const html = renderToString(component);
    return opts.includeDoctype ? `<!DOCTYPE html>${html}` : html;
};

export type RenderFunction = (component: React.ReactElement, options?: { includeDoctype?: boolean }) => string;