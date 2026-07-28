import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section, P, UL, Callout } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — ClaimForSure" },
      { name: "description", content: "Terms and Conditions governing the use of ClaimForSure, an initiative of Sidheswar Enterprises." },
      { name: "keywords", content: "ClaimForSure terms and conditions, legal terms, service terms" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:title", content: "Terms & Conditions — ClaimForSure" },
      { property: "og:description", content: "Terms and Conditions governing the use of ClaimForSure." },
      { property: "og:url", content: "https://www.claimforsure.in/terms" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.claimforsure.in/favicon.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.claimforsure.in/favicon.png" },
    ],
    links: [{ rel: "canonical", href: "https://www.claimforsure.in/terms" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.claimforsure.in/" },
            { "@type": "ListItem", position: 2, name: "Terms & Conditions", item: "https://www.claimforsure.in/terms" },
          ],
        }),
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="03 July 2026">
      <P>
        Welcome to <strong>Claim For Sure</strong>, a service and brand operated as a{" "}
        <strong>branch of Sidheswar Enterprises</strong>. By accessing or using this website, you
        agree to be bound by these Terms and Conditions. If you do not agree with these Terms,
        please discontinue the use of our website and services.
      </P>

      <Section title="1. About Us">
        <P>
          <strong>Claim For Sure</strong> is a service brand of{" "}
          <strong>Sidheswar Enterprises</strong>, a sole proprietorship firm registered in India
          (MSME / Udyam Reg. No. <strong>UDYAM-OD-29-0025578</strong>), owned and operated by its
          sole proprietor. The proprietor is an IRDAI-licensed POSP (Point of Sales Person)
          authorised through RenewBuy. Claim For Sure is an early-stage venture that operates as an
          independent information and assistance platform to help users understand, prepare,
          organize, and submit claim- and grievance-related applications and supporting
          documentation.
        </P>
        <P>
          We are <strong>not</strong> an insurance company, bank, government authority, court,
          regulator, law firm, or claims settlement authority unless expressly stated.
        </P>
      </Section>

      <Section title="2. Nature of Our Services">
        <P>Our services may include:</P>
        <UL items={[
          "Guidance on claim and grievance procedures.",
          "Assistance in organizing documents.",
          "Drafting or formatting applications and complaints.",
          "Providing general information regarding claim-related processes.",
        ]} />
        <P>
          Our services are intended solely to assist users and should not be interpreted as legal,
          financial, or professional advice.
        </P>
      </Section>

      <Section title="3. No Guarantee or Promise">
        <P>Claim For Sure <strong>does not guarantee</strong>:</P>
        <UL items={[
          "Approval of any insurance claim.",
          "Approval of any financial, consumer, employment, or government claim.",
          "Payment of compensation, refund, settlement, or damages.",
          "Resolution of any complaint.",
          "Success before any court, tribunal, ombudsman, regulator, or authority.",
          "Any specific outcome, timeline, or decision.",
        ]} />
        <Callout tone="danger">
          <p className="font-semibold">
            The name "Claim For Sure" is a brand name only. It does not represent or imply any
            promise, assurance, warranty, or guarantee that a user's claim will be approved or that
            compensation or any other relief will be obtained.
          </p>
        </Callout>
        <P>
          All decisions are made solely by the relevant insurance company, financial institution,
          employer, government authority, regulatory body, ombudsman, tribunal, court, or other
          competent authority.
        </P>
      </Section>

      <Section title="4. User Responsibilities">
        <P>By using our services, you agree that:</P>
        <UL items={[
          "All information provided by you is true, accurate, and complete.",
          "All uploaded documents are genuine and lawfully submitted.",
          "You are responsible for reviewing all information before submission.",
          "You will comply with all applicable laws and procedural requirements.",
        ]} />
        <P>
          Claim For Sure shall not be responsible for any loss arising from false, incomplete,
          inaccurate, or misleading information provided by the user.
        </P>
      </Section>

      <Section title="5. No Legal or Professional Advice">
        <P>
          The information provided through this website is for general informational and assistance
          purposes only.
        </P>
        <P>
          Nothing on this website shall be construed as legal advice, financial advice, tax advice,
          insurance advice, or any other professional opinion.
        </P>
        <P>Users should consult qualified professionals whenever professional advice is required.</P>
      </Section>

      <Section title="6. Limitation of Liability">
        <P>
          To the fullest extent permitted under applicable law, <strong>Claim For Sure</strong> and{" "}
          <strong>Sidheswar Enterprises</strong>, including their owners, employees, representatives,
          consultants, affiliates, and partners, shall not be liable for:
        </P>
        <UL items={[
          "Claim rejection.",
          "Delays in processing.",
          "Loss of compensation or benefits.",
          "Financial or business losses.",
          "Indirect, incidental, special, or consequential damages.",
          "Decisions made by third parties.",
          "Technical interruptions or circumstances beyond reasonable control.",
        ]} />
        <P>Use of this website and its services is entirely at the user's own risk.</P>
      </Section>

      <Section title="7. Third-Party Decisions">
        <P>
          Claim For Sure has no authority to approve, reject, influence, or alter decisions made by
          insurance companies, banks, employers, government departments, courts, regulators,
          ombudsmen, or any other third-party organization.
        </P>
      </Section>

      <Section title="8. Intellectual Property">
        <P>
          All website content, including text, graphics, logos, branding, software, documents, and
          designs, is the intellectual property of <strong>Sidheswar Enterprises</strong> or its
          licensors unless otherwise stated.
        </P>
        <P>
          Unauthorized copying, distribution, modification, or commercial use is prohibited without
          prior written permission.
        </P>
      </Section>

      <Section title="9. Privacy">
        <P>Your use of this website is also governed by our Privacy Policy.</P>
      </Section>

      <Section title="10. Amendments">
        <P>
          Claim For Sure and Sidheswar Enterprises reserve the right to modify these Terms and
          Conditions at any time. Updated versions become effective immediately upon publication on
          the website.
        </P>
      </Section>

      <Section title="11. Governing Law">
        <P>
          These Terms and Conditions shall be governed by and interpreted in accordance with the
          laws of the Republic of India.
        </P>
        <P>
          Any dispute arising from the use of this website shall be subject to the exclusive
          jurisdiction of the competent courts having jurisdiction over the registered office of{" "}
          <strong>Sidheswar Enterprises</strong>.
        </P>
      </Section>

      <Section title="12. Contact">
        <P>
          For any questions regarding these Terms and Conditions, users may contact us through the
          official contact details published on this website.
        </P>
      </Section>

      <Section title="Legal Disclaimer">
        <Callout tone="danger">
          <p className="font-semibold">
            Claim For Sure is a branch of Sidheswar Enterprises and operates solely as an
            independent claim assistance and information platform. We do not guarantee the approval
            of any claim, compensation, refund, settlement, legal relief, or any favorable outcome.
            All final decisions are made exclusively by the concerned insurance company, financial
            institution, employer, government authority, regulatory body, ombudsman, tribunal,
            court, or other competent authority. By using our services, you acknowledge and agree
            that no representation, warranty, or guarantee of success has been made by Claim For
            Sure or Sidheswar Enterprises.
          </p>
        </Callout>
      </Section>
    </LegalPage>
  );
}