import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section, P } from "@/components/LegalPage";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — ClaimForSure" },
      { name: "description", content: "ClaimForSure refund policy for service charges and processing fees." },
      { name: "keywords", content: "ClaimForSure refund policy, fee refund terms, success fee policy" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: "Refund Policy — ClaimForSure" },
      { property: "og:description", content: "ClaimForSure refund policy covering service charges, processing fees, and discretionary refunds." },
      { property: "og:url", content: "https://www.claimforsure.in/refund" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.claimforsure.in/favicon.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.claimforsure.in/favicon.png" },
    ],
    links: [{ rel: "canonical", href: "https://www.claimforsure.in/refund" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.claimforsure.in/" },
            { "@type": "ListItem", position: 2, name: "Refund Policy", item: "https://www.claimforsure.in/refund" },
          ],
        }),
      },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <LegalPage title="Refund Policy" updated="January 2026">
      <Section title="Service Charges">
        <P>
          Service charges, if applicable, are collected for professional assistance, documentation
          support, and claim handling services.
        </P>
      </Section>

      <Section title="Non-Refundable Services">
        <P>Once a case review or service process has started, fees are generally non-refundable.</P>
      </Section>

      <Section title="Discretionary Refunds">
        <P>
          Refunds, if any, are purely at the discretion of Claim For Sure management based on case
          circumstances.
        </P>
      </Section>

      <Section title="Claim Rejection">
        <P>
          Claim outcome or rejection by the insurance company does not make the service eligible for
          a refund.
        </P>
      </Section>
    </LegalPage>
  );
}
