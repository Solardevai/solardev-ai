import type { Metadata } from "next";
import {
  LegalCallout,
  LegalList,
  LegalOrderedList,
  LegalPageLayout,
  LegalSection,
} from "../../components/legal-page-layout";
import { legalConfig } from "../../lib/legal-config";

export const metadata: Metadata = {
  title: "Refund Policy | SolarDev AI",
  description:
    "Refund, withdrawal and digital-delivery policy for SolarDev AI products.",
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
      <LegalCallout>
        Confirm the intended commercial refund approach and the exact consent
        wording used at checkout before publishing. Mandatory consumer rights
        always take priority over this template.
      </LegalCallout>

      <LegalSection title="1. Digital-product delivery">
        <p>
          SolarDev AI products are digital content normally supplied immediately
          after successful payment through a download link, customer portal or
          email delivered by {legalConfig.merchantOfRecord} or another stated
          delivery method.
        </p>
        <p>
          Customers should check spam or junk folders and confirm that the email
          address used at checkout is correct. Delivery problems should be reported
          promptly to {legalConfig.supportEmail}.
        </p>
      </LegalSection>

      <LegalSection title="2. Merchant of record">
        <p>
          Payments are processed by {legalConfig.merchantOfRecord}, acting as
          merchant of record. It handles the payment transaction, applicable taxes,
          refunds and chargebacks. SolarDev AI may review the circumstances and
          request or approve a refund, while the merchant of record processes the
          transaction under its procedures and applicable terms.
        </p>
      </LegalSection>

      <LegalSection title="3. Statutory right of withdrawal for digital content">
        <p>
          Consumers may normally have a withdrawal period for distance contracts.
          However, for digital content not supplied on a tangible medium, the right
          of withdrawal may be lost once supply begins where the consumer has given
          prior express consent to immediate supply and acknowledged the loss of the
          withdrawal right, provided all applicable legal requirements are met.
        </p>
        <p>
          The checkout flow should clearly request any legally required consent and
          acknowledgement before immediate access is provided. This policy does not
          remove any mandatory right that remains available under applicable law.
        </p>
      </LegalSection>

      <LegalSection title="4. When a refund may be approved">
        <p>
          Subject to the evidence available and mandatory law, a full or partial
          refund may be considered in circumstances such as:
        </p>
        <LegalList>
          <li>A duplicate purchase or duplicate charge.</li>
          <li>
            A confirmed technical failure that prevents access or download and
            cannot be resolved within a reasonable time.
          </li>
          <li>A materially corrupted or unusable file that cannot be replaced.</li>
          <li>
            The supplied product is materially different from the product
            description presented at purchase.
          </li>
          <li>An unauthorised transaction supported by appropriate evidence.</li>
          <li>Another situation in which a refund or remedy is required by law.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. Change-of-mind requests after access">
        <p>
          Because the complete digital product can be accessed and retained after
          delivery, voluntary change-of-mind refunds are not normally offered once
          the download, access or supply of the digital content has begun, where
          this position is permitted by law and the required checkout consent has
          been obtained.
        </p>
        <p>
          This does not affect mandatory remedies for defective, inaccessible or
          non-conforming digital content.
        </p>
      </LegalSection>

      <LegalSection title="6. Refund-request period">
        <p>
          Customers are asked to submit refund or delivery-related requests within
          {" "}{legalConfig.refundRequestWindowDays} days of purchase so the matter
          can be investigated promptly. This administrative request period does not
          shorten any longer mandatory limitation period or statutory right.
        </p>
      </LegalSection>

      <LegalSection title="7. How to request a refund or remedy">
        <LegalOrderedList>
          <li>Email {legalConfig.supportEmail} from the purchasing email address.</li>
          <li>Use the subject line: “Refund request — [order number]”.</li>
          <li>
            Include the order number, product name, purchase date and a concise
            explanation of the issue.
          </li>
          <li>
            For technical problems, include relevant screenshots or error details
            without sending passwords or full payment-card information.
          </li>
          <li>
            Allow a reasonable period for review and troubleshooting before a
            decision is made.
          </li>
        </LegalOrderedList>
      </LegalSection>

      <LegalSection title="8. Troubleshooting and replacement">
        <p>
          Where a delivery or file issue can reasonably be corrected, SolarDev AI
          may first provide a replacement link, replacement file or practical
          troubleshooting assistance. Accepting a replacement does not remove any
          remedy that cannot lawfully be excluded.
        </p>
      </LegalSection>

      <LegalSection title="9. Refund processing time">
        <p>
          Approved refunds are submitted to {legalConfig.merchantOfRecord} for
          processing to the original payment method where possible. The time taken
          for funds to appear depends on the merchant of record, payment method,
          card issuer and banking system and may take several business days.
        </p>
      </LegalSection>

      <LegalSection title="10. Chargebacks">
        <p>
          Customers should contact {legalConfig.supportEmail} before initiating a
          chargeback so that delivery, access, duplication or product-conformity
          concerns can be investigated. This request does not prevent customers
          from exercising rights available through their payment provider or by law.
        </p>
      </LegalSection>

      <LegalSection title="11. Corporate and separately negotiated purchases">
        <p>
          Team licences, corporate access, training and tailored services may have
          refund, cancellation and milestone terms set out in a separate quotation,
          order form or agreement. Where such written terms exist, they apply to
          that purchase subject to mandatory law.
        </p>
      </LegalSection>

      <LegalSection title="12. Mandatory rights preserved">
        <p>
          Nothing in this policy excludes or restricts rights or remedies that
          cannot legally be excluded, including rights relating to digital content
          that is not supplied, is defective, lacks conformity or does not match its
          description.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact">
        <p>
          Refund, payment, access and delivery requests: {legalConfig.supportEmail}
          <br />
          General product enquiries: {legalConfig.generalEmail}
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
