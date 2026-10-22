-- Starter content for The Diner Restobar.
-- Everything here is editable from /admin. Menu prices marked "verify" in the README must be
-- checked against the printed menu before launch.

-- ---------------------------------------------------------------------------
-- settings
-- ---------------------------------------------------------------------------
insert into public.settings (key, value) values
('general', $${
  "name": "The Diner Restobar",
  "legalName": "Niru Hospitality Services India Pvt Ltd",
  "tagline": "Good place. Good food.",
  "description": "A rooftop restobar in Whitefield, Bengaluru. Andhra and North Indian kitchen, handcrafted cocktails, draught beer, live music, DJ nights and big-screen sports, a short walk from ITPL.",
  "phones": ["+91 99000 99602", "+91 99000 99605"],
  "whatsapp": "+919900099602",
  "email": "wfdiner@gmail.com",
  "address": {
    "street": "107/4, Pattandur Agrahara Main Rd",
    "locality": "Pattandur Agrahara, Whitefield",
    "city": "Bengaluru",
    "region": "Karnataka",
    "postalCode": "560066",
    "country": "IN"
  },
  "landmark": "Near ITPL Gate 3",
  "geo": { "lat": 12.9842923, "lng": 77.7334466 },
  "mapUrl": "https://maps.app.goo.gl/kS6tnzhxyRSKTRfE7",
  "mapEmbedUrl": "https://www.google.com/maps?q=The+Diner+Restobar,+Pattandur+Agrahara,+Whitefield,+Bengaluru&output=embed",
  "priceRange": "₹₹",
  "costForTwo": "₹1,000",
  "cuisines": ["Andhra", "North Indian", "Chinese", "Continental", "Bar Food"],
  "hours": [
    { "day": "Monday", "open": "11:30", "close": "00:30", "closed": false },
    { "day": "Tuesday", "open": "11:30", "close": "00:30", "closed": false },
    { "day": "Wednesday", "open": "11:30", "close": "00:30", "closed": false },
    { "day": "Thursday", "open": "11:30", "close": "00:30", "closed": false },
    { "day": "Friday", "open": "11:30", "close": "00:30", "closed": false },
    { "day": "Saturday", "open": "11:30", "close": "00:30", "closed": false },
    { "day": "Sunday", "open": "11:30", "close": "00:30", "closed": false }
  ],
  "hoursNote": "Kitchen closes at 12:00 AM.",
  "features": ["Rooftop seating", "Dance floor", "Private dining", "Pet friendly", "Live music & DJs", "Big-screen sports", "Parking", "Free Wi-Fi"]
}$$::jsonb),
('social', $${
  "instagram": "https://www.instagram.com/thedinerrestobar/",
  "instagramHandle": "thedinerrestobar",
  "youtube": "",
  "youtubeChannelId": "",
  "facebook": "",
  "zomato": "",
  "swiggy": "https://www.swiggy.com/restaurants/the-diner-restobar-whitefield-bangalore-864697/dineout",
  "googleReviews": "https://maps.app.goo.gl/kS6tnzhxyRSKTRfE7",
  "tripadvisor": "https://www.tripadvisor.in/Restaurant_Review-g297628-d26725228-Reviews-The_Diner_Restobar-Bengaluru_Bangalore_District_Karnataka.html"
}$$::jsonb),
('seo', $${
  "defaultTitle": "The Diner Restobar — Rooftop Bar & Restaurant in Whitefield, Bengaluru",
  "titleTemplate": "%s | The Diner Restobar, Whitefield",
  "description": "Rooftop restobar in Whitefield near ITPL. Andhra & North Indian food, biryani, cocktails, draught beer, live music, DJ nights and live sports. Book a table online.",
  "keywords": ["restobar in Whitefield", "rooftop bar Whitefield", "pub near ITPL", "bar in Whitefield Bangalore", "best biryani Whitefield", "team party venue Whitefield", "live music Whitefield", "IPL screening Whitefield", "Andhra restaurant Whitefield"],
  "ogImage": "/images/diner/og-image.jpg",
  "googleSiteVerification": "",
  "gaMeasurementId": ""
}$$::jsonb),
('home', $${
  "heroEyebrow": "Rooftop restobar · Whitefield",
  "heroTitle": "Long nights, loud tables, good food.",
  "heroSubtitle": "Andhra heat, tandoor smoke and cold draught under the Whitefield sky. Ten minutes from ITPL, open till half past midnight.",
  "heroImage": "/images/diner/rooftop-night.jpg",
  "heroVideo": "",
  "storyTitle": "A neighbourhood bar that cooks like home.",
  "storyBody": "The Diner started with a simple idea: a place in Whitefield where you can walk in after work, order a proper Andhra meal and a cold beer, and stay for the music. Our kitchen leans on Guntur spice, slow-cooked biryanis and a tandoor that runs all night. Upstairs, the rooftop fills up for match nights, DJ sets and long weekend dinners.",
  "storyImage": "/images/diner/rooftop-pet-friendly.jpg",
  "stats": [
    { "value": "4.4★", "label": "on Google" },
    { "value": "12:30", "label": "AM last call" },
    { "value": "250+", "label": "guests on the rooftop" },
    { "value": "7", "label": "days a week" }
  ],
  "marquee": ["Guntur Chicken", "Hyderabadi Dum Biryani", "Rooftop Nights", "Craft Cocktails", "Live Bands", "Draught Beer", "IPL on the Big Screen", "Lamb Chops"],
  "experiences": [
    { "title": "The Rooftop", "description": "Open-air tables under hanging planters and string lights — the best seat in Whitefield for a long evening. Pets welcome.", "image": "/images/diner/rooftop-day.jpg" },
    { "title": "Live Music & DJs", "description": "Acoustic Colours live on the rooftop every Thursday, DJ nights on the weekend and a dance floor that stays busy.", "image": "/images/diner/event-acoustic-colours.jpg" },
    { "title": "Match Nights", "description": "Every big game live on the big screen, with buckets, platters and a crowd that cares.", "image": "/images/diner/event-match-screening.jpg" },
    { "title": "Private Parties", "description": "Team lunches, birthdays and office outings for 20 to 250 guests, with set menus, bar packages and group discounts.", "image": "/images/diner/team-party.jpg" }
  ],
  "partyPackages": [
    { "name": "Food package", "price": "₹800 / guest", "description": "Welcome drink, starters, mains, biryani and dessert." },
    { "name": "Food + bar package", "price": "₹1,000 / guest", "description": "Everything in the food package plus beer, house spirits and cocktails." },
    { "name": "Group discount", "price": "Up to 10% off", "description": "10+ guests get 5% off and 20+ guests get 10% off the food bill on lunch bookings, with prior reservation." }
  ]
}$$::jsonb),
('booking', $${
  "enabled": true,
  "slotMinutes": 30,
  "firstSeating": "12:00",
  "lastSeating": "23:30",
  "capacityPerSlot": 60,
  "maxPartySize": 20,
  "minNoticeMinutes": 60,
  "maxDaysAhead": 60,
  "areas": ["Indoor", "Rooftop", "Private dining"],
  "occasions": ["Casual", "Birthday", "Anniversary", "Date night", "Team outing", "Match night"],
  "blackoutDates": [],
  "autoConfirm": false,
  "policyNote": "Tables are held for 15 minutes past the booking time. For groups larger than 20, please send a party enquiry."
}$$::jsonb),
('notifications', $${
  "bookingEmails": ["wfdiner@gmail.com"],
  "enquiryEmails": ["wfdiner@gmail.com"],
  "sendGuestConfirmation": true
}$$::jsonb),
('announcement', $${
  "enabled": true,
  "text": "Match nights are on — every big game live on the rooftop screen.",
  "linkLabel": "See events",
  "linkUrl": "/events"
}$$::jsonb)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- menu (sample — verify prices against the printed menu)
-- ---------------------------------------------------------------------------
insert into public.menu_categories (name, slug, description, kind, sort_order) values
('Starters — Veg', 'starters-veg', 'From the tandoor and the wok.', 'food', 1),
('Starters — Non-Veg', 'starters-non-veg', 'Andhra spice, charcoal and smoke.', 'food', 2),
('Mains', 'mains', 'Curries and gravies, best with something from the tandoor.', 'food', 3),
('Biryani & Rice', 'biryani-rice', 'Dum-cooked, sealed and served with salan and raita.', 'food', 4),
('Breads', 'breads', 'Fresh from the tandoor.', 'food', 5),
('Pizza & Continental', 'pizza-continental', 'For the table that wants something else.', 'food', 6),
('Desserts', 'desserts', null, 'food', 7),
('Cocktails', 'cocktails', 'Shaken and stirred at the bar.', 'drinks', 8),
('Beer', 'beer', 'Draught, craft and bottled.', 'drinks', 9),
('Mocktails & Coolers', 'mocktails', null, 'drinks', 10);

