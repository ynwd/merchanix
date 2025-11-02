import type { Middleware } from "../core/server.ts";

type CompressionFormat = "gzip" | "deflate" | "br";

export type CompressionOptions = {
    gzip?: boolean;
    brotli?: boolean;
    minSize?: number; // Minimum response size to compress (bytes)
};

/**
 * Compression middleware that applies gzip or brotli compression to responses.
 * 
 * Checks the client's Accept-Encoding header and compresses the response body
 * if the size exceeds the minimum threshold and compression is supported.
 * 
 * @param options - Configuration options for compression
 * @returns A middleware function that handles response compression
 */
export function compression(options: CompressionOptions = {}): Middleware {
    const {
        gzip = true,
        brotli = true,
        minSize = 1024,
    } = options;

    return async (req, _ctx, next) => {
        const response = await next();

        // Check if response has a body
        if (!response.body) return response;

        // Get content length if available
        const contentLengthHeader = response.headers.get("Content-Length");
        const contentLength = contentLengthHeader ? parseInt(contentLengthHeader, 10) : Infinity;

        // Skip compression for small responses
        if (contentLength < minSize) return response;

        // Check client's accepted encodings
        const acceptEncoding = req.headers.get("Accept-Encoding") || "";
        let encoding: CompressionFormat | null = null;

        if (brotli && acceptEncoding.includes("br")) {
            encoding = "br";
        } else if (gzip && acceptEncoding.includes("gzip")) {
            encoding = "gzip";
        }

        // Apply compression if supported
        if (encoding) {
            try {
                // @ts-ignore - Deno's type definition for CompressionStream is outdated and doesn't include "br"
                const compressedStream = response.body.pipeThrough(new CompressionStream(encoding));
                const compressedResponse = new Response(compressedStream, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: { ...response.headers }, // Clone headers
                });

                // Set compression headers
                compressedResponse.headers.set("Content-Encoding", encoding);
                compressedResponse.headers.delete("Content-Length"); // Remove since length changes

                return compressedResponse;
            } catch (error) {
                // If compression fails, return original response
                console.warn("Compression failed:", error);
                return response;
            }
        }

        return response;
    };
}

/**
 * Default compression middleware with gzip and brotli enabled
 */
export const compressionMiddleware: Middleware = compression();