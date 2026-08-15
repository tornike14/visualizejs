import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const isDev = process.env.NODE_ENV === "development";

// Vercel Analytics and Speed Insights load their scripts from this host in
// development. In production both scripts are served same-origin under
// /_vercel, but the host stays allow-listed so the policy holds either way.
// Beacons are always same-origin (/_vercel/insights/view, /_vercel/speed-insights/vitals),
// so connect-src does not need the host.
const VERCEL_ANALYTICS_HOST = "https://va.vercel-scripts.com";

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/javascript/:topic/theory",
      destination: "/javascript/:topic",
      permanent: true,
    },
    {
      source: "/react/:topic/theory",
      destination: "/react/:topic",
      permanent: true,
    },
  ],
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-DNS-Prefetch-Control", value: "on" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            `script-src 'self' 'unsafe-inline' ${VERCEL_ANALYTICS_HOST}${isDev ? " 'unsafe-eval'" : ""}`,
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob:",
            "font-src 'self'",
            `connect-src 'self'${isDev ? " ws:" : ""}`,
            "frame-ancestors 'none'",
          ].join("; "),
        },
      ],
    },
  ],
};

export default withAnalyzer(nextConfig);
