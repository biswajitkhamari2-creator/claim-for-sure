import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section, P, UL, Callout } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — ClaimForSure" },
      { name: "description", content: "Terms governing the use of ClaimForSure's insurance claim assistance services." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="January 2026">
      <Section title="1. About Claim For Sure">
        <P>
          Claim For Sure is an <strong>independent insurance claim assistance platform</strong>. We
          are a helping body that assists policyholders in navigating the insurance claim process.
        </P>
        <P><strong>We are NOT:</strong></P>
        <UL items={[
          "An insurance company",
          "An insurance broker or agent",
          "A Third Party Administrator (TPA)",
          "A law firm (though we work with legal professionals)",
        ]} />
        <P>
          All our services are advisory, documentation support, and representation-based in nature.
          We assist you in presenting your case effectively to insurance companies and regulatory
          authorities.
        </P>
      </Section>

      <Section title="2. No Guarantee of Claim Approval">
        <Callout tone="danger">
          <p className="font-semibold">
            Important: Claim For Sure does NOT guarantee approval or success of any insurance claim.
          </p>
        </Callout>
        <P>The outcome of any insurance claim depends entirely on:</P>
        <UL items={[
          "The terms and conditions of your insurance policy",
          "The rules and guidelines of the insurance company",
          "The completeness and accuracy of documentation provided",
          "Applicable insurance laws and regulations (IRDAI guidelines)",
          "Decisions of regulatory bodies, Ombudsman, or courts",
          "Facts and circumstances specific to your case",
        ]} />
        <P>
          We provide our best efforts to assist you, but the final decision on claim approval rests
          solely with the insurance company or the relevant judicial/regulatory authority.
        </P>
      </Section>

      <Section title="3. Nature of Our Services">
        <P>Our services include but are not limited to:</P>
        <UL items={[
          "Case evaluation and eligibility assessment",
          "Documentation review and preparation",
          "Filing claims and follow-ups with insurance companies",
          "Escalation to IRDAI, Insurance Ombudsman",
          "Representation in Consumer Courts (through legal partners)",
          "Negotiation and settlement assistance",
        ]} />
      </Section>

      <Section title="4. User Responsibilities">
        <P>By using our services, you agree to:</P>
        <UL items={[
          "Provide accurate, complete, and truthful information",
          "Submit genuine and unaltered documents",
          "Cooperate with our team during the claim process",
          "Pay applicable fees as per our pricing structure",
          "Not engage in any fraudulent or illegal activities",
        ]} />
      </Section>

      <Section title="5. Fees and Payments">
        <P>Our fee structure includes:</P>
        <UL items={[
          <><strong>Processing Fee (₹3,000 – ₹5,000):</strong> Non-refundable fee for case handling</>,
          <><strong>Success Fee (8% – 18%):</strong> Payable only after successful claim settlement</>,
        ]} />
        <Callout tone="danger">
          <p className="font-bold">⚠️ IMPORTANT: Processing Fees are NON-REFUNDABLE</p>
          <p className="mt-2 text-sm">
            Once paid, processing fees cannot be refunded under any circumstances, regardless of the
            outcome of your claim. This fee covers the administrative costs of case evaluation,
            documentation review, and initial processing of your claim.
          </p>
        </Callout>
        <P>Detailed pricing depends on claim type and complexity.</P>
      </Section>

      <Section title="6. Right to Accept or Reject Cases">
        <P>
          Claim For Sure reserves the absolute right to accept or reject any case at our sole
          discretion. We may decline cases that we assess as having very low chances of success or
          cases involving fraudulent claims.
        </P>
      </Section>

      <Section title="7. Termination of Service">
        <P>We may immediately terminate our services if:</P>
        <UL items={[
          "False or misleading information is provided",
          "Forged or tampered documents are submitted",
          "Any illegal or fraudulent activity is detected",
          "Non-payment of agreed fees",
          "Non-cooperation with our team",
        ]} />
      </Section>

      <Section title="8. Limitation of Liability">
        <P>
          Claim For Sure shall not be liable for any direct, indirect, incidental, or consequential
          damages arising from the use of our services or the outcome of any claim. Our maximum
          liability is limited to the fees paid by you for our services.
        </P>
      </Section>

      <Section title="9. Governing Law & Jurisdiction">
        <P>
          These Terms & Conditions are governed by the laws of India. Any disputes shall be subject
          to the exclusive jurisdiction of the courts in Odisha, India.
        </P>
      </Section>
    </LegalPage>
  );
}
