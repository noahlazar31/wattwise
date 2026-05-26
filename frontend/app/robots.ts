import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wattwise.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/my-bills", "/sign-in", "/sign-up"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
