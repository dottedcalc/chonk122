import type { Metadata } from "next";

// The 404 page's metadata. A route that calls notFound() returns it too, or its own empty metadata
// would replace the 404 title once the page finishes streaming.
export const notFoundMetadata: Metadata = { title: "Page not found · chonk122" };
