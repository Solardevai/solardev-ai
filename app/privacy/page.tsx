import type { Metadata } from "next";
import {
  LegalCallout,
  LegalList,
  LegalPageLayout,
  LegalSection,
} from "../../components/legal-page-layout";
import { legalConfig } from "../../lib/legal-config";

export const metadata: Metadata = {
  title: "Privacy Policy | SolarDev AI",
  description:
    "How SolarDev AI collects, uses, stores and protects personal data.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      introduction="This policy explains how personal data is processed when you visit SolarDev AI, contact us, request support, enquire about corporate licensing or purchase a digital product through our checkout provider."
    >
      <LegalCallout>
        This page is a structured template. Complete all bracketed placeholders,
        verify the actual services and cookies used by the website, and obtain
        professional legal review before publication.
      </LegalCallout>

      <LegalSection title="1. Data controller">
        <p>
          The controller responsible for personal data processed directly through
          this website is:
        </p>
        <LegalList>
          <li>
            Legal name: <strong>{legalConfig.operatorName}</strong>
          </li>
          <li>
            Legal form: <strong>{legalConfig.legalForm}</strong>
          </li>
          <li>
            Tax identification: <strong>{legalConfig.taxId}</strong>
          </li>
          <li>
            Registered address: <strong>{legalConfig.businessAddress}</strong>
          </li>
          <li>
            Country of establishment: <strong>{legalConfig.countryOfEstablishment}</strong>
          </li>
          <li>
            Privacy contact: <strong>{legalConfig.privacyEmail}</strong>
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="2. Personal data we may collect">
        <p>Depending on how you interact with SolarDev AI, we may process:</p>
        <LegalList>
          <li>
            Identity and contact information, such as your name, email address,
            organisation and job title.
          </li>
          <li>
            Enquiry and support information contained in messages sent to us.
          </li>
          <li>
            Corporate-licensing information, including organisation size,
            intended number of users and professional use case.
          </li>
          <li>
            Order-support information received from {legalConfig.merchantOfRecord},
            such as order reference, product purchased, transaction status,
            country, currency and limited customer details. SolarDev AI does not
            need to receive or store complete payment-card details.
          </li>
          <li>
            Technical and usage information, such as IP address, browser type,
            device information, referring page, pages viewed and interaction data,
            where collected through permitted analytics or security technologies.
          </li>
          <li>
            Marketing preferences, where you have actively subscribed to receive
            updates or resources.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="3. Purposes and legal bases">
        <p>We may process personal data for the following purposes:</p>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/[0.04] text-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Purpose</th>
                <th className="px-4 py-3 font-semibold">Typical legal basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-300">
              <tr>
                <td className="px-4 py-3">Responding to enquiries and support requests</td>
                <td className="px-4 py-3">
                  Steps requested before a contract, contract performance or
                  legitimate interests in customer communication
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">Supporting product access, licensing and delivery</td>
                <td className="px-4 py-3">Contract performance</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Accounting, tax and legal compliance</td>
                <td className="px-4 py-3">Legal obligation</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Website security and misuse prevention</td>
                <td className="px-4 py-3">Legitimate interests</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Non-essential analytics</td>
                <td className="px-4 py-3">Consent, where required</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Email marketing and product updates</td>
                <td className="px-4 py-3">Consent, unless another lawful basis applies</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="4. Checkout and payment processing">
        <p>
          Purchases are completed through {legalConfig.merchantOfRecord}, which
          acts as the merchant of record for transactions processed through its
          checkout. It handles payment collection, applicable sales taxes or VAT,
          transaction receipts, refunds and chargebacks under its own terms and
          privacy documentation.
        </p>
        <p>
          SolarDev AI may receive limited order information needed to deliver the
          product, manage licences, respond to support requests and maintain
          business records. Please review the checkout provider&apos;s notices before
          completing a purchase.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies and analytics">
        <p>
          The website may use strictly necessary technologies for security,
          navigation and core functionality. Non-essential analytics or marketing
          technologies should only be activated where a valid legal basis exists,
          including consent where required.
        </p>
        <p>
          The current analytics provider is identified as {legalConfig.analyticsProvider}.
          Before publishing this policy, verify the exact analytics configuration,
          consent mechanism, cookie names, retention settings and whether any
          advertising features are enabled.
        </p>
        <p>
          Visitors must be able to reject non-essential cookies as easily as they
          accept them and to change their preferences later through the website&apos;s
          consent controls.
        </p>
      </LegalSection>

      <LegalSection title="6. Recipients and service providers">
        <p>
          Personal data may be shared only where necessary with service providers
          supporting the website and business operations, including:
        </p>
        <LegalList>
          <li>Hosting and infrastructure provider: {legalConfig.hostingProvider}</li>
          <li>Checkout and merchant-of-record provider: {legalConfig.merchantOfRecord}</li>
          <li>Analytics provider: {legalConfig.analyticsProvider}</li>
          <li>Email, customer-support or professional advisers used by the operator</li>
          <li>Public authorities where disclosure is required by law</li>
        </LegalList>
        <p>
          Service providers should process personal data under appropriate
          contractual, confidentiality and security obligations.
        </p>
      </LegalSection>

      <LegalSection title="7. International data transfers">
        <p>
          Some service providers may process data outside the European Economic
          Area. Where this occurs, the operator will rely on a legally recognised
          transfer mechanism, such as an adequacy decision, approved contractual
          safeguards or another mechanism permitted by applicable data-protection
          law.
        </p>
      </LegalSection>

      <LegalSection title="8. Data retention">
        <p>
          Personal data is retained only for as long as reasonably necessary for
          the relevant purpose, including contract administration, customer
          support, security, accounting and the establishment or defence of legal
          claims.
        </p>
        <p>
          Current retention schedule: <strong>{legalConfig.privacyRetentionPeriod}</strong>
        </p>
      </LegalSection>

      <LegalSection title="9. Your data-protection rights">
        <p>
          Subject to the conditions and limitations of applicable law, you may
          have the right to:
        </p>
        <LegalList>
          <li>Request access to your personal data.</li>
          <li>Request correction of inaccurate or incomplete data.</li>
          <li>Request erasure of personal data.</li>
          <li>Request restriction of processing.</li>
          <li>Object to processing based on legitimate interests.</li>
          <li>Withdraw consent at any time for future processing based on consent.</li>
          <li>Request data portability where applicable.</li>
          <li>Lodge a complaint with a competent supervisory authority.</li>
        </LegalList>
        <p>
          Requests should be sent to {legalConfig.privacyEmail}. We may ask for
          proportionate information to verify identity before acting on a request.
          You may also lodge a complaint with the Portuguese data-protection
supervisory authority, the Comissão Nacional de Proteção de Dados
(CNPD), or with another competent supervisory authority where permitted
under applicable data-protection law.
        </p>
      </LegalSection>

      <LegalSection title="10. Security">
        <p>
          Reasonable technical and organisational measures are used to protect
          personal data against accidental or unlawful destruction, loss,
          alteration, unauthorised disclosure or access. No internet-based system
          can be guaranteed to be completely secure.
        </p>
      </LegalSection>

      <LegalSection title="11. Children">
        <p>
          SolarDev AI products and services are intended for professional and
          business users and are not directed to children. We do not knowingly
          collect personal data from children through this website.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to this policy">
        <p>
          This policy may be updated to reflect changes in the website, service
          providers, legal requirements or processing activities. The current
          version and its update date will be published on this page.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          Privacy questions and rights requests: {legalConfig.privacyEmail}
          <br />
          General enquiries: {legalConfig.generalEmail}
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
