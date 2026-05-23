/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
    unoptimized: true,
  },

  // Trust-dimension fixes surfaced by CheckIt.
  // - HSTS tells browsers to never speak HTTP to this origin again
  //   (a year, including preload-eligible subdomains).
  // - nosniff blocks MIME-sniffing attacks.
  // - SAMEORIGIN denies third-party framing (clickjacking protection).
  // - Referrer-Policy keeps the full URL out of cross-site referers.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
