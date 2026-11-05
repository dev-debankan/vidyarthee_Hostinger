import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.googleapis.com https://*.gstatic.com; style-src 'self' 'unsafe-inline' https://*.google.com https://*.googleapis.com https://*.gstatic.com; img-src 'self' data: blob: https://*.google.com https://*.googleapis.com https://*.gstatic.com https://maps.gstatic.com https://*.supabase.co; connect-src 'self' https://*.google.com https://*.googleapis.com https://*.gstatic.com; font-src 'self' data: https://*.gstatic.com; frame-src 'self' https://docs.google.com https://forms.gle https://www.youtube.com https://www.youtube-nocookie.com https://*.google.com https://*.googleapis.com https://*.gstatic.com https://*.supabase.co;",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
