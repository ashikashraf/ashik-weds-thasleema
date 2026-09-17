import { createFileRoute } from "@tanstack/react-router";
import { WeddingInvitation } from "@/components/WeddingInvitation";

export const Route = createFileRoute("/")({
  component: WeddingInvitation,
  head: () => ({
    meta: [
      { title: "Ashik & Thasleema — Wedding Reception" },
      { name: "description", content: "Join Ashik Ashraf and Thasleema M for their wedding reception on 29 November 2026 at Zawaj Capitol, Kallekad." },
      { property: "og:title", content: "Ashik & Thasleema — Wedding Reception" },
      { property: "og:description", content: "Together with our families, we invite you to celebrate with us on 29 November 2026." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Event",
        name: "Ashik Ashraf & Thasleema M — Wedding Reception",
        startDate: "2026-11-29T11:30:00+05:30",
        endDate: "2026-11-29T14:30:00+05:30",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: { "@type": "Place", name: "Zawaj Capitol", address: "Kallekad, Kerala, India" },
      }),
    }],
  }),
});