with c as (select id, slug from public.menu_categories)
insert into public.menu_items (category_id, name, description, price, is_veg, is_spicy, is_signature, sort_order, image_url)
select c.id, v.name, v.description, v.price, v.is_veg, v.is_spicy, v.is_signature, v.sort_order, v.image_url
from (values
  ('starters-veg', 'Paneer Tikka', 'Cottage cheese marinated in hung curd and spices, charred in the tandoor.', 329, true, false, false, 1, null),
  ('starters-veg', 'Peanut Masala', 'Roasted peanuts tossed with onion, tomato, green chilli and lime. The bar classic.', 199, true, true, true, 2, null),
  ('starters-veg', 'Chilli Baby Corn', 'Crisp baby corn, soy, garlic and spring onion.', 279, true, true, false, 3, null),
  ('starters-veg', 'Mushroom Pepper Fry', 'Button mushrooms with crushed black pepper and curry leaf.', 289, true, true, false, 4, null),
  ('starters-non-veg', 'Guntur Chicken', 'Our signature — boneless chicken in fiery Guntur red chilli and curry leaf.', 369, false, true, true, 1, '/images/diner/andhra-chicken-fry.jpg'),
  ('starters-non-veg', 'Tandoori Chicken Tikka', 'Boneless chicken, yogurt, kashmiri chilli, charcoal-grilled.', 359, false, false, false, 2, null),
  ('starters-non-veg', 'Lamb Chops', 'Tender lamb chops marinated overnight and finished over coal.', 549, false, false, true, 3, null),
  ('starters-non-veg', 'Chicken 65', 'The Hyderabad classic, curry leaf and green chilli.', 339, false, true, false, 4, null),
  ('starters-non-veg', 'Apollo Fish', 'Boneless fish fried crisp and tossed in a tangy chilli sauce.', 399, false, true, false, 5, null),
  ('mains', 'Paneer Tikka Masala', 'Charred paneer in a rich onion-tomato masala.', 339, true, false, false, 1, null),
  ('mains', 'Dal Makhani', 'Black lentils slow-cooked overnight with butter and cream.', 279, true, false, false, 2, null),
  ('mains', 'Butter Chicken', 'Tandoori chicken in a silky tomato, butter and fenugreek gravy.', 389, false, false, false, 3, null),
  ('mains', 'Andhra Chicken Curry', 'Home-style curry with roasted spices and a proper kick.', 369, false, true, false, 4, '/images/diner/andhra-chicken-curry.jpg'),
  ('mains', 'Mutton Rogan Josh', 'Slow-braised mutton, kashmiri chilli, whole spices.', 449, false, false, false, 5, null),
  ('biryani-rice', 'Hyderabadi Chicken Dum Biryani', 'Long-grain basmati and marinated chicken, dum-cooked and sealed. The queen of the menu.', 349, false, false, true, 1, null),
  ('biryani-rice', 'Mutton Biryani', 'Tender mutton, saffron and fried onions.', 429, false, false, true, 2, null),
  ('biryani-rice', 'Veg Dum Biryani', 'Seasonal vegetables, mint and saffron.', 279, true, false, false, 3, null),
  ('biryani-rice', 'Jeera Rice', null, 199, true, false, false, 4, null),
  ('biryani-rice', 'Plain Curd', null, 50, true, false, false, 5, null),
  ('breads', 'Roti', null, 49, true, false, false, 1, null),
  ('breads', 'Naan', null, 49, true, false, false, 2, null),
  ('breads', 'Butter Naan', null, 69, true, false, false, 3, null),
  ('breads', 'Garlic Butter Naan', null, 99, true, false, false, 4, null),
  ('pizza-continental', 'Margherita Pizza', 'Tomato, mozzarella, basil.', 349, true, false, false, 1, null),
  ('pizza-continental', 'Chicken Tikka Pizza', 'Tandoori chicken, onion, capsicum, mozzarella.', 429, false, false, false, 2, null),
  ('pizza-continental', 'Loaded Fries', 'Fries, cheese sauce, jalapeño, spring onion.', 249, true, false, false, 3, null),
  ('desserts', 'Gulab Jamun', 'Warm, two pieces.', 149, true, false, false, 1, null),
  ('desserts', 'Sizzling Brownie', 'Walnut brownie, vanilla ice cream, hot chocolate sauce.', 279, true, false, false, 2, null),
  ('cocktails', 'Long Island Iced Tea', 'Vodka, rum, gin, tequila, triple sec, cola.', 549, true, false, true, 1, null),
  ('cocktails', 'Mojito', 'White rum, mint, lime, soda.', 399, true, false, false, 2, null),
  ('cocktails', 'Piña Colada', 'Rum, coconut cream, pineapple.', 429, true, false, false, 3, null),
  ('cocktails', 'Frozen Liquid Love', 'House frozen cocktail — ask the bar.', 449, true, false, false, 4, null),
  ('beer', 'Draught Beer (pint)', 'Ask for today''s tap.', 299, true, false, false, 1, null),
  ('beer', 'Craft Beer (pint)', 'Rotating local craft taps.', 349, true, false, false, 2, null),
  ('beer', 'Beer Bucket', 'Five bottled beers on ice.', 1199, true, false, false, 3, null),
  ('mocktails', 'Virgin Mojito', null, 199, true, false, false, 1, null),
  ('mocktails', 'Mango Lassi', null, 149, true, false, false, 2, null),
  ('mocktails', 'Masala Buttermilk', null, 99, true, false, false, 3, null)
) as v(cat, name, description, price, is_veg, is_spicy, is_signature, sort_order, image_url)
join c on c.slug = v.cat;

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
insert into public.events (title, slug, summary, body, image_url, starts_at, ends_at, is_recurring, recurrence_label, price_label, is_featured) values
('Acoustic Colours — Live Music on the Rooftop', 'acoustic-colours-live-music', 'Live acoustic sets on the rooftop every Thursday from 9 PM.', E'Thursday nights belong to Acoustic Colours: live acoustic music on the rooftop from 9 PM onwards, with deals on drinks and the full kitchen open.\n\nGrab a table early — the rooftop fills up fast.', '/images/diner/event-acoustic-colours.jpg', date_trunc('week', now()) + interval '3 days 21 hours', null, true, 'Every Thursday, 9 PM onwards', 'Free entry · deals on drinks', true),
('Ladies Night', 'ladies-night', 'Free shots for ladies, DJ on the decks — every Saturday.', E'Saturday is Ladies Night at The Diner: free shots for ladies, an electrifying dance floor and guest DJ appearances.\n\nFree entry for couples and girls.', '/images/diner/event-ladies-night.jpg', date_trunc('week', now()) + interval '5 days 20 hours', null, true, 'Every Saturday', 'Free entry for couples & girls', true),
('Pitcher Night', 'pitcher-night', 'Bira pitchers at ₹499 every Monday and Tuesday.', E'Beat the weekday blues with Bira pitchers at ₹499, every Monday and Tuesday.', '/images/diner/event-pitcher-night.jpg', date_trunc('week', now()) + interval '19 hours', null, true, 'Every Monday & Tuesday', 'Bira pitchers @ ₹499', false),
('Social Hours', 'social-hours', 'Bar drinks and food at ₹99 — skip the post-work traffic.', E'Skip the post-work traffic and unwind with bar drinks and food at ₹99.\n\n- Saturday to Thursday: 4 PM – 8 PM\n- Friday: 4 PM – 7 PM', '/images/diner/event-social-hours.jpg', now() + interval '1 day', null, true, 'Daily from 4 PM', 'Drinks & food @ ₹99', true),
('Match Nights on the Big Screen', 'match-nights', 'Every big match live on the big screen, with food and drinks on every match day.', E'Cricket, football, F1 — if it matters, it is on the big screen.\n\nBucket deals, platters and a crowd that cheers every boundary. Big match days fill up fast, so call to reserve.', '/images/diner/event-match-screening.jpg', now() + interval '2 days', null, true, 'Every match day', 'Free entry', false),
('Andhra Lunch Combos', 'andhra-lunch-combos', 'Proper Andhra lunch combos starting from ₹179.', E'Andhra-style lunch combos, starting from ₹179 — a quick, filling lunch break near ITPL.', '/images/diner/event-andhra-lunch.jpg', now() + interval '1 day', null, true, 'Every day at lunch', 'From ₹179', false);

