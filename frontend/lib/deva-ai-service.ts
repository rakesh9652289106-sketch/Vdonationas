/**
 * DevaAI Devotional Service & Devotee Guardrail Engine
 * Dedicated exclusively to devotee-related information, functions, and spiritual guidance
 * for Sri Vasavi Kanyaka Parameswari Matha, Penugonda.
 *
 * STRICT BOUNDARY: All administrative, super admin, temple admin, finance admin,
 * back-office, and moderation queries are intercepted and refused with a Vedic boundary notice.
 *
 * DEVOTEE RESPONSES: All responses provide entire, comprehensive step-by-step instructions
 * so devotees have complete clarity on every single action required.
 */

export interface DevaAIActionLink {
  label: string;
  href: string;
}

export interface DevaAIResponse {
  text: string;
  category: 'DEVOTEE_KNOWLEDGE' | 'ADMIN_RESTRICTED' | 'DEVOTEE_GUIDANCE';
  actionLinks?: DevaAIActionLink[];
  suggestedQuestions?: string[];
}

// Administrative patterns that must NEVER be answered by DevaAI
const ADMIN_PATTERNS: RegExp[] = [
  /\bsuper[\s_-]?admin\b/i,
  /\btemple[\s_-]?admin\b/i,
  /\bfinance[\s_-]?admin\b/i,
  /\btrustee[\s_-]?admin\b/i,
  /\bpriest[\s_-]?admin\b/i,
  /\b(admin|administrator|administration|administrative)\b/i,
  /\bback[\s_-]?office\b/i,
  /\bbackend\b/i,
  /\bmoderation\b/i,
  /\bapproval[\s_-]?workflow\b/i,
  /\bapprove\s+(donation|initiative|campaign|temple|pooja|seva)\b/i,
  /\bdisburse(ment)?\b/i,
  /\bpayout\b/i,
  /\breconcil(e|iation)\b/i,
  /\baudit[\s_-]?(log|trail|report|summary)\b/i,
  /\bmulti[\s_-]?tenant\b/i,
  /\b(admin\s+)?credentials?\b/i,
  /\bapi[\s_-]?keys?\b/i,
  /\bdatabase\b/i,
  /\b(create|edit|manage|pause|unpause|publish|delete)\s+(an\s+)?(initiative|campaign)\b/i,
  /\bmanage\s+button\b/i,
  /\bstage\s*7\b/i,
  /\bteaser[\s_-]?start\b/i,
  /\btemple\s+settings\b/i,
  /\bstaff\s+(access|management|portal|credentials)\b/i,
  /\bemployee\b/i,
  /\bfinancial\s+analytics\b/i,
  /\bcollection\s+report\b/i,
  /\bplatform\s+records\b/i,
  /\bserver[\s_-]verified\s+transactions\b/i,
];

export const DEVOTEE_DEFAULT_SUGGESTIONS = [
  'How do I book an Archana or Pooja?',
  'How do I download my 80G tax receipt?',
  'Tell me about Nitya Annadanam seva',
  'What are the temple darshan timings at Penugonda?',
  'What if I do not know my Gotram?',
  'How does UPI Autopay work for monthly donations?',
];

/**
 * Checks if a user's query pertains to administrative, back-office, or super-admin functions.
 */
export function isAdminQuery(query: string): boolean {
  if (!query || typeof query !== 'string') return false;
  return ADMIN_PATTERNS.some((pattern) => pattern.test(query));
}

/**
 * Standard Vedic refusal message for administrative queries.
 */
const ADMIN_BOUNDARY_RESPONSE: DevaAIResponse = {
  text: `🙏 **Devotee Seva Notice**:

I am **DevaAI**, a devotional assistant created **exclusively for devotees** of Sri Vasavi Kanyaka Parameswari Matha, Penugonda.

🔒 **Access Boundary**:
My sacred purpose is strictly limited to helping devotees with spiritual offerings, pooja bookings, seva participation, and 80G tax receipts. I **do not** have access to, nor do I answer queries regarding:
• Super Admin, Temple Admin, or Finance Admin tools
• Back-office tasks, staff management, or employee roles
• Initiative management, moderation, publishing, or editing
• Bank reconciliations, payout audits, or administrative reports

If you are an authorized temple official or have administrative inquiries, please log into the official **Devasthanam Administrative Portal** or contact the Temple Executive Office directly at **contact@vasavitemple.org**.`,
  category: 'ADMIN_RESTRICTED',
  suggestedQuestions: [
    'How do I book an Archana or Pooja?',
    'How do I download my 80G tax receipt?',
    'What are the temple darshan timings at Penugonda?',
    'Tell me about Nitya Annadanam seva',
  ],
};

