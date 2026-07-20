import type { Metadata } from "next";
import {
  LegalList,
  LegalOrderedList,
  LegalPageLayout,
  LegalSection,
} from "../../components/legal-page-layout";
import { legalConfig } from "../../lib/legal-config";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Refund, digital-delivery and withdrawal conditions for SolarDev AI digital products.",
  alternates: {
    canonical: "/refund-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const legalLinkClass =
  "font-semibold text-amber-400 underline decoration-amber-400/40 underline-offset-4 transition hover:text-amber-300";

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Refund Policy"
      introduction="This policy explains how refund requests, digital-delivery issues and statutory withdrawal rights are handled for SolarDev AI digital products."
    >
      <LegalSection title="1. Digital-product delivery">
        <p>
          {legalConfig.tradingName} products are digital content normally made
          available electronically after successful payment through a download
          link, confirmation page, email or another delivery method identified
          during checkout.
        </p>

        <p>
          Stripe processes the payment transaction.{" "}
          {legalConfig.tradingName} is responsible for making the purchased
          digital product available to the customer after successful payment.
        </p>

        <p>
          Customers should verify that the email address entered during
          checkout is correct and should check spam, junk and promotional
          folders where a delivery email is expected.
        </p>

        <p>
          Delivery or access problems should be reported promptly to{" "}
          <a
            href={`mailto:${legalConfig.supportEmail}`}
            className={legalLinkClass}
          >
            {legalConfig.supportEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Seller, payment and refund processing">
        <p>
          The seller of {legalConfig.tradingName} digital products is{" "}
          {legalConfig.operatorName}, trading as{" "}
          {legalConfig.tradingName}.
        </p>

        <p>
          Payments are processed securely through Stripe using a
          Stripe-hosted checkout page. Stripe provides checkout and
          payment-processing services and does not become the seller solely by
          processing the transaction.
        </p>

        <p>
          {legalConfig.tradingName} reviews and decides refund requests in
          accordance with this Refund Policy, the applicable{" "}
          <a href="/terms" className={legalLinkClass}>
            Terms of Sale
          </a>{" "}
          and mandatory consumer law.
        </p>

        <p>
          Where a refund is approved, {legalConfig.tradingName} initiates the
          refund through Stripe. Stripe then submits the refund to the
          customer&apos;s bank, card issuer or payment provider.
        </p>
      </LegalSection>

      <LegalSection title="3. Statutory withdrawal and immediate digital delivery">
        <p>
          Consumers may normally have a statutory withdrawal period for
          contracts concluded at a distance. Different rules may apply to paid
          digital content that is not supplied on a tangible medium and is
          made available immediately.
        </p>

        <p>
          Where required by applicable law, the statutory right of withdrawal
          may be lost after supply begins only where the consumer has:
        </p>

        <LegalList>
          <li>
            Given prior express consent for supply of the digital content to
            begin before the end of the applicable withdrawal period.
          </li>

          <li>
            Expressly acknowledged that the right of withdrawal will be lost
            once supply begins.
          </li>

          <li>
            Received confirmation of the contract, including the express
            consent and acknowledgement, in an email or another durable
            electronic format.
          </li>
        </LegalList>

        <p>
          Acceptance of the Terms of Sale does not, by itself, replace any
          separate express consent or acknowledgement required by applicable
          law for immediate digital delivery.
        </p>

        <p>
          Where the legally required consent, acknowledgement or confirmation
          has not been properly obtained, the consumer retains any withdrawal
          rights and remedies provided by applicable mandatory law.
        </p>

        <p>
          This policy does not exclude or restrict mandatory rights concerning
          digital content that is not supplied, is inaccessible, is defective,
          is corrupted or does not materially conform to its description.
        </p>
      </LegalSection>

      <LegalSection title="4. When a refund or remedy may be approved">
        <p>
          Subject to the available evidence and applicable mandatory law, a
          full refund, partial refund, replacement, price reduction or another
          appropriate remedy may be considered in circumstances such as:
        </p>

        <LegalList>
          <li>A duplicate purchase or duplicate charge.</li>

          <li>
            A confirmed technical failure that prevents access or download and
            cannot be resolved within a reasonable period.
          </li>

          <li>
            A materially corrupted or unusable file that cannot reasonably be
            replaced.
          </li>

          <li>
            The supplied product is materially different from the description
            presented before purchase.
          </li>

          <li>
            The customer received the wrong digital product or edition.
          </li>

          <li>
            An unauthorised transaction supported by appropriate evidence.
          </li>

          <li>
            Another situation in which a refund, replacement, price reduction
            or other remedy is required by applicable law.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. Change-of-mind requests after access">
        <p>
          Because a complete digital product can be downloaded, accessed and
          retained after delivery, voluntary change-of-mind refunds are not
          normally offered once access or supply has begun, where:
        </p>

        <LegalList>
          <li>This position is permitted by applicable law.</li>

          <li>
            The consumer expressly requested that digital delivery begin
            immediately.
          </li>

          <li>
            The consumer acknowledged the consequences for the statutory right
            of withdrawal.
          </li>

          <li>
            Any legally required confirmation was provided in a durable
            electronic format.
          </li>
        </LegalList>

        <p>
          {legalConfig.tradingName} may nevertheless consider a voluntary
          refund request on a case-by-case basis. Considering or approving one
          request does not create an obligation to approve similar requests in
          the future.
        </p>

        <p>
          This section does not affect mandatory remedies for digital content
          that is defective, inaccessible, incorrectly supplied or otherwise
          non-conforming.
        </p>
      </LegalSection>

      <LegalSection title="6. Refund-request period">
        <p>
          Customers are asked to submit refund, access or delivery-related
          requests within {legalConfig.refundRequestWindowDays} days of
          purchase so that the circumstances can be investigated promptly.
        </p>

        <p>
          This administrative request period does not shorten or replace any
          longer mandatory limitation period, statutory guarantee or consumer
          right available under applicable law.
        </p>
      </LegalSection>

      <LegalSection title="7. How to request a refund or remedy">
        <LegalOrderedList>
          <li>
            Email{" "}
            <a
              href={`mailto:${legalConfig.supportEmail}`}
              className={legalLinkClass}
            >
              {legalConfig.supportEmail}
            </a>{" "}
            from the email address used for the purchase.
          </li>

          <li>
            Use the subject line: “Refund request — [order number]”.
          </li>

          <li>
            Include the order number, product name, purchase date and a concise
            explanation of the issue.
          </li>

          <li>
            For technical problems, include relevant screenshots, browser
            information or error details where available.
          </li>

          <li>
            Do not send passwords, complete payment-card numbers, security
            codes or other unnecessary sensitive payment information.
          </li>

          <li>
            Allow a reasonable period for investigation, troubleshooting and
            review before a decision is made.
          </li>
        </LegalOrderedList>
      </LegalSection>

      <LegalSection title="8. Troubleshooting and replacement">
        <p>
          Where a delivery, access or file problem can reasonably be corrected,
          {legalConfig.tradingName} may first provide troubleshooting
          assistance, a replacement link, a replacement file or another
          appropriate method of access.
        </p>

        <p>
          Customers are expected to cooperate reasonably with proportionate
          troubleshooting steps, including confirming the purchasing email
          address and providing relevant error information.
        </p>

        <p>
          Providing or accepting troubleshooting assistance or a replacement
          does not remove any remedy that cannot lawfully be excluded.
        </p>
      </LegalSection>

      <LegalSection title="9. Refund method and processing time">
        <p>
          Approved refunds are initiated by {legalConfig.tradingName} through
          Stripe and are normally returned to the original payment method where
          reasonably possible.
        </p>

        <p>
          After a refund has been initiated, Stripe submits the refund request
          to the customer&apos;s bank, card issuer or payment provider. Card
          refunds commonly become visible within approximately five to ten
          business days.
        </p>

        <p>
          The actual processing time depends on the payment method, bank, card
          issuer and banking system. {legalConfig.tradingName} cannot control
          delays occurring after the refund has been submitted to the relevant
          financial institution.
        </p>

        <p>
          In some circumstances, a refund issued shortly after the original
          payment may appear as a reversal of the original charge rather than
          as a separate refund entry.
        </p>
      </LegalSection>

      <LegalSection title="10. Chargebacks and payment disputes">
        <p>
          Customers are encouraged to contact{" "}
          <a
            href={`mailto:${legalConfig.supportEmail}`}
            className={legalLinkClass}
          >
            {legalConfig.supportEmail}
          </a>{" "}
          before initiating a chargeback so that delivery, access, duplication
          or product-conformity concerns can be investigated.
        </p>

        <p>
          This request does not prevent a customer from exercising rights
          available through a bank, card issuer, payment provider or applicable
          law.
        </p>

        <p>
          {legalConfig.tradingName} may provide transaction, delivery, access
          and correspondence records to Stripe or the relevant payment
          institution when responding to a payment dispute.
        </p>
      </LegalSection>

      <LegalSection title="11. Corporate and separately negotiated purchases">
        <p>
          Team licences, corporate access, training, consultancy and tailored
          services may have refund, cancellation, delivery and milestone terms
          set out in a separate quotation, order form, statement of work or
          written agreement.
        </p>

        <p>
          Where separate written terms apply, those terms govern the relevant
          purchase subject to any mandatory law that cannot be excluded or
          restricted.
        </p>
      </LegalSection>

      <LegalSection title="12. Mandatory rights preserved">
        <p>
          Nothing in this policy excludes, limits or restricts rights or
          remedies that cannot legally be excluded, limited or restricted.
        </p>

        <p>
          This includes mandatory rights relating to digital content that is
          not supplied, is inaccessible, is defective, lacks conformity or
          does not materially match its description.
        </p>
      </LegalSection>

      <LegalSection title="13. Relationship with the Terms of Sale">
        <p>
          This Refund Policy should be read together with the{" "}
          <a href="/terms" className={legalLinkClass}>
            Terms of Sale
          </a>
          .
        </p>

        <p>
          If this Refund Policy conflicts with a mandatory consumer right, the
          mandatory legal requirement will prevail.
        </p>
      </LegalSection>

      <LegalSection title="14. Changes to this policy">
        <p>
          The Refund Policy applicable to a completed purchase is generally
          the version presented when the order was placed, subject to
          applicable mandatory law.
        </p>

        <p>
          Updated versions may apply to future purchases and will be published
          with a revised update date.
        </p>
      </LegalSection>

      <LegalSection title="15. Contact">
        <p>
          Refund, payment, access and delivery requests:{" "}
          <a
            href={`mailto:${legalConfig.supportEmail}`}
            className={legalLinkClass}
          >
            {legalConfig.supportEmail}
          </a>
          <br />
          General product enquiries:{" "}
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