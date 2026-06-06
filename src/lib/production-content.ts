import content from "@/data/dual-production-content.json";
import type { Property } from "@/types/dual";

type ContentObject = (typeof content.objects)[number];

export function getProductionContentManifest() {
  return content;
}

export function getProductionContentStatus() {
  return {
    app: content.app,
    version: content.version,
    updatedAt: content.updatedAt,
    contentReady: content.objects.length > 0,
    objectCount: content.objects.length,
    template: content.template,
    targetNetwork: content.network.target,
    orgId: content.network.orgId,
    liveDualMapping: {
      templateEnv: content.template.env,
      templateIdConfigured: Boolean(process.env.DUAL_PROPERTIES_TEMPLATE_ID || process.env.DUAL_TEMPLATE_ID),
      credentialsConfigured: Boolean(process.env.DUAL_API_KEY || process.env.DUAL_API_TOKEN),
      writeMode: process.env.DUAL_WRITE_MODE || "read_only",
      publicWrites: process.env.DEMO_PUBLIC_DUAL_WRITES === "true",
    },
  };
}

function toProperty(item: ContentObject): Property {
  const c = item.custom;
  return {
    id: item.contentId,
    templateId: process.env.DUAL_PROPERTIES_TEMPLATE_ID || process.env.DUAL_TEMPLATE_ID || content.template.slug,
    objectId: item.contentId,
    contentHash: undefined,
    propertyData: {
      name: c.name,
      address: c.address,
      city: c.city,
      country: c.country,
      propertyType: c.propertyType as Property["propertyData"]["propertyType"],
      yearBuilt: c.yearBuilt,
      totalSqft: c.totalSqft,
      units: c.units,
      totalValue: c.totalValue,
      tokenPrice: c.tokenPrice,
      totalTokens: c.totalTokens,
      tokensSold: c.tokensSold,
      annualYield: c.annualYield,
      minimumInvestment: c.minimumInvestment,
      description: c.description,
      features: c.features,
      financials: c.financials,
      imageUrl: c.imageUrl,
    },
    status: "active",
    ownerId: content.network.orgId,
    createdAt: content.updatedAt,
    updatedAt: content.updatedAt,
    blockchainTxHash: undefined,
    explorerLinks: undefined,
  };
}

export function getProductionProperties(): Property[] {
  return content.objects.map(toProperty);
}

export function getSeedPayloads() {
  return content.objects.map((item) => ({
    contentId: item.contentId,
    action: {
      mint: {
        template_id: process.env.DUAL_PROPERTIES_TEMPLATE_ID || process.env.DUAL_TEMPLATE_ID || "<DUAL_PROPERTIES_TEMPLATE_ID>",
        num: 1,
        data: {
          metadata: item.metadata,
          custom: item.custom,
        },
      },
    },
  }));
}