/**
 * Generates an intelligent, pure devotee-centric response with entire steps for any query.
 */
export function getDevoteeAIResponse(query: string): DevaAIResponse {
  const trimmed = query.trim();
  const q = trimmed.toLowerCase();

  // 1. Strict Admin Boundary Check
  if (isAdminQuery(q)) {
    return ADMIN_BOUNDARY_RESPONSE;
  }

  // 2. UPI Autopay & Recurring Monthly Sevas (Entire Steps)
  if (
    q.includes('autopay') ||
    q.includes('auto pay') ||
    q.includes('recurring') ||
    q.includes('monthly') ||
    q.includes('subscription') ||
    q.includes('mandate')
  ) {
    return {
      text: `💳 **Entire Steps to Set Up & Manage Monthly Recurring Seva (UPI Autopay)**:

Devotees can automate their monthly charitable offerings (e.g. for Annadanam or Goshala) with zero hassle:

📋 **Step-by-Step Setup Instructions**:
1. **Navigate to Initiatives**: Open the **Initiatives** tab from the top navigation bar or go to \`/initiatives\`.
2. **Select Cause**: Choose the initiative you want to support (e.g., *Nitya Annadanam Seva* or *Goshala Cow Care*).
3. **Select Monthly Mode**: On the donation card, switch the toggle from "One-Time" to **"Monthly Recurring (UPI Autopay)"**.
4. **Choose Amount**: Pick a suggested amount (₹250, ₹500, ₹1,000, ₹2,500) or enter your custom amount.
5. **Enter UPI Details**: Enter your Virtual Payment Address (UPI ID, e.g., \`name@okhdfcbank\`, \`@paytm\`, \`@ybl\`) or choose your mobile UPI app (Google Pay, PhonePe, Paytm, BHIM).
6. **Authorize Mandate on Phone**: Open your UPI app on your phone, review the Devasthanam Autopay mandate, and enter your UPI PIN to approve.
7. **Instant Confirmation**: Your mandate is registered! Every month, your donation will be processed seamlessly and a fresh 80G tax receipt will be sent directly to your email and WhatsApp.

🛑 **Entire Steps to Pause, Resume, or Cancel Anytime**:
1. Go to **Devotee Dashboard** -> **Subscriptions / Autopay** tab.
2. Click **"Pause"** to temporarily freeze monthly debits, or click **"Cancel Mandate"** to terminate it.
3. The change takes effect immediately with zero lock-in or cancellation fees.`,
      category: 'DEVOTEE_KNOWLEDGE',
      actionLinks: [
        { label: 'Manage Subscriptions in Dashboard', href: '/devotee/dashboard' },
        { label: 'Explore Recurring Seva Causes', href: '/initiatives' },
      ],
      suggestedQuestions: [
        'How do I download my 80G tax receipt?',
        'Tell me about Nitya Annadanam seva',
        'Tell me about the Goshala cow protection seva',
      ],
    };
  }

  // 3. 80G Tax Exemption & Receipts (Entire Steps)
  if (
    q.includes('80g') ||
    q.includes('tax') ||
    q.includes('receipt') ||
    q.includes('certificate') ||
    q.includes('exemption') ||
    q.includes('deduction') ||
    q.includes('10be') ||
    q.includes('itr') ||
    q.includes('invoice')
  ) {
    return {
      text: `📜 **Entire Steps to Download & Verify Your 80G Tax Exemption Receipt**:

All charitable offerings to Sri Vasavi Kanyaka Parameswari Matha Devasthanam Trust qualify for **50% tax deduction under Section 80G(5)(vi)** of the Indian Income Tax Act:

📥 **Entire Steps to Download Your 80G Receipt**:
1. **Access Devotee Portal**: Click **"Dashboard"** in the top navigation bar or visit \`/devotee/dashboard\`.
2. **Go to Receipts Tab**: Under the dashboard menu, click on the **"Donation History & Receipts"** tab.
3. **Locate Your Donation**: Scroll to your recent seva transaction or use the search / date filter.
4. **Download PDF**: Click the golden **"Download 80G Receipt"** button next to your transaction.
5. **Save / Print**: Your official, digitally signed PDF receipt will download immediately with:
   • Devasthanam 80G Registration Number & 10BE filing reference
   • Devotee PAN & Name
   • Official Devasthanam Digital Seal
   • Unique QR verification code.

📑 **Entire Steps to Download Annual Consolidated Tax Certificate (For CA / ITR Filing)**:
1. In the same Receipts tab, look at the top header banner.
2. Click **"Download Annual 80G Statement (FY 2025-26)"** to get a single consolidated statement of all your donations for the entire financial year.

🔍 **Entire Steps to Verify Any Receipt Online**:
1. Visit \`/verify-receipt\` or scan the QR code printed on your physical receipt.
2. Enter the Receipt Reference Code (e.g. \`RCP-2026-XXXX\`).
3. Click **"Verify Receipt"** to view real-time server verification confirming 100% tax validity.`,
      category: 'DEVOTEE_KNOWLEDGE',
      actionLinks: [
        { label: 'Verify a Receipt Code', href: '/verify-receipt' },
        { label: 'Download Receipts from Dashboard', href: '/devotee/dashboard' },
      ],
      suggestedQuestions: [
        'How do I verify an 80G receipt online?',
        'How does UPI Autopay work for monthly donations?',
        'Tell me about Nitya Annadanam seva',
      ],
    };
  }

  // 4. Nitya Annadanam Seva (Entire Steps)
  if (
    q.includes('annadanam') ||
    q.includes('anna danam') ||
    q.includes('food') ||
    q.includes('meal') ||
    q.includes('bhojanam') ||
    q.includes('feed pilgrims')
  ) {
    return {
      text: `🍲 **Entire Steps to Sponsor Nitya Annadanam (Feeding Pilgrims)**:

*"Annam Para Brahma Swaroopam"* — Feeding hungry pilgrims at Penugonda Kshetram is revered as the highest spiritual virtue (Maha Daanam):

📋 **Step-by-Step Sponsorship Walkthrough**:
1. **Open Annadanam Initiative**: Click **Initiatives** in the top navigation bar and select **"Nitya Annadanam Seva"** (or visit \`/initiatives/IN-ANNADANAM-001\`).
2. **Select Sponsorship Tier**:
   • **Full-Day Annadanam Sponsorship**: Feeds 2,500+ pilgrims visiting the Kshetram for a whole day.
   • **Special Occasion Seva**: Sponsor meals on birthdays, wedding anniversaries, or in memory of departed elders.
   • **General Annaprasadam Seva**: Donate any custom amount starting from ₹100, ₹500, or ₹1,000.
3. **Enter Dedication & Sankalpam**:
   • Select the auspicious date for your Annadanam.
   • Enter the dedication text (e.g. *"In honor of parents' 50th wedding anniversary"* or *"For family prosperity"*).
4. **Provide Tax Details (Optional)**: Enter your PAN if you wish to claim 50% Section 80G tax deduction.
5. **Complete Contribution**: Choose UPI (GPay, PhonePe, Paytm), Debit/Credit Card, or Net Banking, and finalize the payment.
6. **Sacred Blessing**:
   • Your name and sankalpam dedication will be displayed and announced during the daily Annadanam prayer at the dining hall.
   • An instant 80G tax receipt is generated in your dashboard.`,
      category: 'DEVOTEE_KNOWLEDGE',
      actionLinks: [
        { label: 'Sponsor Nitya Annadanam', href: '/initiatives/IN-ANNADANAM-001' },
        { label: 'Make a General Seva Donation', href: '/donate' },
      ],
      suggestedQuestions: [
        'How do I sponsor Annadanam on my birthday or anniversary?',
        'How do I download my 80G tax receipt?',
        'Tell me about the Goshala cow protection seva',
      ],
    };
  }

  // 5. Goshala & Cow Protection (Go Seva) (Entire Steps)
  if (
    q.includes('goshala') ||
    q.includes('go seva') ||
    q.includes('cow') ||
    q.includes('kamadhenu') ||
    q.includes('fodder') ||
    q.includes('grass') ||
    q.includes('samrakshana')
  ) {
    return {
      text: `🐄 **Entire Steps to Sponsor Goshala & Cow Protection (Go Samrakshana)**:

The temple Goshala at Penugonda provides lifelong shelter, medical care, and nutrition for over 150+ sacred indigenous cows and calves:

📋 **Step-by-Step Sponsorship Walkthrough**:
1. **Open Goshala Initiative**: Visit the **Initiatives** tab and select **"Sri Vasavi Goshala Protection & Cow Care"** (or visit \`/initiatives/IN-GOSHALA-002\`).
2. **Choose Your Seva Offering**:
   • **Go Grasa Seva**: Sponsoring green grass fodder, bran, and jaggery feed.
   • **Go Samrakshana (Cow Adoption)**: Supporting the comprehensive monthly maintenance of a mother cow and calf.
   • **Medical & Winter Shelter Seva**: Contributing towards clean shelter upgrades and veterinary care.
3. **Select Frequency**: Choose between **One-Time** or **Monthly Recurring (UPI Autopay)**.
4. **Enter Devotee Details**: Provide your Name, Gotram, Mobile Number, and PAN (for 80G tax exemption).
5. **Make Sacred Payment**: Complete the offering using UPI QR, Google Pay, PhonePe, Cards, or Net Banking.
6. **Receive Blessings**: Instant 80G receipt, donor certificate, and photo updates from the Goshala are sent to your devotee dashboard.`,
      category: 'DEVOTEE_KNOWLEDGE',
      actionLinks: [
        { label: 'Support Goshala Initiative', href: '/initiatives/IN-GOSHALA-002' },
        { label: 'Devotee Donation Portal', href: '/donate' },
      ],
      suggestedQuestions: [
        'How do I sponsor grass feed for cows?',
        'What are the temple darshan timings at Penugonda?',
        'How do I download my 80G tax receipt?',
      ],
    };
  }

  // 6. Temple Timings, Darshan, and Visiting Penugonda (Entire Steps)
  if (
    q.includes('timing') ||
    q.includes('darshan') ||
    q.includes('open') ||
    q.includes('close') ||
    q.includes('hours') ||
    q.includes('visit') ||
    q.includes('penugonda') ||
    q.includes('address') ||
    q.includes('location') ||
    q.includes('reach') ||
    q.includes('hotel') ||
    q.includes('accommodation') ||
    q.includes('stay') ||
    q.includes('choultry')
  ) {
    return {
      text: `🛕 **Entire Steps to Plan Your Visit & Darshan at Penugonda Kshetram**:

Everything a devotee needs to plan a smooth, spiritually uplifting pilgrimage to Sri Vasavi Kanyaka Parameswari Devasthanam:

📋 **Step-by-Step Pilgrim Guide**:
1. **Check Daily Sanctum Timings**:
   • **Morning Sanctum Hours**: 6:00 AM to 12:30 PM
     - *06:00 AM*: Suprabhata Seva & Nitya Archana
     - *07:00 AM – 11:30 AM*: Sarva Darshanam & Vishesha Archana
     - *12:15 PM*: Maha Mangala Harathi
   • **Evening Sanctum Hours**: 4:30 PM to 8:30 PM
     - *05:00 PM – 08:00 PM*: Sarva Darshanam & Kumkumarchana
     - *08:15 PM*: Sayana Harathi & Ekantha Seva
2. **Choose Your Travel Route**:
   • **Destination**: Sri Vasavi Kanyaka Parameswari Devasthanam, Penugonda, West Godavari District, Andhra Pradesh - 534320.
   • **By Train**: Alight at Tanuku (18 km), Maruteru (4 km), Palakollu (22 km), or Nidadavolu (35 km). Taxis and buses run frequently to the temple.
   • **By Air**: Fly to Rajahmundry Airport (65 km) or Vijayawada Airport (135 km) and take a direct taxi.
3. **Arrange Pilgrim Accommodation**:
   • Devasthanam AC & Non-AC guest rooms and choultries are available right adjacent to the temple.
   • Visit the Devasthanam Enquiry Office upon arrival or contact the temple helpdesk in advance.
4. **Partake in Annaprasadam**:
   • Daily free satvik lunch is served to all pilgrims at the Nitya Annadanam Hall from 11:30 AM to 2:30 PM.
5. **Observances & Etiquette**:
   • Traditional Indian attire is requested (Dhoti/Kurta for men, Saree/Churidar for women).
   • Electronic devices and photography are restricted inside the inner Garbhalayam.`,
      category: 'DEVOTEE_KNOWLEDGE',
      actionLinks: [
        { label: 'View Shrines & Kshetram Details', href: '/temples' },
        { label: 'Contact Temple Office for Accommodations', href: '/contact' },
      ],
      suggestedQuestions: [
        'How do I book an Archana or Pooja?',
        'Tell me about Nitya Annadanam seva',
        'What major festivals are celebrated at Penugonda?',
      ],
    };
  }

  // 7. Sankalpam, Gotram & Nakshatram Guidance (Entire Steps)
  if (
    q.includes('sankalpam') ||
    q.includes('gotra') ||
    q.includes('gotram') ||
    q.includes('nakshatra') ||
    q.includes('nakshatram') ||
    q.includes('rashi') ||
    q.includes('star') ||
    q.includes('unknown')
  ) {
    return {
      text: `🕉️ **Entire Steps for Sankalpam When You Do Not Know Your Gotram**:

A **Sankalpam** is your sacred declaration during any Pooja mentioning your name, lineage, and spiritual prayer:

📋 **Step-by-Step Instructions**:
1. **Understanding Shastric Tradition**:
   • If you or your family members do not know your ancestral Gotram, Sanatana Dharma provides a divine universal lineage: *"Sarvesham Shive Gotram"* or *"Kashyapa Gotram"*.
2. **How to Fill the Booking Form**:
   • In the **Gotram** field of any Pooja booking form, simply select or type **"Shiva Gotram"** (or **"Kashyapa Gotram"**).
   • The temple priests honor this with full Vedic sanctification during the ritual.
3. **If You Do Not Know Your Nakshatram (Birth Star)**:
   • Look up your Janma Nakshatram based on your date and approximate time of birth.
   • If birth details are unavailable, select your Rashi based on the first letter of your legal or spoken name.
4. **State Your Prayer / Sankalpam Purpose**:
   • Choose your primary aspiration: Ayushya (long life), Arogya (good health), Santana (children's well-being), Vivaha (marriage blessings), or Vyapara Vriddhi (business prosperity).
5. **Save to Your Devotee Profile**:
   • Go to **Devotee Dashboard -> My Profile** and save your Sankalpam details. They will auto-fill for every future booking!`,
      category: 'DEVOTEE_KNOWLEDGE',
      actionLinks: [
        { label: 'Update Family Sankalpam Profile', href: '/devotee/profile' },
        { label: 'Book a Pooja with Sankalpam', href: '/devotee/poojas' },
      ],
      suggestedQuestions: [
        'How do I book an Archana or Pooja?',
        'How do I receive pooja prasadam at home?',
        'How do I download my 80G tax receipt?',
      ],
    };
  }

  // 8. Sacred Initiatives & Campaigns (Entire Steps)
  if (
    q.includes('initiative') ||
    q.includes('campaign') ||
    q.includes('project') ||
    q.includes('cause') ||
    q.includes('dining hall') ||
    q.includes('gopuram') ||
    q.includes('kalasham') ||
    q.includes('veda') ||
    q.includes('pathashala') ||
    q.includes('renovation') ||
    q.includes('donate') ||
    q.includes('urgent') ||
    q.includes('countdown')
  ) {
    return {
      text: `🏛️ **Entire Steps to Participate in Sacred Temple Initiatives**:

Devotees can take an active part in the divine development of Sri Vasavi Kanyaka Parameswari Devasthanam:

📋 **Step-by-Step Walkthrough**:
1. **Browse Initiatives**: Click on **"Initiatives"** in the top navigation bar (or visit \`/initiatives\`).
2. **Select an Initiative**: Browse active causes:
   • *New Annadanam Mega Dining Hall*
   • *Sri Vasavi Goshala Winter Shelter & Medical Care*
   • *Veda Pathashala Preservation*
   • *Akhanda Deepam Seva*
3. **Check Muhurtham & Progress**: View the real-time funding progress bar, remaining goal, and active contributors.
4. **Set Muhurtham Reminder (For Scheduled Launches)**:
   • If an initiative displays an auspicious Muhurtham countdown teaser, click the golden **"Remind"** button.
   • You will receive an automated launch alert via Push Notification, SMS, and WhatsApp as soon as the sacred launch begins!
5. **Enter Contribution Amount**: Pick a suggested amount or type a custom offering.
6. **Provide Donor Information**: Enter your Name, Mobile, Email, and PAN for 80G tax receipt.
7. **Complete Payment**: Pay via UPI, Cards, or Net Banking. Your name is added to the sacred donor roll with an instant 80G certificate!`,
      category: 'DEVOTEE_KNOWLEDGE',
      actionLinks: [
        { label: 'Explore All Sacred Initiatives', href: '/initiatives' },
        { label: 'Quick Seva Offering', href: '/donate' },
      ],
      suggestedQuestions: [
        'How do I download my 80G tax receipt?',
        'Tell me about Nitya Annadanam seva',
        'How does UPI Autopay work for monthly donations?',
      ],
    };
  }

  // 9. Festivals & Sacred Calendar (Entire Steps)
  if (
    q.includes('festival') ||
    q.includes('utsavam') ||
    q.includes('jayanthi') ||
    q.includes('atmarpanam') ||
    q.includes('navaratri') ||
    q.includes('calendar') ||
    q.includes('panchangam')
  ) {
    return {
      text: `🎉 **Entire Steps to View Temple Festivals & Book Festival Sevas**:

Stay connected to sacred Tithis and divine Utsavams celebrated at Penugonda Kshetram:

📋 **Step-by-Step Instructions**:
1. **Open Festivals Portal**: Navigate to **Devotee Dashboard -> Festivals & Panchangam** (or visit \`/devotee/festivals\`).
2. **Browse Major Celebrations**:
   • **Sri Vasavi Jayanthi** (Vaisakha Shuddha Dashami): Goddess Vasavi's divine manifestation day.
   • **Sri Vasavi Atmarpanam Day** (Magha Shuddha Vidiya): Sacred observance of Ahimsa and Dharmic honor.
   • **Sharannavaratri Utsavams**: 10-day festival featuring 9 celestial Alankarams.
   • **Karthika Deepotsavam**: Grand lighting of thousands of ghee lamps.
3. **Check Panchangam Timings**: View auspicious Muhurthams, Rahu Kalam, and Varjyam for today.
4. **Reserve Festival Seva**: Click **"Book Festival Seva"** on the festival banner to schedule special Kumkumarchana or Abhishekam in advance.`,
      category: 'DEVOTEE_KNOWLEDGE',
      actionLinks: [
        { label: 'View Festival Schedule', href: '/devotee/festivals' },
        { label: 'Book Festival Pooja', href: '/devotee/poojas' },
      ],
      suggestedQuestions: [
        'What are the temple darshan timings at Penugonda?',
        'How do I book an Archana or Pooja?',
        'Tell me about Nitya Annadanam seva',
      ],
    };
  }

  // 10. Payment Help & Troubleshooting (Entire Steps)
  if (
    q.includes('payment') ||
    q.includes('failed') ||
    q.includes('money deducted') ||
    q.includes('refund') ||
    q.includes('pending') ||
    q.includes('double debit') ||
    q.includes('trouble')
  ) {
    return {
      text: `💳 **Entire Steps if Money Was Deducted but Receipt Is Pending**:

If your bank account or UPI app was debited but the receipt or confirmation was not immediately generated:

📋 **Step-by-Step Resolution Process**:
1. **Do NOT Make a Duplicate Payment**: Wait a moment—your funds are safe.
2. **Note Down the 12-Digit UTR**: Open your UPI app (GPay, PhonePe, Paytm, or Bank app) and copy the **12-digit UPI Reference Number (UTR)** or Transaction ID.
3. **Wait 5 to 10 Minutes**: Banking networks periodically sync transaction confirmations. The platform's automated webhook reconciles pending payments automatically.
4. **Check Your Devotee Dashboard**:
   • Go to **Devotee Dashboard -> Donation History & Receipts**.
   • Refresh the page. If status changed to "Completed", your 80G receipt is ready to download.
5. **Use Receipt Verification Page**:
   • Visit \`/verify-receipt\`.
   • Enter your UTR / transaction number to fetch the live server status.
6. **Bank Auto-Reversal**:
   • If the payment failed at the banking server, the deducted amount will automatically reverse back to your original bank account within **2 to 3 business days** as per RBI mandates.
7. **Contact Devotee Care**:
   • If unresolved after 24 hours, email **support@vasavitemple.org** with your 12-digit UTR number and registered mobile number for instant priority assistance.`,
      category: 'DEVOTEE_KNOWLEDGE',
      actionLinks: [
        { label: 'Verify Receipt Status', href: '/verify-receipt' },
        { label: 'Check Donation History', href: '/devotee/dashboard' },
      ],
      suggestedQuestions: [
        'How do I download my 80G tax receipt?',
        'How do I book an Archana or Pooja?',
      ],
    };
  }

  // 11. Poojas & Sevas Booking (General) (Entire Steps)
  if (
    q.includes('pooja') ||
    q.includes('puja') ||
    q.includes('seva') ||
    q.includes('archana') ||
    q.includes('abhishekam') ||
    q.includes('kumkum') ||
    q.includes('homam') ||
    q.includes('suprabhatam') ||
    q.includes('chandi') ||
    q.includes('sahasranama') ||
    q.includes('ashtothara') ||
    (q.includes('book') && !q.includes('hotel') && !q.includes('room'))
  ) {
    return {
      text: `🕉️ **Entire Steps to Book a Pooja, Seva & Sankalpam Online**:

Devotees can participate in sacred rituals at Sri Vasavi Kanyaka Parameswari Devasthanam from anywhere in the world:

📋 **Step-by-Step Booking Walkthrough**:
1. **Open the Poojas Catalog**: Click on the **"Poojas"** link in the navigation menu or visit \`/devotee/poojas\`.
2. **Select Your Seva**: Browse sacred offerings (e.g., *Sri Vasavi Kumkumarchana*, *Suprabhata Seva*, *Panchamrutha Abhishekam*, *Sahasranamarchana*, *Chandi Homam*). Click **"Book Seva"**.
3. **Select Auspicious Date**: Choose your preferred Muhurtham date from the interactive calendar.
4. **Fill Family Sankalpam**:
   • Enter the primary devotee's full name (Kartha).
   • Enter your ancestral **Gotram** (if you don't know it, simply select **"Shiva Gotram"**).
   • Select your **Janma Nakshatram** (birth star) and **Rashi** (zodiac sign).
   • Select your Sankalpam prayer purpose (e.g., Ayushya, Arogya, Santana, Vivaha, Vyapara Vriddhi).
   • Add participating family members' names.
5. **Prasadam Delivery Address**:
   • Enter your complete postal delivery address (House No., Street, City, State, PIN code, and Mobile number).
   • The temple will dispatch sanctified Kumkumam, Vibhuti, and Akshintalu via Speed Post after the ritual.
6. **Make Sacred Offering**: Proceed to the secure payment screen and pay via UPI (GPay, PhonePe, Paytm), Debit/Credit Card, or Net Banking.
7. **Confirmation & Live Darshan**:
   • You receive an immediate booking confirmation SMS and WhatsApp.
   • A dedicated Live Darshan streaming link will be accessible under **Devotee Dashboard -> My Sevas** on the day of the pooja.`,
      category: 'DEVOTEE_KNOWLEDGE',
      actionLinks: [
        { label: 'Explore & Book Poojas', href: '/devotee/poojas' },
        { label: 'View My Booked Sevas', href: '/devotee/dashboard' },
      ],
      suggestedQuestions: [
        'What if I do not know my Gotram?',
        'How do I receive pooja prasadam at home?',
        'What are the temple darshan timings?',
      ],
    };
  }

  // 12. Devotee Dashboard & Portal Functions (Entire Steps)
  if (
    q.includes('dashboard') ||
    q.includes('portal') ||
    q.includes('my account') ||
    q.includes('my profile') ||
    q.includes('my sevas') ||
    q.includes('history') ||
    q.includes('donor certificate')
  ) {
    return {
      text: `📱 **Entire Steps to Set Up & Navigate Your Devotee Portal**:

The Devotee Portal allows you to store your family's Vedic details once so every seva booking and receipt is effortless:

📋 **Step-by-Step Walkthrough**:
1. **Access Devotee Portal**: Log in with your registered 10-digit mobile number and password, or continue with Google / Gmail (no OTP needed).
2. **Open Profile**: Click your avatar at the top right and select **"My Profile"** (or visit \`/devotee/profile\`).
3. **Update Personal Info**: Enter your Full Name, Email, Mobile Number, and PAN (for automated 80G tax receipts).
4. **Enter Vedic Sankalpam Details**: Enter your ancestral Gotram, Janma Nakshatram, and Rashi.
5. **Add Family Members**:
   • Scroll down to the **Family Members** section.
   • Click **"+ Add Family Member"**.
   • Enter their Name, Relation (Spouse, Son, Daughter, Father, Mother), Gotram, and Birth Star.
   • Click **"Save Member"**.
6. **Save Entire Profile**: Click the golden **"Save Changes"** button at the bottom.
7. **Access All Services**:
   • **Donation History**: Instant access to past contributions and 80G PDF receipts.
   • **My Sevas**: Track upcoming poojas, sankalpam details, and live streaming links.
   • **Donor Certificates**: Download high-resolution blessing certificates for your sacred offerings.`,
      category: 'DEVOTEE_KNOWLEDGE',
      actionLinks: [
        { label: 'Go to Devotee Dashboard', href: '/devotee/dashboard' },
        { label: 'Edit Family Profile', href: '/devotee/profile' },
      ],
      suggestedQuestions: [
        'How do I download my 80G tax receipt?',
        'How do I book an Archana or Pooja?',
        'What if I do not know my Gotram?',
      ],
    };
  }

  // 13. General Greeting / Fallback (Pure Devotee Persona with Entire Steps)
  return {
    text: `🙏 **Namaste Devotee! I am DevaAI**, your dedicated devotional guide for **Sri Vasavi Kanyaka Parameswari Matha, Penugonda**.

I provide **entire, step-by-step guidance** for all devotee services:
1. **Book an Archana or Pooja**: Complete steps from date selection to family sankalpam and prasadam dispatch.
2. **Download 80G Tax Receipts**: Complete steps to download instant PDF receipts or annual statements.
3. **Sponsor Annadanam & Goshala**: Complete steps to sponsor meals for 2,500+ pilgrims or adopt a cow.
4. **Plan Kshetram Pilgrimage**: Complete steps covering darshan timings, travel routes, and choultries.
5. **Set Up UPI Autopay**: Complete steps to automate monthly seva with 1-click pause/cancel controls.
6. **Sankalpam Guidance**: Complete steps for what to do if you do not know your Gotram (*Shiva Gotram*).

Please ask any question, and I will give you the **entire steps**!`,
    category: 'DEVOTEE_GUIDANCE',
    suggestedQuestions: DEVOTEE_DEFAULT_SUGGESTIONS,
    actionLinks: [
      { label: 'Book a Pooja', href: '/devotee/poojas' },
      { label: 'Explore Initiatives', href: '/initiatives' },
      { label: 'Download 80G Receipts', href: '/devotee/dashboard' },
    ],
  };
}
