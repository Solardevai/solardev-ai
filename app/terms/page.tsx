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
    "Terms governing the purchase, delivery and professional use of SolarDev AI digital products.",
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfSalePage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Terms of Sale"
      introduction="These terms govern the purchase, delivery, licensing and use of SolarDev AI digital products. Additional checkout-provider terms may apply to the payment transaction."
    >

      <LegalSection title="1. Operator information">
        <LegalList>
          <li>Trading name: {legalConfig.tradingName}</li>
          <li>Legal operator: {legalConfig.operatorName}</li>
          <li>Legal form: {legalConfig.legalForm}</li>
          <li>Tax identification: {legalConfig.taxId}</li>
          <li>Registered address: {legalConfig.businessAddress}</li>
          <li>Commercial registry: {legalConfig.commercialRegistryDetails}</li>
          <li>General email: {legalConfig.generalEmail}</li>
          <li>Customer-support email: {legalConfig.supportEmail}</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="2. Scope and acceptance">
        <p>
          These Terms of Sale apply to digital publications, prompt libraries,
          templates, training materials and related professional resources offered
          under the {legalConfig.tradingName} name, unless a separate written
          agreement applies.
        </p>
        <p>
          By placing an order, you confirm that you have reviewed the product
          description, price, delivery format, licence scope, refund information
          and these terms. Where you purchase on behalf of an organisation, you
          confirm that you have authority to bind that organisation.
        </p>
      </LegalSection>

      <LegalSection title="3. Product information">
        <p>
          Product pages describe the principal characteristics of each digital
          product, including format, edition, page count, intended audience and
          included materials. Illustrations, previews and extracts are provided to
          help customers understand the product and may not display every page or
          feature.
        </p>
        <p>
          Please review the product description carefully before purchase and
          contact {legalConfig.generalEmail} with any material pre-purchase question.
        </p>
      </LegalSection>

      <LegalSection title="4. Checkout, merchant of record and contract documents">
        <p>
          Checkout is provided by {legalConfig.merchantOfRecord}, which acts as
          merchant of record for purchases processed through its platform. It
          handles the payment transaction, applicable sales tax or VAT, payment
          confirmation, receipts, refunds and chargebacks under its own terms.
        </p>
        <p>
          These SolarDev AI terms govern the content licence, permitted use,
          support and relationship with the product publisher. The checkout
          provider&apos;s terms and privacy notice also apply to the transaction. If
          there is a conflict concerning payment processing, taxation or the
          checkout transaction, the mandatory terms applicable to the merchant of
          record may take precedence for that specific matter.
        </p>
      </LegalSection>

      <LegalSection title="5. Prices, taxes and payment">
        <p>
          The price shown at checkout is the amount payable for the selected
          product, subject to the checkout configuration. Applicable taxes may be
          included in or added to the displayed price depending on customer
          location and the checkout presentation.
        </p>
        <p>
          Payment must be completed using an accepted payment method. An order is
          not complete until the checkout provider confirms successful payment.
        </p>
      </LegalSection>

      <LegalSection title="6. Digital delivery">
        <p>
          Digital products are normally delivered electronically after successful
          payment through a download link, customer portal, email or another method
          identified at checkout.
        </p>
        <p>
          The customer is responsible for providing an accurate email address,
          maintaining access to the relevant inbox and downloading or securely
          retaining the purchased file. If delivery does not arrive within a
          reasonable period, contact {legalConfig.supportEmail} with the order
          reference and purchasing email address.
        </p>
      </LegalSection>

      <LegalSection title="7. Individual professional-use licence">
        <p>
          Unless the product page or a separate agreement states otherwise, a
          standard purchase grants one named customer a limited, non-exclusive,
          non-transferable and revocable licence to use the product for that
          customer&apos;s own professional learning and project work.
        </p>
        <p>The standard individual licence permits the customer to:</p>
        <LegalList>
          <li>Download and store a reasonable number of personal backup copies.</li>
          <li>
            Adapt the methods, prompts and concepts for the customer&apos;s own internal
            professional work.
          </li>
          <li>
            Use resulting analysis or deliverables in projects, provided the
            customer independently validates them and does not reproduce a
            substantial part of the publication.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="8. Prohibited uses">
        <p>Unless expressly authorised in writing, customers must not:</p>
        <LegalList>
          <li>Share, resell, sublicense, publish or redistribute the digital file.</li>
          <li>
            Upload the complete publication to a shared company repository,
            document-management system or AI knowledge base accessible by multiple
            users under an individual licence.
          </li>
          <li>
            Copy, extract or reproduce a substantial part of the publication to
            create a competing product, prompt library, course, database or service.
          </li>
          <li>Remove copyright, edition, licence or attribution notices.</li>
          <li>
            Use the product in an unlawful, misleading, unsafe or professionally
            irresponsible manner.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="9. Team and corporate use">
        <p>
          Use by multiple employees, consultants, affiliates or project-team
          members requires an appropriate team or corporate licence. Contact
          {" "}{legalConfig.generalEmail} before distributing the material within an
          organisation or integrating it into a shared internal system.
        </p>
        <p>
          Team licences, training, tailored implementation and enterprise use may
          be subject to a separate proposal or written agreement.
        </p>
      </LegalSection>

      <LegalSection title="10. AI and professional-responsibility disclaimer">
        <p>
          SolarDev AI materials are educational and methodological resources. They
          support structured analysis but do not constitute project-specific
          engineering, legal, financial, tax, environmental, permitting or
          investment advice.
        </p>
        <p>
          Artificial-intelligence outputs may be incomplete, inaccurate, outdated
          or unsuitable for the relevant jurisdiction or project. The user remains
          responsible for checking source material, assumptions, calculations,
          standards, regulations, contractual requirements and professional
          deliverables before relying on or issuing any output.
        </p>
        <p>
          Nothing in a SolarDev AI product replaces the judgement, review or
          approval of appropriately qualified professionals.
        </p>
      </LegalSection>

      <LegalSection title="11. Product updates and editions">
        <p>
          A purchase provides access to the edition described on the product page.
          Minor editorial corrections to that edition may be provided at the
          operator&apos;s discretion. Major revisions, new editions, additional volumes,
          software tools, templates or training products may be sold separately.
        </p>
      </LegalSection>

      <LegalSection title="12. Accuracy, availability and corrections">
        <p>
          Reasonable care is taken in preparing product descriptions and digital
          materials. However, professional knowledge, technical standards,
          regulations, technology and market information can change. SolarDev AI
          does not guarantee that every statement will remain current or be
          suitable for every project or jurisdiction.
        </p>
        <p>
          The operator may correct typographical errors, update product pages,
          withdraw an offer before purchase or replace a corrupted file. These
          rights do not reduce mandatory consumer remedies.
        </p>
      </LegalSection>

      <LegalSection title="13. Withdrawal and refunds">
        <p>
          Refunds and statutory withdrawal rights are described in the Refund
          Policy available at /refund-policy and in any mandatory information
          presented during checkout.
        </p>
        <p>
          Because digital content may be supplied immediately, a consumer may lose
          the statutory right of withdrawal once supply begins where the legally
          required prior express consent and acknowledgement have been obtained.
          Mandatory rights concerning defective, inaccessible or non-conforming
          digital content remain unaffected.
        </p>
      </LegalSection>

      <LegalSection title="14. Intellectual property">
        <p>
          All copyright, database rights, trademarks, design rights and other
          intellectual-property rights in SolarDev AI products and website content
          remain with the operator or relevant licensors. Purchasing a product
          grants only the limited licence expressly described in these terms.
        </p>
      </LegalSection>

      <LegalSection title="15. Customer responsibilities">
        <p>The customer is responsible for:</p>
        <LegalList>
          <li>Using accurate billing and contact information.</li>
          <li>Maintaining the confidentiality of download links and files.</li>
          <li>Ensuring that use complies with the applicable licence.</li>
          <li>
            Independently validating all technical, commercial, regulatory and
            professional outputs derived from the material.
          </li>
          <li>
            Ensuring compliance with applicable laws, standards, employer rules,
            confidentiality obligations and project contracts.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="16. Liability">
        <p>
          Nothing in these terms excludes or limits liability that cannot lawfully
          be excluded or limited, including mandatory consumer rights.
        </p>
        <p>
          To the maximum extent permitted by law, SolarDev AI is not responsible
          for losses arising from unverified AI output, project-specific reliance,
          inaccurate customer inputs, changes in law or standards, unauthorised
          sharing, third-party services or professional decisions made without
          suitable independent review.
        </p>
        <p>
          For customers acting in the course of business, and to the maximum extent
          permitted by law, aggregate liability connected with a product purchase
          will not exceed the amount paid for that product, except where a separate
          written agreement states otherwise.
        </p>
      </LegalSection>

      <LegalSection title="17. Suspension or termination of licence">
        <p>
          The product licence may be suspended or terminated where the customer
          materially breaches the licence restrictions, infringes intellectual
          property, distributes the product without permission or uses the content
          unlawfully. Obligations concerning intellectual property,
          confidentiality, liability and dispute resolution survive termination
          where appropriate.
        </p>
      </LegalSection>

      <LegalSection title="18. Governing law and disputes">
        <p>
          These terms are governed by the laws of {legalConfig.countryOfEstablishment},
          without depriving consumers of mandatory protections available under the
          law that applies to them.
        </p>
        <p>
          The parties should first attempt to resolve concerns through
          {" "}{legalConfig.supportEmail}. Any jurisdiction clause used for business
          customers must be completed after legal review and must not override
          mandatory consumer-jurisdiction rules.
        </p>
        <p>
          Business-customer jurisdiction: <strong>For business customers, disputes shall be subject to the competent
courts of Lisbon, Portugal, unless otherwise agreed in writing.</strong>
        </p>
      </LegalSection>

      <LegalSection title="19. Changes to these terms">
        <p>
          The terms applicable to a completed purchase are generally those
          presented when the order was placed, subject to mandatory law. Updated
          terms may apply to future purchases and will be published with a revised
          update date.
        </p>
      </LegalSection>

      <LegalSection title="20. Contact">
        <p>
          Product and licensing enquiries: {legalConfig.generalEmail}
          <br />
          Payment, access and delivery support: {legalConfig.supportEmail}
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
