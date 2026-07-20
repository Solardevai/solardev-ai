import type { Metadata } from "next";
import {
  LegalList,
  LegalPageLayout,
  LegalSection,
} from "../../components/legal-page-layout";
import { legalConfig } from "../../lib/legal-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy information explaining how SolarDev AI processes personal data.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const legalLinkClass =
  "font-semibold text-amber-400 underline decoration-amber-400/40 underline-offset-4 transition hover:text-amber-300";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      introduction="This policy explains how personal data is processed when you visit SolarDev AI, contact us, request support, enquire about corporate licensing or purchase a digital product through Stripe."
    >
      <LegalSection title="1. Data controller">
        <p>
          The controller responsible for personal data processed directly
          through this website is:
        </p>

        <LegalList>
          <li>
            Trading name: <strong>{legalConfig.tradingName}</strong>
          </li>

          <li>
            Legal operator: <strong>{legalConfig.operatorName}</strong>
          </li>

          <li>
            Legal form: <strong>{legalConfig.legalForm}</strong>
          </li>

          <li>
            Tax identification: <strong>{legalConfig.taxId}</strong>
          </li>

          <li>
            Registered address:{" "}
            <strong>{legalConfig.businessAddress}</strong>
          </li>

          <li>
            Country of establishment:{" "}
            <strong>{legalConfig.countryOfEstablishment}</strong>
          </li>

          <li>
            Privacy contact:{" "}
            <a
              href={`mailto:${legalConfig.privacyEmail}`}
              className={legalLinkClass}
            >
              {legalConfig.privacyEmail}
            </a>
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="2. Personal data we may collect">
        <p>
          Depending on how you interact with {legalConfig.tradingName}, we may
          process:
        </p>

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
            Order and transaction information received from Stripe, such as
            the order reference, product purchased, transaction status,
            purchasing email address, country, currency and limited billing
            information.
          </li>

          <li>
            Product-delivery and licence information, such as download status,
            access issues, licence type and communications relating to the
            purchased product.
          </li>

          <li>
            Technical and usage information, such as IP address, browser type,
            device information, referring page, pages viewed and interaction
            data, where collected through permitted analytics, hosting or
            security technologies.
          </li>

          <li>
            Marketing preferences, where you have actively subscribed to
            receive product updates or other communications.
          </li>
        </LegalList>

        <p>
          Payment information is entered directly into Stripe&apos;s hosted
          checkout. SolarDev AI does not receive or store complete payment-card
          numbers, card security codes or complete bank-account credentials.
        </p>
      </LegalSection>

      <LegalSection title="3. Purposes and legal bases">
        <p>
          We may process personal data for the following purposes and legal
          bases:
        </p>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/[0.04] text-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Purpose</th>

                <th className="px-4 py-3 font-semibold">
                  Typical legal basis
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10 text-slate-300">
              <tr>
                <td className="px-4 py-3">
                  Responding to enquiries and support requests
                </td>

                <td className="px-4 py-3">
                  Steps requested before entering a contract, contract
                  performance or legitimate interests in customer
                  communication
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3">
                  Processing orders and supporting payment administration
                </td>

                <td className="px-4 py-3">
                  Contract performance and legal obligations
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3">
                  Providing product access, delivery and licensing
                </td>

                <td className="px-4 py-3">Contract performance</td>
              </tr>

              <tr>
                <td className="px-4 py-3">
                  Accounting, tax and regulatory compliance
                </td>

                <td className="px-4 py-3">Legal obligation</td>
              </tr>

              <tr>
                <td className="px-4 py-3">
                  Website security, fraud prevention and misuse prevention
                </td>

                <td className="px-4 py-3">
                  Legitimate interests and, where applicable, legal obligations
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3">
                  Website measurement and non-essential analytics
                </td>

                <td className="px-4 py-3">
                  Consent where required by applicable law
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3">
                  Email marketing and product updates
                </td>

                <td className="px-4 py-3">
                  Consent unless another lawful basis applies
                </td>
              </tr>

              <tr>
                <td className="px-4 py-3">
                  Establishing, exercising or defending legal claims
                </td>

                <td className="px-4 py-3">
                  Legitimate interests and applicable legal obligations
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="4. Checkout and payment processing">
        <p>
          Purchases are completed through Stripe, which provides hosted
          checkout and payment-processing services to{" "}
          {legalConfig.tradingName}.
        </p>

        <p>
          The seller and merchant of record for SolarDev AI digital products is{" "}
          {legalConfig.operatorName}, trading as{" "}
          {legalConfig.tradingName}. Stripe does not become the seller or
          merchant of record solely by providing checkout and
          payment-processing services.
        </p>

        <p>
          Stripe processes information required to complete and secure a
          transaction. This may include payment details, billing information,
          transaction identifiers, transaction status, device information,
          fraud-prevention information and information required to comply with
          financial or regulatory obligations.
        </p>

        <p>
          SolarDev AI may receive limited customer and transaction information
          from Stripe where required to:
        </p>

        <LegalList>
          <li>Confirm and administer the purchase.</li>
          <li>Deliver or provide access to the purchased product.</li>
          <li>Provide payment, access and customer support.</li>
          <li>Manage individual, team or corporate licences.</li>
          <li>Investigate duplicate, disputed or potentially fraudulent orders.</li>
          <li>
            Maintain accounting, tax, transaction and legal-compliance records.
          </li>
        </LegalList>

        <p>
          Stripe processes personal data according to its own privacy
          documentation. Customers should review the information presented
          during checkout and Stripe&apos;s{" "}
          <a
            href="https://stripe.com/privacy"
            target="_blank"
            rel="noreferrer"
            className={legalLinkClass}
          >
            Privacy Policy
          </a>{" "}
          before completing a purchase.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies and analytics">
        <p>
          The website may use strictly necessary technologies for security,
          navigation, fraud prevention and core website functionality. These
          technologies may operate without consent where permitted by
          applicable law.
        </p>

        <p>
          {legalConfig.tradingName} uses Google Analytics to understand website
          usage, measure interactions and improve website performance.
        </p>

        <p>
          Where consent is required by applicable law, non-essential analytics
          technologies are activated only after the visitor has provided
          consent through the website&apos;s cookie-preference controls.
        </p>

        <p>
          Visitors can reject non-essential analytics technologies and can
          change or withdraw their preferences through the website&apos;s
          consent controls. Withdrawal of consent does not affect the
          lawfulness of processing carried out before consent was withdrawn.
        </p>

        <p>
          Google processes information collected through Google Analytics
          according to its own{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
            className={legalLinkClass}
          >
            Privacy Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. Recipients and service providers">
        <p>
          Personal data may be disclosed only where reasonably necessary to
          service providers and other recipients supporting the website,
          transactions and business operations, including:
        </p>

        <LegalList>
          <li>
            Hosting and infrastructure provider:{" "}
            {legalConfig.hostingProvider}
          </li>

          <li>Checkout and payment-processing provider: Stripe</li>

          <li>
            Analytics provider: {legalConfig.analyticsProvider}
          </li>

          <li>
            Email, communications, document-delivery or customer-support
            providers used by the operator
          </li>

          <li>
            Accountants, legal advisers, technical advisers and other
            professional service providers
          </li>

          <li>
            Banks, payment institutions or card issuers where required to
            administer a transaction, refund or payment dispute
          </li>

          <li>
            Courts, regulators, tax authorities, law-enforcement authorities
            or other public bodies where disclosure is required or permitted
            by law
          </li>
        </LegalList>

        <p>
          Service providers are expected to process personal data under
          appropriate contractual, confidentiality, privacy and security
          obligations.
        </p>

        <p>
          SolarDev AI does not sell personal data to third parties.
        </p>
      </LegalSection>

      <LegalSection title="7. International data transfers">
        <p>
          Some service providers, including providers of payment, hosting,
          analytics or communications services, may process personal data
          outside Portugal or the European Economic Area.
        </p>

        <p>
          Where personal data is transferred outside the European Economic
          Area and a transfer safeguard is required, the transfer will rely on
          an applicable legal mechanism, such as:
        </p>

        <LegalList>
          <li>A European Commission adequacy decision.</li>

          <li>
            European Commission standard contractual clauses or another
            approved contractual safeguard.
          </li>

          <li>
            An applicable data-privacy framework or certification recognised
            under European Union law.
          </li>

          <li>
            Another transfer mechanism or derogation permitted by applicable
            data-protection law.
          </li>
        </LegalList>

        <p>
          Further information about applicable safeguards may be requested
          through{" "}
          <a
            href={`mailto:${legalConfig.privacyEmail}`}
            className={legalLinkClass}
          >
            {legalConfig.privacyEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="8. Data retention">
        <p>
          Personal data is retained only for as long as reasonably necessary
          for the purpose for which it was collected, including:
        </p>

        <LegalList>
          <li>Contract and order administration.</li>
          <li>Product delivery, licence management and customer support.</li>
          <li>Accounting, tax and regulatory record keeping.</li>
          <li>Website security and fraud prevention.</li>
          <li>
            The establishment, exercise or defence of legal claims.
          </li>
        </LegalList>

        <p>
          Retention periods may vary depending on the category of data, the
          purpose of processing and applicable legal obligations.
        </p>

        <p>
          Current general retention schedule:{" "}
          <strong>{legalConfig.privacyRetentionPeriod}</strong>
        </p>

        <p>
          Data may be retained for a longer period where required by law,
          necessary to resolve a dispute or reasonably required to establish,
          exercise or defend legal claims.
        </p>
      </LegalSection>

      <LegalSection title="9. Your data-protection rights">
        <p>
          Subject to the conditions and limitations of applicable law, you may
          have the right to:
        </p>

        <LegalList>
          <li>Request confirmation that your personal data is processed.</li>

          <li>Request access to your personal data.</li>

          <li>Request correction of inaccurate or incomplete personal data.</li>

          <li>Request erasure of personal data in applicable circumstances.</li>

          <li>Request restriction of processing.</li>

          <li>
            Object to processing based on legitimate interests, including
            direct marketing.
          </li>

          <li>
            Withdraw consent at any time for future processing based on
            consent.
          </li>

          <li>Request data portability where applicable.</li>

          <li>
            Lodge a complaint with a competent data-protection supervisory
            authority.
          </li>
        </LegalList>

        <p>
          To exercise a data-protection right, contact{" "}
          <a
            href={`mailto:${legalConfig.privacyEmail}`}
            className={legalLinkClass}
          >
            {legalConfig.privacyEmail}
          </a>
          . We may request proportionate information to verify your identity
          before acting on a request.
        </p>

        <p>
          You may also lodge a complaint with the Portuguese supervisory
          authority, the Comissão Nacional de Proteção de Dados (CNPD), or
          another competent supervisory authority where permitted by
          applicable law.
        </p>

        <p>
          Information about the CNPD and its complaint procedures is available
          on the{" "}
          <a
            href="https://www.cnpd.pt/"
            target="_blank"
            rel="noreferrer"
            className={legalLinkClass}
          >
            CNPD website
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="10. Security">
        <p>
          Reasonable technical and organisational measures are used to protect
          personal data against accidental or unlawful destruction, loss,
          alteration, unauthorised disclosure or access.
        </p>

        <p>
          These measures may include access controls, secure hosting,
          encrypted communications, restricted administrative access,
          transaction monitoring, software maintenance and appropriate
          service-provider controls.
        </p>

        <p>
          No internet-based service, transmission or storage system can be
          guaranteed to be completely secure.
        </p>
      </LegalSection>

      <LegalSection title="11. Children">
        <p>
          {legalConfig.tradingName} products and services are intended for
          professional and business users and are not directed to children.
        </p>

        <p>
          We do not knowingly collect personal data from children through this
          website. A parent or legal guardian who believes that a child has
          submitted personal data should contact{" "}
          <a
            href={`mailto:${legalConfig.privacyEmail}`}
            className={legalLinkClass}
          >
            {legalConfig.privacyEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to this policy">
        <p>
          This Privacy Policy may be updated to reflect changes in the website,
          products, service providers, legal requirements or personal-data
          processing activities.
        </p>

        <p>
          The current version and its most recent update date will be published
          on this page. Material changes may also be communicated through the
          website or another appropriate channel where required.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          Privacy questions and data-protection rights requests:{" "}
          <a
            href={`mailto:${legalConfig.privacyEmail}`}
            className={legalLinkClass}
          >
            {legalConfig.privacyEmail}
          </a>
          <br />
          General enquiries:{" "}
          <a
            href={`mailto:${legalConfig.generalEmail}`}
            className={legalLinkClass}
          >
            {legalConfig.generalEmail}
          </a>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}