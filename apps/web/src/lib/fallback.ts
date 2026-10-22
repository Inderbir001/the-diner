/**
 * Content used only when Supabase isn't configured (local preview, CI builds) or unreachable,
 * so the site always renders. Production content lives in Supabase and is edited from /admin.
 */
import type { DinerEvent, Faq, GalleryImage, MenuCategory, MenuItem, Page, Post, SettingsMap } from "@diner/shared";
import { parseSettings } from "@diner/shared";

const u = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80`;

export const fallbackSettings: SettingsMap = {
  general: parseSettings("general", {
    name: "The Diner Restobar",
    legalName: "Niru Hospitality Services India Pvt Ltd",
    tagline: "Good place. Good food.",
    description:
      "A rooftop restobar in Whitefield, Bengaluru. Andhra and North Indian kitchen, handcrafted cocktails, draught beer, live music, DJ nights and big-screen sports, a short walk from ITPL.",
    phones: ["+91 99000 99602", "+91 99000 99605"],
    whatsapp: "+919900099602",
    email: "wfdiner@gmail.com",
    address: {
      street: "107/4, Pattandur Agrahara Main Rd",
      locality: "Pattandur Agrahara, Whitefield",
      city: "Bengaluru",
      region: "Karnataka",
      postalCode: "560066",
      country: "IN",
    },
    landmark: "Near ITPL Gate 3",
    geo: { lat: 12.9858, lng: 77.7296 },
    mapUrl: "https://maps.app.goo.gl/kS6tnzhxyRSKTRfE7",
    mapEmbedUrl:
      "https://www.google.com/maps?q=The+Diner+Restobar,+Pattandur+Agrahara,+Whitefield,+Bengaluru&output=embed",
    priceRange: "₹₹",
    costForTwo: "₹1,000",
    cuisines: ["Andhra", "North Indian", "Chinese", "Continental", "Bar Food"],
    hours: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => ({
      day,
      open: "11:30",
      close: "00:30",
      closed: false,
    })),
    hoursNote: "Kitchen closes at 12:00 AM.",
    features: ["Rooftop seating", "Dance floor", "Private dining", "Pet friendly", "Live music & DJs", "Big-screen sports", "Parking", "Free Wi-Fi"],
  }),
  social: parseSettings("social", {
    instagram: "https://www.instagram.com/thedinerrestobar/",
    instagramHandle: "thedinerrestobar",
    swiggy: "https://www.swiggy.com/restaurants/the-diner-restobar-whitefield-bangalore-864697/dineout",
    googleReviews: "https://maps.app.goo.gl/kS6tnzhxyRSKTRfE7",
  }),
  seo: parseSettings("seo", {
    defaultTitle: "The Diner Restobar — Rooftop Bar & Restaurant in Whitefield, Bengaluru",
    titleTemplate: "%s | The Diner Restobar, Whitefield",
    description:
      "Rooftop restobar in Whitefield near ITPL. Andhra & North Indian food, biryani, cocktails, draught beer, live music, DJ nights and live sports. Book a table online.",
    keywords: ["restobar in Whitefield", "rooftop bar Whitefield", "pub near ITPL", "bar in Whitefield Bangalore", "best biryani Whitefield", "team party venue Whitefield"],
    ogImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=630&fit=crop&q=80",
  }),
  home: parseSettings("home", {
    heroEyebrow: "Rooftop restobar · Whitefield",
    heroTitle: "Long nights, loud tables, good food.",
    heroSubtitle:
      "Andhra heat, tandoor smoke and cold draught under the Whitefield sky. Ten minutes from ITPL, open till half past midnight.",
    heroImage: u("1514933651103-005eec06c04b", 2000),
    storyTitle: "A neighbourhood bar that cooks like home.",
    storyBody:
      "The Diner started with a simple idea: a place in Whitefield where you can walk in after work, order a proper Andhra meal and a cold beer, and stay for the music. Our kitchen leans on Guntur spice, slow-cooked biryanis and a tandoor that runs all night. Upstairs, the rooftop fills up for match nights, DJ sets and long weekend dinners.",
    storyImage: u("1543007630-9710e4a00a20", 1400),
    stats: [
      { value: "4.4★", label: "on Google" },
      { value: "12:30", label: "AM last call" },
      { value: "250+", label: "guests on the rooftop" },
      { value: "7", label: "days a week" },
    ],
    marquee: ["Guntur Chicken", "Hyderabadi Dum Biryani", "Rooftop Nights", "Craft Cocktails", "Live Bands", "Draught Beer", "IPL on the Big Screen", "Lamb Chops"],
    experiences: [
      { title: "The Rooftop", description: "Open-air tables, string lights and the best seat in Whitefield for a long evening.", image: u("1559339352-11d035aa65de", 1200) },
      { title: "Live Music & DJs", description: "Live bands mid-week and DJs on the weekend. The dance floor is open late.", image: u("1492684223066-81342ee5ff30", 1200) },
      { title: "Match Nights", description: "Every big game on the big screen, with buckets, platters and a crowd that cares.", image: u("1572116469696-31de0f17cc34", 1200) },
      { title: "Private Parties", description: "Team lunches, birthdays and offsites for 20 to 250 guests, with set menus and a bar package.", image: u("1528605248644-14dd04022da1", 1200) },
    ],
    partyPackages: [
      { name: "Food package", price: "₹800 / guest", description: "Welcome drink, starters, mains, biryani and dessert." },
      { name: "Food + bar package", price: "₹1,000 / guest", description: "Everything in the food package plus beer, house spirits and cocktails." },
    ],
  }),
  booking: parseSettings("booking", {
    areas: ["Indoor", "Rooftop", "Private dining"],
    occasions: ["Casual", "Birthday", "Anniversary", "Date night", "Team outing", "Match night"],
    policyNote: "Tables are held for 15 minutes past the booking time. For groups larger than 20, please send a party enquiry.",
  }),
  notifications: parseSettings("notifications", {}),
  announcement: parseSettings("announcement", {
    enabled: true,
    text: "Match nights are on — every big game live on the rooftop screen.",
    linkLabel: "See events",
    linkUrl: "/events",
  }),
};

type Seed = [cat: string, name: string, desc: string | null, price: number, veg: boolean, spicy: boolean, signature: boolean, image?: string];
const categories: [slug: string, name: string, desc: string | null, kind: "food" | "drinks"][] = [
  ["starters-veg", "Starters — Veg", "From the tandoor and the wok.", "food"],
  ["starters-non-veg", "Starters — Non-Veg", "Andhra spice, charcoal and smoke.", "food"],
  ["mains", "Mains", "Curries and gravies, best with something from the tandoor.", "food"],
  ["biryani-rice", "Biryani & Rice", "Dum-cooked, sealed and served with salan and raita.", "food"],
  ["breads", "Breads", "Fresh from the tandoor.", "food"],
  ["pizza-continental", "Pizza & Continental", "For the table that wants something else.", "food"],
  ["desserts", "Desserts", null, "food"],
  ["cocktails", "Cocktails", "Shaken and stirred at the bar.", "drinks"],
  ["beer", "Beer", "Draught, craft and bottled.", "drinks"],
  ["mocktails", "Mocktails & Coolers", null, "drinks"],
];
const items: Seed[] = [
  ["starters-veg", "Paneer Tikka", "Cottage cheese marinated in hung curd and spices, charred in the tandoor.", 329, true, false, false],
  ["starters-veg", "Peanut Masala", "Roasted peanuts tossed with onion, tomato, green chilli and lime. The bar classic.", 199, true, true, true],
  ["starters-veg", "Chilli Baby Corn", "Crisp baby corn, soy, garlic and spring onion.", 279, true, true, false],
  ["starters-veg", "Mushroom Pepper Fry", "Button mushrooms with crushed black pepper and curry leaf.", 289, true, true, false],
  ["starters-non-veg", "Guntur Chicken", "Our signature — boneless chicken in fiery Guntur red chilli and curry leaf.", 369, false, true, true, u("1610057099443-fde8c4d50f91", 900)],
  ["starters-non-veg", "Tandoori Chicken Tikka", "Boneless chicken, yogurt, kashmiri chilli, charcoal-grilled.", 359, false, false, false, u("1599487488170-d11ec9c172f0", 900)],
  ["starters-non-veg", "Lamb Chops", "Tender lamb chops marinated overnight and finished over coal.", 549, false, false, true],
  ["starters-non-veg", "Chicken 65", "The Hyderabad classic, curry leaf and green chilli.", 339, false, true, false],
  ["starters-non-veg", "Apollo Fish", "Boneless fish fried crisp and tossed in a tangy chilli sauce.", 399, false, true, false],
  ["mains", "Paneer Tikka Masala", "Charred paneer in a rich onion-tomato masala.", 339, true, false, false],
  ["mains", "Dal Makhani", "Black lentils slow-cooked overnight with butter and cream.", 279, true, false, false],
  ["mains", "Butter Chicken", "Tandoori chicken in a silky tomato, butter and fenugreek gravy.", 389, false, false, false, u("1603894584373-5ac82b2ae398", 900)],
  ["mains", "Andhra Chicken Curry", "Home-style curry with roasted spices and a proper kick.", 369, false, true, false],
  ["mains", "Mutton Rogan Josh", "Slow-braised mutton, kashmiri chilli, whole spices.", 449, false, false, false],
  ["biryani-rice", "Hyderabadi Chicken Dum Biryani", "Long-grain basmati and marinated chicken, dum-cooked and sealed. The queen of the menu.", 349, false, false, true, u("1563379091339-03b21ab4a4f8", 900)],
  ["biryani-rice", "Mutton Biryani", "Tender mutton, saffron and fried onions.", 429, false, false, true],
  ["biryani-rice", "Veg Dum Biryani", "Seasonal vegetables, mint and saffron.", 279, true, false, false],
  ["biryani-rice", "Jeera Rice", null, 199, true, false, false],
  ["biryani-rice", "Plain Curd", null, 50, true, false, false],
  ["breads", "Roti", null, 49, true, false, false],
  ["breads", "Naan", null, 49, true, false, false],
  ["breads", "Butter Naan", null, 69, true, false, false],
  ["breads", "Garlic Butter Naan", null, 99, true, false, false],
  ["pizza-continental", "Margherita Pizza", "Tomato, mozzarella, basil.", 349, true, false, false, u("1565299624946-b28f40a0ae38", 900)],
  ["pizza-continental", "Chicken Tikka Pizza", "Tandoori chicken, onion, capsicum, mozzarella.", 429, false, false, false],
  ["pizza-continental", "Loaded Fries", "Fries, cheese sauce, jalapeño, spring onion.", 249, true, false, false],
  ["desserts", "Gulab Jamun", "Warm, two pieces.", 149, true, false, false],
  ["desserts", "Sizzling Brownie", "Walnut brownie, vanilla ice cream, hot chocolate sauce.", 279, true, false, false],
  ["cocktails", "Long Island Iced Tea", "Vodka, rum, gin, tequila, triple sec, cola.", 549, true, false, true, u("1514362545857-3bc16c4c7d1b", 900)],
  ["cocktails", "Mojito", "White rum, mint, lime, soda.", 399, true, false, false],
  ["cocktails", "Piña Colada", "Rum, coconut cream, pineapple.", 429, true, false, false],
  ["cocktails", "Frozen Liquid Love", "House frozen cocktail — ask the bar.", 449, true, false, false],
  ["beer", "Draught Beer (pint)", "Ask for today's tap.", 299, true, false, false],
  ["beer", "Craft Beer (pint)", "Rotating local craft taps.", 349, true, false, false],
  ["beer", "Beer Bucket", "Five bottled beers on ice.", 1199, true, false, false],
  ["mocktails", "Virgin Mojito", null, 199, true, false, false],
  ["mocktails", "Mango Lassi", null, 149, true, false, false],
  ["mocktails", "Masala Buttermilk", null, 99, true, false, false],
];

export const fallbackCategories: MenuCategory[] = categories.map(([slug, name, description, kind], i) => ({
  id: `cat-${slug}`,
  slug,
  name,
  description,
  kind,
  sort_order: i + 1,
  is_active: true,
}));

export const fallbackItems: MenuItem[] = items.map(([cat, name, description, price, is_veg, is_spicy, is_signature, image_url], i) => ({
  id: `item-${i}`,
  category_id: `cat-${cat}`,
  name,
  description,
  price,
  price_note: null,
  image_url: image_url ?? null,
  is_veg,
  is_spicy,
  is_signature,
  is_available: true,
  tags: [],
  sort_order: i,
}));

const inDays = (d: number, h = 20) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  t.setHours(h, 0, 0, 0);
  return t.toISOString();
};

export const fallbackEvents: DinerEvent[] = [
  {
    id: "ev-1", title: "Match Nights on the Rooftop", slug: "match-nights", summary: "Every big game live on the big screen.",
    body: "Cricket, football, F1 — if it matters, it is on the rooftop screen.\n\nBucket deals on beer and platters all game long. Tables fill up fast on big match days, so book ahead.",
    image_url: u("1572116469696-31de0f17cc34", 1400), starts_at: inDays(1, 19), ends_at: null, is_recurring: true,
    recurrence_label: "Every match day", price_label: "Free entry", cta_label: null, cta_url: null, is_featured: true, is_published: true,
  },
  {
    id: "ev-2", title: "Live Band Thursdays", slug: "live-band-thursdays", summary: "Local bands, rock and Bollywood covers, from 8 PM.",
    body: "Mid-week, but it doesn't feel like it. Bengaluru's local bands take over the floor every Thursday from 8 PM.",
    image_url: u("1501612780327-45045538702b", 1400), starts_at: inDays(3), ends_at: null, is_recurring: true,
    recurrence_label: "Every Thursday, 8 PM", price_label: "Free entry", cta_label: null, cta_url: null, is_featured: false, is_published: true,
  },
  {
    id: "ev-3", title: "Saturday Night DJ", slug: "saturday-night-dj", summary: "Bollywood, commercial and house till late.",
    body: "Our resident DJs play Bollywood, commercial and house until last call. The dance floor is open — dress to move.",
    image_url: u("1516997121675-4c2d1684aa3e", 1400), starts_at: inDays(5, 21), ends_at: null, is_recurring: true,
    recurrence_label: "Every Saturday, 9 PM", price_label: "Couples & groups", cta_label: null, cta_url: null, is_featured: true, is_published: true,
  },
];

export const fallbackFaqs: Faq[] = [
  ["Where is The Diner Restobar?", "We are at 107/4, Pattandur Agrahara Main Road, Whitefield, Bengaluru 560066 — near ITPL Gate 3."],
  ["What are your opening hours?", "We are open every day from 11:30 AM to 12:30 AM. The kitchen takes its last order at 12:00 AM."],
  ["Do I need to book a table?", "Walk-ins are welcome, but we recommend booking for weekends, match nights and groups. You can reserve online in under a minute."],
  ["Do you host team parties and private events?", "Yes. We host team lunches, birthdays and corporate parties for 20 to 250 guests, with food-only and food + bar packages. Send us a party enquiry and we will call you back."],
  ["Is there parking?", "Yes, parking is available at the venue and on the street nearby."],
  ["Are pets allowed?", "Yes, we are a pet-friendly restobar. Please keep your pet on a leash."],
].map(([question, answer], i) => ({ id: `faq-${i}`, question, answer, sort_order: i, is_published: true }));

export const fallbackGallery: GalleryImage[] = [
  ["1517248135467-4c7edcad34c4", "Warm lights over dining tables", "ambience"],
  ["1514933651103-005eec06c04b", "Bar counter with backlit bottles", "bar"],
  ["1563379091339-03b21ab4a4f8", "Chicken dum biryani", "food"],
  ["1470337458703-46ad1756a187", "Cocktails on the bar", "bar"],
  ["1555396273-367ea4eb4db5", "Dining room at night", "ambience"],
  ["1599487488170-d11ec9c172f0", "Tandoori platter", "food"],
  ["1544148103-0773bf10d330", "Restaurant interior", "ambience"],
  ["1551024709-8f23befc6f87", "Cocktail close-up", "bar"],
].map(([id, alt, category], i) => ({
  id: `g-${i}`, url: u(id), alt, caption: null, category, sort_order: i, is_published: true,
}));

export const fallbackPages: Page[] = [
  ["policy", "House Policy", "## Reservations\n\nTables are held for 15 minutes past the booking time.\n\n## Age policy\n\nAlcohol is served only to guests aged 21 and above. Please carry a valid photo ID.\n\n## Pets\n\nWe are pet friendly. Pets must stay on a leash.\n\n## Right of admission\n\nThe management reserves the right of admission."],
  ["privacy", "Privacy Policy", "We collect only the details you give us when you book a table or send an enquiry, and use them to manage your reservation. We do not sell your data.\n\nTo have your data deleted, email wfdiner@gmail.com."],
  ["terms", "Terms of Service", "By using this website or booking a table you agree to our house policy. Menu items and prices may change without notice. Online reservations are subject to availability and confirmation."],
].map(([slug, title, content]) => ({
  id: `page-${slug}`, slug, title, content, seo_description: null, is_published: true, updated_at: new Date().toISOString(),
}));

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

export const fallbackPosts: Post[] = [
  {
    id: "p-1", slug: "andhra-food-and-beer-pairing", title: "Why Andhra Food Pairs So Well With Beer",
    excerpt: "Guntur chilli, curry leaf and a cold pint. A short, slightly biased guide to eating spicy at a bar.",
    content:
      "Andhra cooking is built on heat: Guntur red chilli, black pepper, green chilli and a lot of curry leaf. That's exactly why it works at a bar.\n\n## Heat loves cold and carbonation\n\nA crisp lager resets your palate between bites, which means you can keep going. Wheat beers soften the burn; a hoppy craft IPA will turn it up.\n\n## Our pairings\n\n| Dish | Pour |\n| --- | --- |\n| Guntur Chicken | Draught lager |\n| Apollo Fish | Wheat beer |\n| Lamb Chops | Craft IPA |\n| Chicken Dum Biryani | Anything cold |\n\n## Not a beer person?\n\nA Mojito or a Masala Buttermilk does the same job: cold, sharp, refreshing.\n\nCome hungry. Book a table, or just walk in.",
    cover_image: u("1585937421612-70a008356fbe"), cover_alt: "Spicy Indian curry in a bowl", tags: ["food", "drinks"],
    author: "The Diner Team", status: "published", published_at: daysAgo(1),
    seo_title: "Andhra Food and Beer Pairing — The Diner Restobar, Whitefield",
    seo_description: "Guntur chicken, biryani and Andhra spice paired with draught and craft beer. A pairing guide from The Diner Restobar in Whitefield, Bengaluru.",
    created_at: daysAgo(1), updated_at: daysAgo(1),
  },
  {
    id: "p-2", slug: "team-party-venue-whitefield-checklist", title: "Planning a Team Party in Whitefield? A Practical Checklist",
    excerpt: "Headcount, budget, menu, music and the one thing everyone forgets. A no-nonsense guide for whoever got stuck organising the team outing.",
    content:
      "Somebody has to organise the team party, and this year it's you. Here's the checklist we walk every organiser through.\n\n## 1. Lock the headcount early\n\nAsk for RSVPs two weeks out and add 10% for last-minute plus-ones.\n\n## 2. Decide food-only or food + bar\n\nOur packages start at **₹800 per guest** for food and **₹1,000 per guest** with the bar.\n\n## 3. Pick a space that fits the mood\n\n- **Private dining** for 20–40 guests who want to talk\n- **Rooftop** for 40–250 guests and a party feel\n\n## 4. Sort the music\n\nA DJ for an hour after dinner changes the whole evening.\n\n## 5. Plan the getting-home\n\nWe're near ITPL with easy cab access — share the location pin in the invite.",
    cover_image: u("1528605248644-14dd04022da1"), cover_alt: "Group of friends raising glasses at a party", tags: ["parties", "corporate", "whitefield"],
    author: "The Diner Team", status: "published", published_at: daysAgo(3),
    seo_title: "Team Party Venue in Whitefield — Planning Checklist",
    seo_description: "Organising a team party or office outing in Whitefield? Packages from ₹800 per guest, rooftop and private dining for 20–250 guests near ITPL.",
    created_at: daysAgo(3), updated_at: daysAgo(3),
  },
  {
    id: "p-3", slug: "where-to-watch-cricket-in-whitefield", title: "Where to Watch Cricket in Whitefield: Our Match Night Guide",
    excerpt: "Big screen, cold beer and a crowd that actually watches the game. Here's how match nights work at The Diner.",
    content:
      "If you work around ITPL, you know the problem: the match starts at 7:30, you get out at 7, and every bar nearby is either too loud or too empty.\n\n## What a match night looks like\n\nThe rooftop screen goes on 30 minutes before the toss. Expect buckets of beer, sharing platters and a crowd that groans at every dropped catch.\n\n## What to order\n\n- **Guntur Chicken** — dry, fiery, made for beer\n- **Peanut Masala** — the original bar snack\n- **Beer Bucket** — five on ice, shared",
    cover_image: u("1572116469696-31de0f17cc34"), cover_alt: "Crowd watching a match on a big screen at a bar", tags: ["events", "whitefield", "sports"],
    author: "The Diner Team", status: "published", published_at: daysAgo(6),
    seo_title: "Where to Watch Cricket in Whitefield — Match Nights at The Diner",
    seo_description: "Looking for a bar to watch IPL and cricket near ITPL, Whitefield? Big-screen match nights, beer buckets and rooftop seating at The Diner Restobar.",
    created_at: daysAgo(6), updated_at: daysAgo(6),
  },
];
