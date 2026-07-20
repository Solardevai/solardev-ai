import type { Metadata } from "next";
import {
  LegalList,
  LegalPageLayout,
  LegalSection,
} from "../../components/legal-page-layout";
import { legalConfig } from "../../lib/legal-config";

export const metadata: Metadata = {
  title: "Terms of Sale",
  description:
    "Terms governing the purchase, delivery, licensing and professional use of SolarDev AI digital products.",
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const legalLinkClass =
  "font-semibold text-amber-400 underline decoration-amber-400/40 underline-offset-4 transition hover:text-amber-300";

export default function TermsOfSalePage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Terms of Sale"
      introduction="These terms govern the purchase, delivery, licensing and use of SolarDev AI digital products. Stripe's separate terms may apply to payment processing."
    >
      <LegalSection title="1. Operator information">
        <LegalList>
          <li>Trading name: {legalConfig.tradingName}</li>
          <li>Legal operator: {legalConfig.operatorName}</li>
          <li>Legal form: {legalConfig.legalForm}</li>
          <li>Tax identification: {legalConfig.taxId}</li>
          <li>Registered address: {legalConfig.businessAddress}</li>
          <li>
            Commercial registry: {legalConfig.commercialRegistryDetails}
          </li>
          <li>
            General email:{" "}
            <a
              href={`mailto:${legalConfig.generalEmail}`}
              className={legalLinkClass}
            >
              {legalConfig.generalEmail}
            </a>
          </li>
          <li>
            Customer-support email:{" "}
            <a
              href={`mailto:${legalConfig.supportEmail}`}
              className={legalLinkClass}
            >
              {legalConfig.supportEmail}
            </a>
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="2. Scope and acceptance">
        <p>
          These Terms of Sale apply to digital publications, prompt libraries,
          templates, training materials and related professional resources
          offered under the {legalConfig.tradingName} name, unless a separate
          written agreement applies.
        </p>

        <p>
          By placing an order, you confirm that you have reviewed the product
          description, price, delivery format, licence scope, refund
          information and these Terms of Sale.
        </p>

        <p>
          Acceptance of these Terms of Sale does not, by itself, replace any
          separate express request, consent or acknowledgement required by law
          for the immediate supply of paid digital content before the end of an
          applicable withdrawal period.
        </p>

        <p>
          Where required, the customer will be asked before completing the
          purchase to expressly request immediate supply and acknowledge the
          consequences for the statutory right of withdrawal.
        </p>

        <p>
          Where you purchase on behalf of an organisation, you confirm that
          you have authority to bind that organisation.
        </p>
      </LegalSection>

      <LegalSection title="3. Product information">
        <p>
          Product pages describe the principal characteristics of each digital
          product, including its format, edition, page count, intended audience
          and included materials.
        </p>

        <p>
          Illustrations, previews and extracts are provided to help customers
          understand the product and may not display every page, prompt,
          template, checklist or feature included in the complete product.
        </p>

        <p>
          Please review the product description carefully before purchasing
          and contact{" "}
          <a
            href={`mailto:${legalConfig.generalEmail}`}
            className={legalLinkClass}
          >
            {legalConfig.generalEmail}
          </a>{" "}
          with any material pre-purchase question.
        </p>
      </LegalSection>

      <LegalSection title="4. Checkout, payment processing and contract formation">
        <p>
          Checkout and payment processing are provided through Stripe. Stripe
          supplies the hosted payment page, processes the selected payment
          method and provides payment confirmation and transaction receipts.
        </p>

        <p>
          The contract for the purchase and licensing of a SolarDev AI digital
          product is between the customer and {legalConfig.operatorName},
          trading as {legalConfig.tradingName}.
        </p>

        <p>
          {legalConfig.tradingName} is the seller and merchant of record for
          the digital product. Stripe provides checkout and payment-processing
          services and does not become the seller merely by processing the
          transaction.
        </p>

        <p>
          These Terms of Sale govern the product, digital delivery, licence,
          permitted use, support and relationship between{" "}
          {legalConfig.tradingName} and the customer. Stripe&apos;s applicable
          terms and privacy documentation govern Stripe&apos;s
          payment-processing services.
        </p>

        <p>
          An order is completed only after Stripe confirms successful payment.{" "}
          {legalConfig.tradingName} may reject or cancel an order where payment
          is not completed, fraud is reasonably suspected or the transaction
          cannot lawfully be fulfilled.
        </p>
      </LegalSection>

      <LegalSection title="5. Prices, taxes and payment">
        <p>
          The product price displayed on the {legalConfig.tradingName} website
          and at checkout is the amount payable for the selected product,
          subject to any applicable taxes displayed before payment is
          confirmed.
        </p>

        <p>
          Where tax-calculation functionality is enabled, Stripe may assist{" "}
          {legalConfig.tradingName} in calculating and collecting applicable
          taxes. {legalConfig.tradingName} remains responsible for applicable
          tax-registration, reporting and payment obligations.
        </p>

        <p>
          Payment must be completed using a payment method accepted by Stripe.
          The customer should verify the total price, currency, billing
          information and any applicable taxes before confirming payment.
        </p>
      </LegalSection>

      <LegalSection title="6. Digital delivery">
        <p>
          Digital products are normally made available electronically after
          successful payment through a download link, confirmation page, email
          or another delivery method identified during checkout.
        </p>

        <p>
          Where consumer law requires prior express consent for delivery to
          begin before the end of an applicable withdrawal period, immediate
          access will be provided only after the required request, consent and
          acknowledgement have been obtained.
        </p>

        <p>
          The customer is responsible for providing an accurate email address,
          maintaining access to the relevant inbox and downloading or securely
          retaining the purchased file.
        </p>

        <p>
          If delivery does not arrive within a reasonable period, contact{" "}
          <a
            href={`mailto:${legalConfig.supportEmail}`}
            className={legalLinkClass}
          >
            {legalConfig.supportEmail}
          </a>{" "}
          and provide the order reference and the email address used for the
          purchase.
        </p>
      </LegalSection>

      <LegalSection title="7. Individual professional-use licence">
        <p>
          Unless the product page or a separate agreement states otherwise, a
          standard purchase grants one named customer a limited,
          non-exclusive, non-transferable and revocable licence to use the
          product for that customer&apos;s own professional learning and
          project work.
        </p>

        <p>The standard individual licence permits the customer to:</p>

        <LegalList>
          <li>
            Download and store a reasonable number of personal backup copies.
          </li>

          <li>
            Adapt the methods, prompts and concepts for the customer&apos;s own
            internal professional work.
          </li>

          <li>
            Use resulting analysis or deliverables in projects, provided that
            the customer independently validates them and does not reproduce a
            substantial part of the publication.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="8. Prohibited uses">
        <p>Unless expressly authorised in writing, customers must not:</p>

        <LegalList>
          <li>
            Share, resell, sublicense, publish or redistribute the digital
            file.
          </li>

          <li>
            Upload the complete publication to a shared company repository,
            document-management system or AI knowledge base accessible by
            multiple users under an individual licence.
          </li>

          <li>
            Copy, extract or reproduce a substantial part of the publication
            to create a competing product, prompt library, course, database or
            service.
          </li>

          <li>
            Remove copyright, edition, licence or attribution notices.
          </li>

          <li>
            Use the product in an unlawful, misleading, unsafe or
            professionally irresponsible manner.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="9. Team and corporate use">
        <p>
          Use by multiple employees, consultants, affiliates or project-team
          members requires an appropriate team or corporate licence.
        </p>

        <p>
          Contact{" "}
          <a
            href={`mailto:${legalConfig.generalEmail}`}
            className={legalLinkClass}
          >
            {legalConfig.generalEmail}
          </a>{" "}
          before distributing the material within an organisation or
          integrating it into a shared internal system.
        </p>

        <p>
          Team licences, training, tailored implementation and enterprise use
          may be subject to a separate proposal or written agreement.
        </p>
      </LegalSection>

      <LegalSection title="10. AI and professional-responsibility disclaimer">
        <p>
          SolarDev AI materials are educational and methodological resources.
          They support structured analysis but do not constitute
          project-specific engineering, legal, financial, tax, environmental,
          permitting or investment advice.
        </p>

        <p>
          Artificial-intelligence outputs may be incomplete, inaccurate,
          outdated or unsuitable for the relevant jurisdiction or project. The
          user remains responsible for checking source material, assumptions,
          calculations, standards, regulations, contractual requirements and
          professional deliverables before relying on or issuing any output.
        </p>

        <p>
          Nothing in a SolarDev AI product replaces the judgement, review or
          approval of appropriately qualified professionals.
        </p>
      </LegalSection>

      <LegalSection title="11. Product updates and editions">
        <p>
          A purchase provides access to the edition described on the product
          page. Minor editorial updates to that edition may be provided at the
          operator&apos;s discretion.
        </p>

        <p>
          Major revisions, new editions, additional volumes, software tools,
          templates or training products may be offered separately.
        </p>
      </LegalSection>

      <LegalSection title="12. Accuracy, availability and corrections">
        <p>
          Reasonable care is taken when preparing product descriptions and
          digital materials. However, professional knowledge, technical
          standards, regulations, technology and market information can
          change.
        </p>

        <p>
          SolarDev AI does not guarantee that every statement will remain
          current or be suitable for every project, country or jurisdiction.
        </p>

        <p>
          The operator may correct typographical errors, update product pages,
          withdraw an offer before purchase or replace a corrupted file. These
          rights do not reduce mandatory consumer remedies.
        </p>
      </LegalSection>

      <LegalSection title="13. Withdrawal, immediate digital delivery and refunds">
        <p>
          Refunds, delivery problems and statutory withdrawal rights are
          described in the{" "}
          <a href="/refund-policy" className={legalLinkClass}>
            Refund Policy
          </a>{" "}
          and in any mandatory information presented before purchase.
        </p>

        <p>
          Consumers may have a statutory withdrawal period for contracts
          concluded at a distance. Different rules may apply to paid digital
          content that is not supplied on a tangible medium and is made
          available immediately.
        </p>

        <p>
          Where immediate delivery is requested before the end of the
          applicable withdrawal period, the customer may be required to:
        </p>

        <LegalList>
          <li>
            Expressly request that supply of the digital content begin
            immediately and before the end of the applicable withdrawal
            period.
          </li>

          <li>
            Acknowledge that the statutory right of withdrawal may be lost once
            supply of the digital content begins.
          </li>

          <li>
            Confirm acceptance of these Terms of Sale and the applicable Refund
            Policy.
          </li>
        </LegalList>

        <p>
          Where required by law, SolarDev AI will provide confirmation of the
          customer&apos;s express request, consent and acknowledgement in the
          order confirmation, payment confirmation, delivery email or another
          durable electronic format.
        </p>

        <p>
          Where the legally required request, consent, acknowledgement or
          confirmation has not been properly obtained, the customer retains any
          withdrawal rights and remedies provided by applicable mandatory law.
        </p>

        <p>
          Loss of the withdrawal right does not remove mandatory remedies where
          the digital product is not supplied, is inaccessible, is defective,
          is corrupted or does not materially conform to its description.
        </p>
      </LegalSection>

      <LegalSection title="14. Intellectual property">
        <p>
          All copyright, database rights, trademarks, design rights and other
          intellectual-property rights in SolarDev AI products and website
          content remain with the operator or relevant licensors.
        </p>

        <p>
          Purchasing a product grants only the limited licence expressly
          described in these terms.
        </p>
      </LegalSection>

      <LegalSection title="15. Customer responsibilities">
        <p>The customer is responsible for:</p>

        <LegalList>
          <li>Using accurate billing and contact information.</li>

          <li>
            Maintaining the confidentiality of download links and purchased
            files.
          </li>

          <li>
            Ensuring that use of the product complies with the applicable
            licence.
          </li>

          <li>
            Independently validating all technical, commercial, regulatory and
            professional outputs derived from the material.
          </li>

          <li>
            Ensuring compliance with applicable laws, standards, employer
            rules, confidentiality obligations and project contracts.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="16. Liability">
        <p>
          Nothing in these terms excludes or limits liability that cannot
          lawfully be excluded or limited, including mandatory consumer rights.
        </p>

        <p>
          To the maximum extent permitted by law, SolarDev AI is not
          responsible for losses arising from unverified AI output,
          project-specific reliance, inaccurate customer inputs, changes in law
          or standards, unauthorised sharing, third-party services or
          professional decisions made without suitable independent review.
        </p>

        <p>
          For customers acting in the course of business, and to the maximum
          extent permitted by law, aggregate liability connected with a
          product purchase will not exceed the amount paid for that product,
          except where a separate written agreement states otherwise.
        </p>
      </LegalSection>

      <LegalSection title="17. Suspension or termination of licence">
        <p>
          The product licence may be suspended or terminated where the
          customer materially breaches the licence restrictions, infringes
          intellectual property, distributes the product without permission or
          uses the content unlawfully.
        </p>

        <p>
          Obligations concerning intellectual property, confidentiality,
          liability and dispute resolution survive termination where
          appropriate.
        </p>
      </LegalSection>

      <LegalSection title="18. Governing law and disputes">
        <p>
          These terms are governed by the laws of{" "}
          {legalConfig.countryOfEstablishment}, without depriving consumers of
          mandatory protections available under the law applicable to them.
        </p>

        <p>
          The parties should first attempt to resolve concerns by contacting{" "}
          <a
            href={`mailto:${legalConfig.supportEmail}`}
            className={legalLinkClass}
          >
            {legalConfig.supportEmail}
          </a>
          .
        </p>

        <p>
          For customers acting in the course of business, disputes shall be
          subject to the competent courts of Lisbon, Portugal, unless otherwise
          agreed in writing.
        </p>
      </LegalSection>

      <LegalSection title="19. Changes to these terms">
        <p>
          The terms applicable to a completed purchase are generally those
          presented when the order was placed, subject to mandatory law.
        </p>

        <p>
          Updated terms may apply to future purchases and will be published
          with a revised update date.
        </p>
      </LegalSection>

      <LegalSection title="20. Contact">
        <p>
          Product and licensing enquiries:{" "}
          <a
            href={`mailto:${legalConfig.generalEmail}`}
            className={legalLinkClass}
          >
            {legalConfig.generalEmail}
          </a>
          <br />
          Payment, access and delivery support:{" "}
          <a
            href={`mailto:${legalConfig.supportEmail}`}
            className={legalLinkClass}
          >
            {legalConfig.supportEmail}
          </a>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}