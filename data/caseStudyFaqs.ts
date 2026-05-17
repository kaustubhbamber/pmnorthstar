import { CaseStudy, getCaseStudyById } from "./caseStudies";

export interface FAQ {
  question: string;
  answer: string;
}

// Hand-crafted FAQs targeting specific long-tail search queries.
// Covers the highest-traffic case studies (India + globally famous).
// Each Q is a real Google search query; each A is 1-2 sentences pulled
// from the case study content.
const MANUAL_FAQS: Record<string, FAQ[]> = {
  // ── INDIA (highest SEO priority) ──────────────────────────────────────
  "cs-51": [
    { question: "What is Cred's business model?", answer: "Cred operates as a members-only credit card bill payment app for users with credit scores above 750. It earns through Cred Cash (lending), Cred Money (wealth management), partner commissions, and Cred Garage. The brand asset built through obsessive design and exclusivity now monetizes through these adjacent financial products." },
    { question: "Why does Cred reject 70% of users?", answer: "Cred's 750+ credit score gate is intentional. By turning away most applicants, Cred created scarcity and status. The rejection messages themselves became viral marketing as users screenshotted and shared them on Twitter — making exclusivity itself the product." },
    { question: "Who founded Cred?", answer: "Cred was founded by Kunal Shah in 2018. Shah previously founded FreeCharge, which he sold to Snapdeal for ~$400M in 2015. He spent his post-exit years thinking about what India's most affluent users needed but weren't getting." },
    { question: "What is Cred's valuation in 2026?", answer: "Cred held its $6.4B valuation flat through a 2024 fundraise rather than accepting a markdown. The company now has 13M+ members and is finally translating the brand asset into monetization through Cred Cash, Cred Money, and Cred Garage." },
  ],
  "cs-52": [
    { question: "What does Razorpay do?", answer: "Razorpay started in 2014 as a payment gateway — India's answer to Stripe — and expanded into a neo-banking infrastructure stack for Indian businesses. It now handles payments, banking (RazorpayX), lending (Razorpay Capital), payroll, checkout, and offline POS." },
    { question: "Why did Razorpay reverse flip to India?", answer: "Razorpay was originally incorporated in Delaware. In 2024-25, it reverse-flipped its parent entity from Delaware to Bengaluru, paying nearly $200M in tax (one of the largest such bills in Indian startup history) specifically to enable an Indian IPO." },
    { question: "When will Razorpay IPO?", answer: "Razorpay completed its reverse flip from Delaware to India in 2024-25 specifically to enable an Indian IPO. The listing is expected in 2025-26, with the company processing over $150B in annual payment volume and serving 10M+ businesses." },
    { question: "How does Razorpay make money?", answer: "Razorpay charges merchants a percentage fee on payment processing (the core gateway business), plus subscription and transaction fees for RazorpayX banking products, lending interest through Razorpay Capital, and platform fees across payroll, payouts, and checkout products." },
  ],
  "cs-53": [
    { question: "How does Zerodha make money?", answer: "Zerodha charges a flat ₹20 brokerage on each executed intraday/F&O trade, with zero brokerage on equity delivery. Despite 96% lower pricing than legacy brokers, this model produced ₹4,700 crore profit in FY24 because it eliminated marketing spend and operated with extreme cost discipline." },
    { question: "Why hasn't Zerodha raised VC money?", answer: "Founders Nithin and Nikhil Kamath bootstrapped Zerodha from day one. Their reasoning: VC funding would force growth-at-all-costs behavior that erodes customer trust. Bootstrapping let them build for long-term retention rather than short-term metrics." },
    { question: "What is Zerodha's profit?", answer: "Zerodha posted ₹8,320 crore revenue and ₹4,700 crore net profit in FY24 — a 56% profit margin that makes it one of the most profitable Indian companies of any vintage, not just startups. Implied valuation in secondary transactions exceeds $7-8 billion." },
    { question: "Will Zerodha IPO?", answer: "Zerodha has consistently said it has no IPO plans. Since the company is bootstrapped and highly profitable, it has no investor pressure for liquidity. The founders have publicly stated they prefer staying private to preserve their long-term decision-making culture." },
  ],
  "cs-54": [
    { question: "Why did BYJU'S fail?", answer: "BYJU'S aggressive M&A spree (12+ acquisitions for over $2.5B between 2020-2022) compounded with high-pressure sales tactics, unsustainable customer acquisition costs, and weak post-COVID demand. Each acquired company carried unique unit economics that never integrated, leading to operational paralysis and debt default." },
    { question: "How much money did BYJU'S lose?", answer: "BYJU'S peak valuation was $22 billion. By 2024-25, the company entered NCLT insolvency proceedings with effective valuation near zero — over $20 billion in equity destruction. Investor Prosus alone took a 90% writedown on its position." },
    { question: "Is BYJU'S still operating in 2026?", answer: "BYJU'S entered NCLT insolvency proceedings in 2024-25 and is being effectively dismantled. Aakash was separated, WhiteHat Jr was wound down, and Great Learning was sold. What remains is a shell of acquisitions being unwound and ongoing legal proceedings against the founder." },
    { question: "What was BYJU'S M&A strategy?", answer: "BYJU'S spent over $2.5B on acquisitions between 2020-2022, including WhiteHat Jr ($300M), Aakash ($950M), Great Learning ($600M), Toppr, Tynker, and Epic. The thesis was vertical integration across edtech; the reality was unmanageable conglomerate complexity that none of these businesses integrated into." },
  ],
  "cs-55": [
    { question: "Why did Paytm's IPO fail?", answer: "Paytm IPO'd in November 2021 at ~$20B valuation. The stock crashed 27% on day one and lost 75% within 18 months because the market couldn't value a sprawling super-app with unclear profitability path. Mounting losses and the 2024 RBI bank shutdown deepened the crisis." },
    { question: "Why did RBI shut down Paytm Payments Bank?", answer: "In January 2024, the Reserve Bank of India effectively shut down Paytm Payments Bank for persistent compliance failures around KYC, customer onboarding, and related-party transactions. The shutdown removed a core infrastructure pillar overnight and forced Paytm to migrate millions of merchants to partner banks." },
    { question: "Is Paytm profitable now?", answer: "Yes, by 2025-26 Paytm has stabilized into a more focused, profitable business — reporting positive EBITDA in multiple quarters. After the 2024 RBI disruption, the company refocused on merchant payments and lending, wound down failed super-app verticals (Paytm Mall, Paytm Games), and the stock has rallied substantially from its lows." },
    { question: "What was Paytm's super-app strategy?", answer: "Paytm tried to become India's WeChat — bundling payments, e-commerce (Paytm Mall), gaming (Paytm First Games), banking, brokerage, insurance, and lending into one app. The strategy failed because payments users didn't have the social-graph lock-in that made WeChat's bundle work in China." },
  ],
  "cs-56": [
    { question: "What is Swiggy's business model?", answer: "Swiggy runs two main businesses: food delivery (matching consumers with restaurants, with in-house delivery riders) and Instamart quick commerce (10-15 minute grocery delivery from owned dark stores). Revenue comes from restaurant commissions, delivery fees, and ad placements." },
    { question: "When did Swiggy IPO?", answer: "Swiggy completed its IPO in November 2024 at approximately $11 billion valuation. The listing was carefully timed post-Zomato's recovery and after broad tech IPO conditions stabilized, with food delivery profitability proven and Instamart in growth mode." },
    { question: "Is Swiggy profitable?", answer: "Swiggy's core food delivery business became profitable by 2024. The Instamart quick commerce business continues to lose money but is growing aggressively. The company overall reports profitability in some quarters and breakeven-or-negative in others depending on quick commerce growth investment." },
    { question: "What is Swiggy Instamart?", answer: "Swiggy Instamart is Swiggy's quick commerce business — 10-15 minute delivery of groceries, household essentials, and small items from owned dark stores. Launched around 2020, it processes over $1B in annual GMV and competes directly with Zepto and Blinkit in Indian quick commerce." },
  ],
  "cs-57": [
    { question: "What is PhonePe's UPI market share?", answer: "By 2024-26, PhonePe processes over 50% of all UPI transactions in India by volume — more than 6 billion transactions per month. This makes it the #1 UPI app in India, ahead of Google Pay (~35%) and Paytm (much smaller share)." },
    { question: "Who owns PhonePe?", answer: "PhonePe is owned by Walmart, which took 100% ownership in 2022 as part of its broader investment in Flipkart's group. PhonePe was originally founded in 2015, acquired by Flipkart in 2016, and split out as Walmart's separate entity after the 2018 Flipkart acquisition." },
    { question: "Why did PhonePe reverse flip to India?", answer: "PhonePe was incorporated in Singapore. In 2022, it reverse-flipped to India, paying nearly $1 billion in tax — the largest such tax bill in Indian startup history — specifically to enable an Indian IPO and align with Indian fintech regulations." },
    { question: "When will PhonePe IPO?", answer: "PhonePe is preparing for an Indian IPO expected in 2025-26. The 2022 reverse flip from Singapore to India was the foundational move to enable this listing. With 50%+ UPI market share and $12B valuation, the IPO will be one of the most-watched Indian fintech listings." },
  ],
  "cs-58": [
    { question: "Who is Falguni Nayar?", answer: "Falguni Nayar founded Nykaa in 2012 at age 50 after a 28-year banking career at Kotak. She took the company public in November 2021 at a $13B valuation, becoming one of the wealthiest self-made women globally with a net worth that crossed $7 billion at IPO peak." },
    { question: "What is Nykaa's business model?", answer: "Nykaa is India's largest beauty and personal care e-commerce platform, operating across online (Nykaa.com), physical retail (Nykaa Luxe and On Trend), private-label brands, and a fashion vertical. Revenue comes from commissions, private-label margins, and physical retail." },
    { question: "When did Nykaa IPO?", answer: "Nykaa completed its IPO in November 2021 at a valuation of approximately $13 billion. The stock corrected significantly through 2022-23 in the broader tech selloff but has since stabilized as the underlying business continues to grow profitably." },
    { question: "Is Nykaa profitable?", answer: "Yes, Nykaa was profitable from its early years — a rarity in Indian e-commerce. Founder Falguni Nayar built the company on disciplined unit economics rather than the burn-and-grow VC model. By 2025-26, Nykaa remains profitable with steady revenue growth across online and physical retail." },
  ],
  "cs-59": [
    { question: "Who founded Cult.fit?", answer: "Cult.fit was founded by Mukesh Bansal in 2016, with co-founder Ankit Nagori. Mukesh Bansal had previously founded Myntra, which he sold to Flipkart. He stepped back from operational leadership of Cult.fit in 2023 to enable refocus on the core fitness business." },
    { question: "What is Cult.fit's business model?", answer: "Cult.fit's core business is premium group fitness studios sold via monthly subscription (₹3,000+ per month for unlimited classes). Adjacent products include digital fitness via the app, healthy meal delivery (Eat.fit), and earlier attempts at meditation and telemedicine that were wound down." },
    { question: "Did Cult.fit fail?", answer: "Cult.fit didn't fail but did almost break under the super-app expansion. After scaling fitness studios, meal delivery, meditation, and telemedicine simultaneously, the company nearly collapsed during COVID. It refocused on fitness from 2023, took Tata investment in 2021, and is now slowly profitable with 500+ centers." },
    { question: "What is Cult.fit's valuation?", answer: "Cult.fit was valued at around $1.6B at its 2021 peak. By 2024-26, secondary valuations have cooled significantly — closer to $700M-1B — reflecting both the broader Indian startup valuation reset and the company's narrower business focus after winding down adjacent verticals." },
  ],
  "cs-60": [
    { question: "What is Meesho?", answer: "Meesho is India's largest social commerce platform, with 14M+ resellers (mostly women) selling products through WhatsApp groups, plus a direct-to-consumer marketplace. It bridges manufacturers in cities like Surat and Tirupur with consumers in Tier 3+ Indian towns." },
    { question: "How does Meesho social commerce work?", answer: "A reseller on Meesho browses products from manufacturers, shares them with her customers via WhatsApp at a markup, and earns the difference when the customer orders. Meesho handles inventory, payments, shipping, and returns — the reseller's role is trust and curation." },
    { question: "Is Meesho profitable?", answer: "Yes — Meesho became the first major Indian e-commerce platform to achieve sustained profitability, reaching positive unit economics in 2024. The zero-commission seller model (counterintuitive vs Flipkart/Amazon's 5-30% commissions) actually built the moat by attracting more sellers at lower prices." },
    { question: "When will Meesho IPO?", answer: "Meesho is preparing for an Indian IPO expected in 2025-26. With $4.9B+ valuation, 14M+ resellers, 175M+ users across 27,000 PIN codes, and now sustained profitability, it's positioned as one of the most-watched upcoming Indian e-commerce listings." },
  ],
  "cs-61": [
    { question: "What happened to Slice credit card?", answer: "In June 2022, RBI clarified that prepaid payment instruments could not be loaded with credit lines from non-bank entities — directly targeting Slice's model. Slice had to stop issuing new cards within weeks, refund customers, and rebuild as a UPI-first product. The brand survived through a forced pivot." },
    { question: "Is Slice a bank now?", answer: "Yes — Slice merged with North East Small Finance Bank in 2024, completing the regulatory approval process. As a small finance bank, Slice now has its own banking license and can issue credit products without third-party bank dependencies that exposed it to the 2022 RBI disruption." },
    { question: "Did Slice fail?", answer: "Slice didn't fail but did navigate two existential pivots. The original credit-card-for-Gen-Z model broke in 2022 due to RBI restrictions. Slice pivoted to UPI-first, then merged with NESFB to become a bank in 2024. Through both pivots, it retained 60%+ of its 10M+ user base." },
    { question: "Who founded Slice?", answer: "Slice was founded by Rajan Bajaj in 2016, when he was 23 years old. Bajaj built the company specifically for India's Gen Z — a demographic locked out of credit cards because traditional Indian banks viewed them as too risky and unprofitable to serve." },
  ],
  "cs-62": [
    { question: "Is Groww better than Zerodha?", answer: "Groww and Zerodha serve different audiences. Zerodha is optimized for serious traders with its powerful Kite platform; Groww is built for first-time investors with mobile-first design and mutual-fund-first sequencing. Groww has more total users (13M+); Zerodha leads by trading volume." },
    { question: "Who founded Groww?", answer: "Groww was founded in 2017 by Lalit Keshre, Harsh Jain, Ishan Bansal, and Neeraj Singh — all former Flipkart product managers. They built Groww specifically for first-time Indian investors that Zerodha's hardcore-trader product never optimized for." },
    { question: "Is Groww profitable?", answer: "Groww achieved profitability in 2023-24 after years of VC-driven growth. Profitability is thinner than Zerodha's (per-user revenue is lower because the user base skews toward smaller, less-active investors) but the business is healthy and IPO prep is underway for 2025-26 at ~$3B valuation." },
    { question: "Does Groww have stock trading?", answer: "Yes — Groww added stock trading in 2020, two years after launch. The sequencing was intentional: lead with mutual funds (lower-stakes for first-time investors), build trust, then add stocks. This contrasts with Zerodha's trading-first approach that targets active traders." },
  ],

  // ── GLOBAL (highest SEO priority) ─────────────────────────────────────
  "cs-1": [
    { question: "Why did Apple build the iPhone without a keyboard?", answer: "Steve Jobs and the iPhone team believed physical keyboards were a structural compromise that limited what a phone could become. Multi-touch technology would let one device flexibly become any input mode, while a physical keyboard locked the form factor permanently. The bet against industry consensus defined the modern smartphone." },
    { question: "When did the iPhone launch?", answer: "The iPhone was unveiled by Steve Jobs at Macworld 2007 in January and shipped in June 2007. It launched without copy-paste, MMS, and a physical keyboard — features competitors considered essential — and triggered a complete restructuring of the mobile industry." },
    { question: "What made the iPhone successful?", answer: "Three things: a capacitive multi-touch screen that responded to finger gestures (no stylus required), a stripped-down macOS that gave it desktop-class software, and an unprecedented carrier deal with AT&T that gave Apple complete control over software, design, and updates. Hardware-software integration was the moat." },
    { question: "How much revenue did the iPhone generate?", answer: "The iPhone generated over $1 trillion in cumulative revenue within its first decade. By 2017, iPhone alone was generating more revenue annually than all of Microsoft's products combined. The App Store ecosystem added hundreds of billions in additional value." },
  ],
  "cs-2": [
    { question: "Was Slack originally a game?", answer: "Yes — Slack started as the internal communication tool inside Tiny Speck, a gaming company building Glitch (a massively multiplayer online game). When Glitch failed to gain traction in 2012, founder Stewart Butterfield pivoted Tiny Speck to focus on the internal tool, which became Slack." },
    { question: "How did Slack grow without sales?", answer: "Slack pursued bottom-up adoption: individual teams started using Slack for free, fell in love with the product, and then pushed for company-wide adoption. By the time a CTO evaluated Slack, dozens of teams were already using it daily — making the decision feel like ratifying reality, not buying software." },
    { question: "Who acquired Slack?", answer: "Salesforce acquired Slack for $27.7 billion in 2021 — one of the largest enterprise software acquisitions in history. The deal brought Slack into Salesforce's customer-360 strategy and effectively ended Slack as an independent company." },
    { question: "How does Slack make money?", answer: "Slack monetizes through paid subscription tiers (Pro, Business+, Enterprise Grid). Free users get core messaging; paid tiers add unlimited message history, group video calls, advanced security, compliance features, and enterprise integrations. The freemium-to-paid conversion drove most of Slack's growth." },
  ],
  "cs-3": [
    { question: "Why did Airbnb sell cereal boxes?", answer: "In 2008, Airbnb was nearly bankrupt after being rejected by 7 investors. The founders created limited-edition Obama O's and Cap'n McCain cereal boxes during the 2008 US presidential election, earning $30,000 that kept the company alive long enough to join Y Combinator and pivot the product." },
    { question: "How did Airbnb start?", answer: "In 2008, founders Brian Chesky and Joe Gebbia couldn't pay rent in San Francisco. They put air mattresses in their living room and offered breakfast to conference attendees who couldn't find hotel rooms — literally 'air bed and breakfast'. The name and concept evolved from there." },
    { question: "How does Airbnb make money?", answer: "Airbnb charges hosts a service fee (~3% of the booking) and guests a service fee (~6-14% of the booking) for each reservation. The platform owns zero properties — it monetizes purely through facilitating trust between strangers who want to host and travel." },
    { question: "What is Airbnb worth?", answer: "Airbnb IPO'd in December 2020 at a valuation of $47 billion — more than Hilton and Marriott combined despite owning zero properties. As of 2025-26, the company has over 4 million hosts globally and facilitated over 1 billion guest arrivals cumulatively." },
  ],
  "cs-7": [
    { question: "What is Notion's pricing?", answer: "Notion has a generous free tier with personal use, a Plus plan for small teams (~$10/user/month), Business (~$15/user/month), and Enterprise pricing. The free tier was strategic — it let individual users adopt Notion and then drag their teams in." },
    { question: "Why is Notion popular?", answer: "Notion replaced fragmented tools (Confluence + Trello + Google Docs + Evernote + spreadsheets) with a single workspace built around blocks. The all-in-one bet meant teams could use one tool instead of five, and the flexibility let it adapt to any use case." },
    { question: "Did Notion struggle initially?", answer: "Yes — Notion's first version in 2015 nearly killed the company. It was slow, buggy, and didn't catch on. Founders Ivan Zhao and Simon Last rebuilt the entire app from scratch in 2018 — that V2 was when Notion finally took off." },
    { question: "Who founded Notion?", answer: "Notion was founded by Ivan Zhao and Simon Last in 2013. After the initial V1 nearly failed, they rebuilt the entire product from scratch in 2018. The company is famously small for its scale — fewer than 1000 employees serving tens of millions of users." },
  ],
  "cs-27": [
    { question: "How did Stripe become a developer favorite?", answer: "Stripe optimized obsessively for developer experience: clean documentation, 7-line code integrations, beautiful APIs. While competitors required weeks of contract negotiation and complex integration, Stripe let developers be live with payments in an afternoon. That developer love compounded into category dominance." },
    { question: "What does Stripe do?", answer: "Stripe is a payments infrastructure company that lets businesses accept and manage online payments. Its API processes payments, handles subscriptions, manages billing, supports global currencies, and integrates with thousands of platforms. Stripe powers payments for Amazon, Shopify, OpenAI, and hundreds of thousands of others." },
    { question: "Is Stripe public?", answer: "Stripe remains private as of 2025-26, despite years of IPO speculation. The company has raised at valuations up to $95 billion. Reports suggest IPO prep is ongoing but the founders have prioritized maintaining the long-term product focus that private status enables." },
    { question: "Who founded Stripe?", answer: "Stripe was founded in 2010 by Irish brothers Patrick and John Collison while they were college students. They built it after experiencing how painful it was to accept online payments in the early 2010s. They're now both billionaires and Stripe is one of the most valuable private companies." },
  ],
  "cs-29": [
    { question: "How did ChatGPT grow to 100 million users?", answer: "ChatGPT reached 100 million monthly users in roughly 60 days from its November 30, 2022 launch — the fastest consumer product growth in history. The free web interface, conversational format, and surprisingly capable responses made it instantly shareable, with users discovering it through social media." },
    { question: "When was ChatGPT launched?", answer: "ChatGPT launched on November 30, 2022, as a free 'research preview' of OpenAI's GPT-3.5 model. The intent was a low-key release to gather feedback; the response was an unprecedented consumer surge that defined the modern AI era." },
    { question: "How does OpenAI make money?", answer: "OpenAI monetizes through ChatGPT subscriptions (Plus, Pro, Team, Enterprise tiers), API access for developers, Microsoft Copilot revenue share, and an evolving enterprise business. By 2026, the company is approaching tens of billions in annual revenue, primarily from consumer and enterprise subscriptions." },
    { question: "Was ChatGPT the first chatbot?", answer: "No — chatbots existed for decades before ChatGPT. What ChatGPT did was combine genuine conversational capability (driven by the underlying GPT-3.5 then GPT-4 models) with a frictionless free interface that anyone could use. The combination of capability and accessibility was new." },
  ],
  "cs-43": [
    { question: "What did Theranos lie about?", answer: "Theranos claimed its Edison machine could run hundreds of medical tests from a single finger-prick of blood. In reality, the technology never worked. Theranos used commercial Siemens machines for most tests, diluted blood samples to make them work in other devices, and reported fabricated results to patients and partners." },
    { question: "How did Theranos fool investors?", answer: "Theranos raised $700M+ at a $9B valuation through founder charisma, celebrity board members (Kissinger, Mattis, Shultz), and the promise of revolutionizing healthcare. Founder Elizabeth Holmes carefully controlled information flow — investors never saw a working demo of the actual technology before investing." },
    { question: "What happened to Elizabeth Holmes?", answer: "Elizabeth Holmes was convicted in January 2022 on four counts of investor fraud. She was sentenced to over 11 years in federal prison and is currently serving her sentence. Her conviction marked the symbolic end of the 'fake it till you make it' Silicon Valley founder culture of the 2010s." },
    { question: "Was Theranos technology real?", answer: "No — the core Edison machine never worked as claimed. Internal Theranos engineers raised concerns repeatedly that were dismissed by leadership. The company knew the technology was non-functional but continued to claim otherwise to investors, patients, and partners — which is what made it a criminal fraud rather than just a failure." },
  ],
  "cs-63": [
    { question: "When did Atlassian acquire Loom?", answer: "Atlassian acquired Loom in 2023 for $975 million. The deal price was below Loom's 2021 peak valuation of $1.5B but came at a time when many SaaS companies were taking deeper haircuts. Loom continued operating as a product within Atlassian's portfolio." },
    { question: "How much did Loom sell for?", answer: "Loom sold to Atlassian for $975 million in 2023. The acquisition closed at a discount to Loom's 2021 peak valuation but was viewed as a strong strategic outcome — Atlassian got async video communication for its work-graph platform, and Loom got integration depth it couldn't have built alone." },
    { question: "What is Loom used for?", answer: "Loom is used for async screen recording — record yourself walking through a screen or explaining something, send it as a video message instead of scheduling a meeting. It became the default async video tool for distributed teams in software, design, customer support, and sales." },
    { question: "Why is Loom so popular?", answer: "Loom won by optimizing ruthlessly for time-to-value. Users go from install to first recording in under 30 seconds, with no friction. Every step that could have UX overhead was stripped away. Combined with browser-based playback (no app required for viewers), it removed friction at every layer." },
  ],
  "cs-64": [
    { question: "Why did Discord turn down Microsoft's offer?", answer: "Discord reportedly rejected a Microsoft acquisition offer of $10-12 billion in 2021. The founders bet that Discord's evolution from gaming-only to general community platform would create more value over time as creator economies, crypto communities, and AI groups adopted it. By 2025-26, that bet has been substantially vindicated." },
    { question: "Was Discord originally for gaming?", answer: "Yes — Discord was built in 2015 specifically for gamers, replacing terrible voice chat tools like Skype and TeamSpeak. The product expanded to general community use during COVID as study groups, learning circles, and creator communities adopted it. Less than half of active Discord users today are primarily gaming-focused." },
    { question: "How does Discord make money?", answer: "Discord monetizes through Nitro subscriptions (paid tier with cosmetic perks and HD streaming), Server Boost subscriptions, and emerging platform fees. The company is profitable on Nitro alone and is preparing for an IPO targeting 2026-27." },
    { question: "What is Discord's valuation?", answer: "Discord was last valued at $15 billion in a 2021 funding round. By 2025-26, with 200M+ monthly active users and growing creator/AI community usage, secondary valuations suggest higher — though the company has stayed private and is preparing for an IPO." },
  ],
  "cs-65": [
    { question: "Is Next.js owned by Vercel?", answer: "Yes — Next.js is the open-source React framework built and maintained by Vercel. The framework is free and open source; Vercel monetizes through its hosting platform optimized for Next.js apps. The framework-platform integration is Vercel's core competitive moat." },
    { question: "What does Vercel do?", answer: "Vercel is a frontend infrastructure platform — developers push code and Vercel handles deployment, hosting, edge functions, image optimization, and AI infrastructure. It's the default deployment platform for modern React/Next.js applications, powering sites for OpenAI, Stripe, Notion, and thousands of others." },
    { question: "How does Vercel make money?", answer: "Vercel monetizes through tiered hosting (Pro, Enterprise) with usage-based pricing on bandwidth, compute, and serverless functions. The open-source Next.js framework is free; the hosting platform is the revenue engine. Enterprise contracts with companies like McDonald's and Hulu drive significant revenue." },
    { question: "Why do developers love Vercel?", answer: "Vercel optimized ruthlessly for developer experience: 30-second deployments, automatic preview URLs per pull request, beautiful CLI, polished dashboard. Compared to AWS or Heroku, the time-to-first-deploy is an order of magnitude faster — and developers carry that preference into every company they join." },
  ],
};

// Auto-generated FAQs as fallback for case studies without manual entries.
// Pulls from description + outcome + first paragraph; works for any case study.
function generateGenericFaqs(study: CaseStudy): FAQ[] {
  const firstParagraph = study.content.split("\n\n")[0] || "";
  const firstSentence = firstParagraph.split(". ")[0] + ".";

  return [
    {
      question: `What is ${study.company} known for?`,
      answer: study.description,
    },
    {
      question: `What happened with ${study.company}?`,
      answer: study.outcome,
    },
    {
      question: `When was ${study.company} founded?`,
      answer: `${study.company}'s story in this case study centers on ${study.year}. ${firstSentence}`,
    },
    {
      question: `What can product managers learn from ${study.company}?`,
      answer: `The full case study covers the company context, key product decisions, execution challenges, results, and ripple effects — with specific lessons for PMs at the end. Read the full breakdown for the detailed analysis.`,
    },
  ];
}

export function getCaseStudyFaqs(id: string): FAQ[] {
  if (MANUAL_FAQS[id]) return MANUAL_FAQS[id];
  const study = getCaseStudyById(id);
  if (!study) return [];
  return generateGenericFaqs(study);
}