-- ---------------------------------------------------------------------------
-- FAQs (also rendered as FAQPage structured data)
-- ---------------------------------------------------------------------------
insert into public.faqs (question, answer, sort_order) values
('Where is The Diner Restobar?', 'We are at 107/4, Pattandur Agrahara Main Road, Whitefield, Bengaluru 560066 — near ITPL Gate 3.', 1),
('What are your opening hours?', 'We are open every day from 11:30 AM to 12:30 AM. The kitchen takes its last order at 12:00 AM.', 2),
('Do I need to book a table?', 'Walk-ins are welcome, but we recommend booking for weekends, match nights and groups. You can reserve online in under a minute.', 3),
('Do you host team parties and private events?', 'Yes. We host team lunches, birthdays and corporate parties for 20 to 250 guests, with food-only and food + bar packages. Send us a party enquiry and we will call you back.', 4),
('Is there parking?', 'Yes, parking is available at the venue and on the street nearby.', 5),
('Are pets allowed?', 'Yes, we are a pet-friendly restobar. Please keep your pet on a leash.', 6),
('Do you serve vegetarian food?', 'Plenty — the menu marks every vegetarian dish, and our veg biryani and paneer tikka are regulars'' favourites.', 7);

-- ---------------------------------------------------------------------------
-- testimonials: left unpublished on purpose. Replace with real guest reviews
-- (with permission) and publish from /admin.
-- ---------------------------------------------------------------------------
insert into public.testimonials (author, text, rating, source, is_published, sort_order) values
('Sample — replace me', 'Paste a real guest review here and publish it from the admin.', 5, 'Google', false, 1);

