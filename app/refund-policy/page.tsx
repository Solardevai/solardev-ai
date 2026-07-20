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

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Refund Policy"
      introduction="This policy explains how refund requests, digital-delivery issues and statutory withdrawal rights are handled for SolarDev AI digital products."
    >
      <LegalSection title="1. Digital-product delivery">
        <p>
          SolarDev AI products are digital content normally made available
          electronically after successful payment through a download link,
          confirmation page, email or another delivery method identified
          during checkout.
        </p>

        <p>
          Stripe processes the payment transaction. SolarDev AI is responsible
          for making the purchased digital product available to the customer
          after successful payment.
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
            className="font-semibold text-amber-400 underline decoration-amber-400/40 underline-offset-4 transition hover:text-amber-300"
          >
            {legalConfig.supportEmail}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Seller, payment and refund processing">
        <p>
          The seller of SolarDev AI digital products is{" "}
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
          SolarDev AI reviews and decides refund requests in accordance with
          this policy, the applicable Terms of Sale and mandatory consumer law.
        </p>

        <p>
          Where a refund is approved, SolarDev AI initiates the refund through
          Stripe. Stripe then submits the refund to the customer&apos;s bank,
          card issuer or payment provider.
        </p>
      </LegalSection>

      <LegalSection title="3. Statutory withdrawal rights for digital content">
        <p>
          Consumers may normally have a statutory withdrawal period for
          distance contracts. Different rules may apply where paid digital
          content is supplied immediately and is not provided on a tangible
          medium.
        </p>

        <p>
          Where permitted by applicable law, the right of withdrawal may be
          lost after supply begins where the consumer has:
        </p>

        <LegalList>
          <li>
            Expressly requested that supply of the digital content begin
            before the end of the applicable withdrawal period.
          </li>

          <li>
            Acknowledged that the right of withdrawal may be lost once supply
            begins.
          </li>

          <li>
            Received the legally required confirmation of that consent and
            acknowledgement.
          </li>
        </LegalList>

        <p>
          Any required consent and acknowledgement must be obtained before
          immediate access is supplied. This policy does not remove any
          mandatory consumer right available under applicable law.
        </p>
      </LegalSection>

      <LegalSection title="4. When a refund or remedy may be approved">
        <p>
          Subject to the available evidence and applicable mandatory law, a
          full refund, partial refund, replacement or another appropriate
          remedy may be considered in circumstances such as:
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
          normally offered once access or supply has begun, where this position
          is permitted by applicable law and the legally required consent and
          acknowledgement have been obtained.
        </p>

        <p>
          SolarDev AI may nevertheless consider a voluntary refund request on
          a case-by-case basis. Considering or approving one request does not
          create an obligation to approve similar requests in the future.
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
              className="font-semibold text-amber-400 underline decoration-amber-400/40 underline-offset-4 transition hover:text-amber-300"
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
          SolarDev AI may first provide troubleshooting assistance, a
          replacement link, a replacement file or another appropriate method
          of access.
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
          Approved refunds are initiated by SolarDev AI through Stripe and are
          normally returned to the original payment method where reasonably
          possible.
        </p>

        <p>
          After a refund has been initiated, Stripe submits the refund request
          to the customer&apos;s bank, card issuer or payment provider. Card
          refunds commonly become visible within approximately five to ten
          business days.
        </p>

        <p>
          The actual processing time depends on the payment method, bank, card
          issuer and banking system. SolarDev AI cannot control delays occurring
          after the refund has been submitted to the relevant financial
          institution.
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
            className="font-semibold text-amber-400 underline decoration-amber-400/40 underline-offset-4 transition hover:text-amber-300"
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
          SolarDev AI may provide transaction, delivery, access and
          correspondence records to Stripe or the relevant payment institution
          when responding to a payment dispute.
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
          <a
            href="/terms"
            className="font-semibold text-amber-400 underline decoration-amber-400/40 underline-offset-4 transition hover:text-amber-300"
          >
            Terms of Sale
          </a>
          .
        </p>

        <p>
          If this policy conflicts with a mandatory consumer right, the
          mandatory legal requirement will prevail.
        </p>
      </LegalSection>

      <LegalSection title="14. Contact">
        <p>
          Refund, payment, access and delivery requests:{" "}
          <a
            href={`mailto:${legalConfig.supportEmail}`}
            className="font-semibold text-amber-400 underline decoration-amber-400/40 underline-offset-4 transition hover:text-amber-300"
          >
            {legalConfig.supportEmail}
          </a>
          <br />
          General product enquiries:{" "}
          <a
            href={`mailto:${legalConfig.generalEmail}`}
            className="font-semibold text-amber-400 underline decoration-amber-400/40 underline-offset-4 transition hover:text-amber-300"
          >
            {legalConfig.generalEmail}
          </a>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}