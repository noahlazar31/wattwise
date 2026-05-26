/**
 * Affiliate link configuration.
 *
 * HOW TO USE:
 * 1. Sign up for the affiliate programs listed below
 * 2. Replace each URL with your personal affiliate URL
 * 3. Earn $50–$150 per customer who switches providers
 *
 * Sign up at:
 * - Green Mountain Energy: greenmountainenergy.com/affiliate
 * - Constellation: constellation.com/partner
 * - Choose Energy: chooseenergy.com/affiliates
 * - SaveOnEnergy: saveonenergy.com/partner
 * - Arcadia: arcadia.com/api (also has affiliate program)
 */

interface AffiliateProvider {
  url: string;
  label?: string; // optional CTA override
}

export const AFFILIATE_LINKS: Record<string, AffiliateProvider> = {
  "Green Mountain Energy": {
    url: "https://www.greenmountainenergy.com/?utm_source=wattwise&utm_medium=affiliate",
    label: "Switch Now →",
  },
  "Constellation Energy": {
    url: "https://www.constellation.com/?utm_source=wattwise&utm_medium=affiliate",
  },
  "Constellation": {
    url: "https://www.constellation.com/?utm_source=wattwise&utm_medium=affiliate",
  },
  "Arcadia": {
    url: "https://www.arcadia.com/?utm_source=wattwise&utm_medium=affiliate",
  },
  "NRG Energy": {
    url: "https://www.nrg.com/?utm_source=wattwise&utm_medium=affiliate",
  },
  "Spark Energy": {
    url: "https://www.sparkenergy.com/?utm_source=wattwise&utm_medium=affiliate",
  },
  "Reliant Energy": {
    url: "https://www.reliant.com/?utm_source=wattwise&utm_medium=affiliate",
  },
  "TXU Energy": {
    url: "https://www.txu.com/?utm_source=wattwise&utm_medium=affiliate",
  },
  "Direct Energy": {
    url: "https://www.directenergy.com/?utm_source=wattwise&utm_medium=affiliate",
  },
  "Rhythm Energy": {
    url: "https://www.gotrhythm.com/?utm_source=wattwise&utm_medium=affiliate",
  },
};

/**
 * Returns the affiliate URL for a given provider name.
 * Tries exact match, then partial match.
 * Falls back to a Google search if no affiliate link exists.
 */
export function getAffiliateLink(providerName: string): string {
  // Exact match
  if (AFFILIATE_LINKS[providerName]) {
    return AFFILIATE_LINKS[providerName].url;
  }

  // Partial match (case-insensitive)
  const key = Object.keys(AFFILIATE_LINKS).find(
    (k) =>
      providerName.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(providerName.toLowerCase())
  );

  if (key) return AFFILIATE_LINKS[key].url;

  // Fallback: Google the provider (still useful, just not tracked)
  return `https://www.google.com/search?q=${encodeURIComponent(providerName + " energy plan sign up")}`;
}
