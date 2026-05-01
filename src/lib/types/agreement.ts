export type AgreementType =
  | "website_proposal"
  | "digital_starter_agreement"
  | "digital_marketing_proposal";

export interface AgreementVariables {
  [key: string]: string;
}

export interface Agreement {
  id: number;
  slug: string;
  type: AgreementType;
  title: string;
  variables: AgreementVariables;
  documentHtml?: string | null;
  currencyCode: string;
  expiresAt?: string | null;
  passwordProtected: boolean;
  signedAt?: string | null;
  signerIp?: string | null;
  signerName?: string | null;
  signatureData?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgreementPayload {
  type: AgreementType;
  title: string;
  variables: AgreementVariables;
  documentHtml?: string;
  password?: string;
  currencyCode?: string;
  expiresAt?: string | null;
}

export interface UpdateAgreementPayload {
  title?: string;
  variables?: AgreementVariables;
  documentHtml?: string;
  password?: string;
  currencyCode?: string;
  expiresAt?: string | null;
}

export interface TemplateVariableConfig {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "email";
}

export interface TemplateConfig {
  id: AgreementType;
  name: string;
  description: string;
  variables: TemplateVariableConfig[];
}

export const AGREEMENT_TEMPLATES: Record<AgreementType, TemplateConfig> = {
  website_proposal: {
    id: "website_proposal",
    name: "Website Proposal",
    description: "Professional website development proposal",
    variables: [
      { key: "CLIENT_NAME", label: "Client Name" },
      { key: "CLIENT_CONTACT", label: "Client Contact" },
      { key: "DATE", label: "Date", placeholder: "e.g. 21 April 2025" },
      { key: "CLIENT_SHORT_NAME", label: "Client Short Name" },
      { key: "CLIENT_LOCATION", label: "Client Location" },
      { key: "CLIENT_INDUSTRY", label: "Client Industry" },
      { key: "YOU_PAY", label: "You Pay (NPR)" },
      { key: "TOTAL_VALUE", label: "Total Value (NPR)" },
      { key: "PAYMENT_INSTALLMENT", label: "Payment Installment (NPR)" },
      { key: "INCLUDED_VALUE", label: "Included Value (NPR)" },
    ],
  },
  digital_starter_agreement: {
    id: "digital_starter_agreement",
    name: "Digital Starter Agreement",
    description: "Agreement for digital starter services",
    variables: [
      { key: "CLIENT_NAME", label: "Client Name" },
      { key: "REF_NUMBER", label: "Reference Number", placeholder: "e.g. DSA-2025-001" },
      { key: "DATE", label: "Date", placeholder: "e.g. 21 April 2025" },
      { key: "SERVICE_PRICE", label: "Service Price (NPR)" },
      { key: "PRICE_IN_WORDS", label: "Price in Words", placeholder: "e.g. Fifty Thousand Nepali Rupees Only" },
    ],
  },
  digital_marketing_proposal: {
    id: "digital_marketing_proposal",
    name: "Digital Marketing Proposal",
    description: "Comprehensive digital marketing proposal",
    variables: [
      { key: "CLIENT_NAME", label: "Client Name" },
      { key: "DATE", label: "Date", placeholder: "e.g. 21 April 2025" },
      { key: "TARGET_LOCATION", label: "Target Location" },
      { key: "SOCIAL_MGMT_FEE", label: "Social Management Fee (NPR)" },
      { key: "ADS_MGMT_FEE", label: "Ads Management Fee (NPR)" },
      { key: "BONUS_1_VALUE", label: "Bonus 1 Value (strikethrough price) (NPR)" },
      { key: "BONUS_2_VALUE", label: "Bonus 2 Value (strikethrough price) (NPR)" },
      { key: "BONUS_3_VALUE", label: "Bonus 3 Value (strikethrough price) (NPR)" },
      { key: "MONTH_1_TOTAL", label: "Month 1 Total (first payment) (NPR)" },
      { key: "MONTHLY_RETAINER", label: "Monthly Retainer (NPR)" },
      { key: "ONBOARDING_FEE", label: "Onboarding Fee (NPR)" },
      { key: "SOCIAL_SETUP_FEE", label: "Social Setup Fee (NPR)" },
      { key: "MIN_AD_SPEND", label: "Minimum Ad Spend (NPR)" },
    ],
  },
};