-- ---------------------------------------------------------------------------
-- gallery
-- ---------------------------------------------------------------------------
insert into public.gallery_images (url, alt, category, sort_order) values
('/images/diner/rooftop-night.jpg', 'Guests dining on the rooftop at The Diner', 'rooftop', 1),
('/images/diner/team-party.jpg', 'A team celebrating at The Diner', 'people', 2),
('/images/diner/starters-platter.jpg', 'Chicken wings, momos and tacos platter', 'food', 3),
('/images/diner/rooftop-day.jpg', 'The rooftop seating area', 'rooftop', 4),
('/images/diner/andhra-chicken-fry.jpg', 'Andhra-style chicken fry on a banana leaf', 'food', 5),
('/images/diner/rooftop-pet-friendly.jpg', 'A guest with her dog on the pet-friendly rooftop', 'rooftop', 6),
('/images/diner/prawns.jpg', 'Crispy prawns with dip', 'food', 7),
('/images/diner/andhra-chicken-curry.jpg', 'Andhra chicken curry with ragi mudde', 'food', 8);

-- ---------------------------------------------------------------------------
-- editable legal pages
-- ---------------------------------------------------------------------------
insert into public.pages (slug, title, content, seo_description) values
('policy', 'House Policy', E'## Reservations\n\nTables are held for 15 minutes past the booking time. If you are running late, call us and we will do our best to hold your table.\n\n## Age policy\n\nAlcohol is served only to guests aged 21 and above. Please carry a valid photo ID.\n\n## Pets\n\nWe are pet friendly. Pets must stay on a leash and with their owners at all times.\n\n## Right of admission\n\nThe management reserves the right of admission.', 'House rules for reservations, age policy and pets at The Diner Restobar.'),
('privacy', 'Privacy Policy', E'We collect only the details you give us when you book a table or send an enquiry — your name, phone number, email and booking details. We use them to manage your reservation and to contact you about it. We do not sell your data.\n\nTo have your data deleted, email wfdiner@gmail.com.', 'How The Diner Restobar handles your personal data.'),
('terms', 'Terms of Service', E'By using this website or booking a table you agree to our house policy. Menu items and prices may change without notice. Online reservations are subject to availability and confirmation.', 'Terms of use for thediner.in.');

