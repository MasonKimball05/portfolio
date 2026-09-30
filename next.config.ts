import type { NextConfig } from "next";

/** @type {import('next').NextConfig} **/
const nextConfig = {
    output: 'export',
    // Export each page as <route>/index.html, so /skills/ and /skills both
    // work on GitHub Pages (it 404s on /skills/ when the file is skills.html).
    trailingSlash: true,
    images: { unoptimized: true },
}


module.exports = nextConfig;
