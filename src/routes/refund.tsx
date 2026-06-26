import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section, P } from "@/components/LegalPage";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — ClaimForSure" },
      { name: "description", content: "ClaimForSure refund policy for service charges and processing fees." },
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