-- ---------------------------------------------------------------------------
-- blog (SEO starter posts)
-- ---------------------------------------------------------------------------
insert into public.posts (title, slug, excerpt, content, cover_image, cover_alt, tags, status, published_at, seo_title, seo_description) values
(
  'Where to Watch Cricket in Whitefield: Our Match Night Guide',
  'where-to-watch-cricket-in-whitefield',
  'Big screen, cold beer and a crowd that actually watches the game. Here''s how match nights work at The Diner.',
  E'If you work around ITPL, you know the problem: the match starts at 7:30, you get out at 7, and every bar nearby is either too loud to hear the commentary or too empty to feel like a match.\n\n## What a match night looks like\n\nThe rooftop screen goes on 30 minutes before the toss. We keep the music down while play is on and turn it up between innings. Expect buckets of beer, sharing platters and a crowd that groans at every dropped catch.\n\n## When to book\n\nWeekend games and anything involving RCB fill up fast. Book a table online and pick **Rooftop** as your seating area — you can mention "match night" in the notes.\n\n## What to order\n\n- **Guntur Chicken** — dry, fiery, made for beer\n- **Peanut Masala** — the original bar snack\n- **Beer Bucket** — five on ice, shared\n- **Chicken Dum Biryani** — for the second innings\n\n## Getting here\n\nWe''re on Pattandur Agrahara Main Road, near ITPL Gate 3, with parking on site. See you at the toss.',
  '/images/diner/event-match-screening.jpg',
  'Match screening at The Diner Restobar',
  array['events', 'whitefield', 'sports'],
  'published', now() - interval '6 days',
  'Where to Watch Cricket in Whitefield — Match Nights at The Diner',
  'Looking for a bar to watch IPL and cricket near ITPL, Whitefield? Big-screen match nights, beer buckets and rooftop seating at The Diner Restobar.'
),
(
  'Planning a Team Party in Whitefield? A Practical Checklist',
  'team-party-venue-whitefield-checklist',
  'Headcount, budget, menu, music and the one thing everyone forgets. A no-nonsense guide for whoever got stuck organising the team outing.',
  E'Somebody has to organise the team party, and this year it''s you. Here''s the checklist we walk every organiser through.\n\n## 1. Lock the headcount early\n\nAsk for RSVPs two weeks out and add 10% for last-minute plus-ones. Venues price and staff based on the number you give.\n\n## 2. Decide food-only or food + bar\n\nOur packages start at **₹800 per guest** for food and **₹1,000 per guest** with the bar. Ask whether the price covers taxes and service charge — ours is quoted upfront.\n\n## 3. Pick a space that fits the mood\n\n- **Private dining** for 20–40 guests who want to talk\n- **Rooftop** for 40–250 guests and a party feel\n\n## 4. Sort the music\n\nA DJ for an hour after dinner changes the whole evening. Ask what''s included.\n\n## 5. Plan the getting-home\n\nThe thing everyone forgets. We''re near ITPL with easy cab access — share the location pin in the invite.\n\n## Ready to book?\n\nSend us a party enquiry with your date and headcount and our events team will call you back within a day.',
  '/images/diner/team-party.jpg',
  'A team party at The Diner Restobar',
  array['parties', 'corporate', 'whitefield'],
  'published', now() - interval '3 days',
  'Team Party Venue in Whitefield — Planning Checklist',
  'Organising a team party or office outing in Whitefield? Packages from ₹800 per guest, rooftop and private dining for 20–250 guests near ITPL.'
),
(
  'Why Andhra Food Pairs So Well With Beer',
  'andhra-food-and-beer-pairing',
  'Guntur chilli, curry leaf and a cold pint. A short, slightly biased guide to eating spicy at a bar.',
  E'Andhra cooking is built on heat: Guntur red chilli, black pepper, green chilli and a lot of curry leaf. That''s exactly why it works at a bar.\n\n## Heat loves cold and carbonation\n\nA crisp lager resets your palate between bites, which means you can keep going. Wheat beers soften the burn; a hoppy craft IPA will turn it up.\n\n## Our pairings\n\n| Dish | Pour |\n| --- | --- |\n| Guntur Chicken | Draught lager |\n| Apollo Fish | Wheat beer |\n| Lamb Chops | Craft IPA |\n| Chicken Dum Biryani | Anything cold |\n\n## Not a beer person?\n\nA Mojito or a Masala Buttermilk does the same job: cold, sharp, refreshing.\n\nCome hungry. Book a table, or just walk in.',
  '/images/diner/andhra-chicken-fry.jpg',
  'Andhra-style chicken fry at The Diner',
  array['food', 'drinks'],
  'published', now() - interval '1 day',
  'Andhra Food and Beer Pairing — The Diner Restobar, Whitefield',
  'Guntur chicken, biryani and Andhra spice paired with draught and craft beer. A pairing guide from The Diner Restobar in Whitefield, Bengaluru.'
);

insert into public.integrations (platform) values ('instagram'), ('youtube') on conflict do nothing;
