// Maps each case study's company name to its public domain.
// Used with Google's Favicon API to fetch the brand mark:
//   https://www.google.com/s2/favicons?domain=<domain>&sz=128
// Free, no API key, redirects to gstatic CDN. Resolves to the
// site's actual favicon at up to 128px. Fall back to the company
// emoji on image load failure.
//
// (Originally we used logo.clearbit.com/<domain>, but HubSpot
//  deprecated the public Logo API in 2025.)

export const companyDomains: Record<string, string> = {
  Apple: "apple.com",
  Slack: "slack.com",
  Airbnb: "airbnb.com",
  Netflix: "netflix.com",
  Spotify: "spotify.com",
  Figma: "figma.com",
  Notion: "notion.so",
  Zoom: "zoom.us",
  Duolingo: "duolingo.com",
  Instagram: "instagram.com",
  Dropbox: "dropbox.com",
  Hotmail: "hotmail.com",
  Twitter: "twitter.com",
  LinkedIn: "linkedin.com",
  Pinterest: "pinterest.com",
  Uber: "uber.com",
  TikTok: "tiktok.com",
  HubSpot: "hubspot.com",
  Clubhouse: "clubhouse.com",
  PayPal: "paypal.com",
  Amazon: "amazon.com",
  Microsoft: "microsoft.com",
  Tesla: "tesla.com",
  Nintendo: "nintendo.com",
  Shopify: "shopify.com",
  Google: "google.com",
  Stripe: "stripe.com",
  Lego: "lego.com",
  OpenAI: "openai.com",
  Canva: "canva.com",
  Headspace: "headspace.com",
  Monzo: "monzo.com",
  Superhuman: "superhuman.com",
  Kodak: "kodak.com",
  Blackberry: "blackberry.com",
  WeWork: "wework.com",
  Quibi: "quibi.com",
  Facebook: "facebook.com",
  Theranos: "theranos.com",
  Myspace: "myspace.com",
  Yahoo: "yahoo.com",
  Intercom: "intercom.com",
  Snapchat: "snap.com",
  Robinhood: "robinhood.com",
  Whatsapp: "whatsapp.com",
  Atlassian: "atlassian.com",
  // India case studies
  Cred: "cred.club",
  Razorpay: "razorpay.com",
  Zerodha: "zerodha.com",
  "Byju's": "byjus.com",
  Paytm: "paytm.com",
  Swiggy: "swiggy.com",
  PhonePe: "phonepe.com",
  Nykaa: "nykaa.com",
};

export function getCompanyLogoUrl(company: string): string | null {
  const domain = companyDomains[company];
  return domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    : null;
}
