import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section, P, Callout } from "@/components/LegalPage";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — ClaimForSure" },
      { name: "description", content: "Official communication channels and service disclaimers for ClaimForSure." },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer" updated="January 2026">
      <Callout tone="warning">
        <h2 className="font-serif text-xl font-bold">⚠️ Important Communication Notice</h2>
        <p className="mt-3 font-semibold">
          Claim For Sure currently operates ONLY through the following official channels:
        </p>
        <ul className="ml-5 mt-2 list-disc space-y-1">
          <li><strong>Email:</strong> support@claimforsure.in</li>
          <li><strong>Phone:</strong> +91 94384 63174 / +91 94395 72073</li>
          <li><strong>WhatsApp:</strong> +91 94384 63174</li>
        </ul>
        <div className="mt-4 border-t border-amber-300 pt-4">
          <p className="font-bold">🚫 NO SOCIAL MEDIA PRESENCE</p>
          <p className="mt-2">
            We are <strong>NOT</strong> associated with any social media platforms including but not
            limited to Facebook, Instagram, Twitter/X, LinkedIn, YouTube, or Telegram. Any account
            claiming to represent Claim For Sure on these platforms is <strong>FRAUDULENT</strong>{" "}
            and not affiliated with us.
          </p>
          <p className="mt-2 font-medium">
            Please do not share any personal or financial information with anyone claiming to be from
            Claim For Sure on social media. Report such accounts immediately.
          </p>
        </div>
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
