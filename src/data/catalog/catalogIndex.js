import products from "./products.json";
import pricing from "./pricing.json";
import factories from "./factories.json";
import deliveryRules from "./deliveryRules.json";

export const CATALOG_PRODUCTS = products;
export const CATALOG_PRICING = pricing;
export const CATALOG_FACTORIES = factories;
export const CATALOG_DELIVERY_RULES = deliveryRules;

export function getCatalogMeta() {
  return {
    productsCount: products.length,
    pricingRulesCount: pricing.rules.length,
    manufacturersCount: factories.manufacturers.length,
    deliveryRulesCount: deliveryRules.rules.length,
  };
}
