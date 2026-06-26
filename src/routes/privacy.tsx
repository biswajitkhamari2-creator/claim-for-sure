import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section, P } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ClaimForSure" },
      { name: "description", content: "How ClaimForSure collects, uses, and protects your personal data during insurance claim assistance." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="January 2026">
      <P>Claim For Sure respects your privacy and is committed to protecting your personal data.</P>

      <Section title="Information We Collect">
        <P>
          We collect personal details, insurance information, uploaded documents, and communication
          records only for claim processing and support.
        </P>
      </Section>

      <Section title="How We Use Your Information">
        <P>
          We do not sell or misuse personal data. Information may only be shared with internal teams,
          claim professionals, or government authorities if legally required.
        </P>
      </Section>

      <Section title="Data Security">
        <P>All uploaded documents are stored securely and accessed only by authorized personnel.</P>
      </Section>

      <Section title="Your Rights">
        <P>Users may request access, correction, or deletion of their personal data at any time.</P>
      </Section>

      <Section title="Cookies">
        <P>We may use cookies to improve website functionality and user experience.</P>
      </Section>

      <Section title="Acceptance">
        <P>Continued use of the website implies acceptance of this policy.</P>
      </Section>
    </LegalPage>
  );
}
