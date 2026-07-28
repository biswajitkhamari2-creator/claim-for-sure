import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section, P, Callout } from "@/components/LegalPage";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — ClaimForSure" },
      { name: "description", content: "Official communication channels and service disclaimers for ClaimForSure." },
      { name: "keywords", content: "ClaimForSure disclaimer, official channels, insurance advice disclaimer" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: "Disclaimer — ClaimForSure" },
      { property: "og:description", content: "Official communication channels and service disclaimers for ClaimForSure." },
      { property: "og:url", content: "https://www.claimforsure.in/disclaimer" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.claimforsure.in/favicon.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.claimforsure.in/favicon.png" },
    ],
    links: [{ rel: "canonical", href: "https://www.claimforsure.in/disclaimer" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.claimforsure.in/" },
            { "@type": "ListItem", position: 2, name: "Disclaimer", item: "https://www.claimforsure.in/disclaimer" },
          ],
        }),
      },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer" updated="January 2026">
      <Callout tone="warning">
        <h2 className="font-serif text-xl font-bold">⚠️ Important Communication Notice</h2>
        <p className="mt-3">
          Claim For Sure is a branch of <strong>Sidheswar Enterprises</strong>, registered under the
          Government of India's Udyam portal.
        </p>
        <p className="mt-1">
          <strong>Udyam Registration Number:</strong> UDYAM-OD-29-0025578
        </p>
        <p className="mt-3 font-semibold">
          Claim For Sure currently operates ONLY through the following official channels:
        </p>
        <ul className="ml-5 mt-2 list-disc space-y-1">
          <li><strong>Email:</strong> support@claimforsure.in</li>
          <li><strong>Phone:</strong> +91 94391 51934 / +91 81445 03650</li>
          <li><strong>WhatsApp:</strong> +91 94391 51934</li>
        </ul>
      </Callout>

      <Section title="Service Limitations">
        <P>Claim For Sure does not provide insurance, underwriting, or policy issuance services.</P>
      </Section>

      <Section title="No Guarantee">
        <P>We do not guarantee claim approval or settlement amounts.</P>
      </Section>

      <Section title="Basis of Assistance">
        <P>All assistance is based on information provided by users and standard industry practices.</P>
      </Section>

      <Section title="Final Decisions">
        <P>Final decisions always rest with insurance companies, regulators, or legal authorities.</P>
      </Section>

      <Section title="Limitation of Liability">
        <P>
          By using this platform, users agree that Claim For Sure shall not be held liable for claim
          outcomes, delays, or insurer decisions.
        </P>
      </Section>
    </LegalPage>
  );
}
