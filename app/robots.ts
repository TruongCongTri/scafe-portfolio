import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/vi/manage", "/en/manage"] }, sitemap: `${site.url}/sitemap.xml` };
}
