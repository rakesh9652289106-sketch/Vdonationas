export type Language = 'en' | 'te';

export const translations = {
  en: {
    // Navigation
    navHome: 'Home',
    navDonate: 'Donate',
    navAutopay: 'Monthly Autopay',
    navFestivals: 'Festivals',
    navCampaigns: 'Campaigns',
    navVerifyReceipt: 'Verify 80G Receipt',
    navDevoteeDashboard: 'Devotee Portal',
    navAdminDashboard: 'Temple Admin',
    navLanguage: 'Language',
    navEnglish: 'English',
    navTelugu: 'తెలుగు',

    // Devotee Sidebar Items
    sidebarDevoteeHome: 'Devotee Home',
    sidebarMyDonations: 'My Donations',
    sidebarMyReceipts: 'My Receipts',
    sidebarAnnualStatement: 'Annual Statement',
    sidebarDonationAnalytics: 'Donation Analytics',
    sidebarAnalyticsAndStatement: 'Analytics & Annual Statement',
    sidebarMyTemples: 'My Temples',
    sidebarFavoriteShrines: 'Favorite Shrines',
    sidebarRecurringSeva: 'Recurring Seva',
    sidebarFamilyOccasions: 'Family & Occasions',
    sidebarUpcomingFestivals: 'Upcoming Festivals',
    sidebarPoojaBookings: 'Pooja Bookings',
    sidebarPrasadamOrders: 'Prasadam Orders',
    sidebarNotifications: 'Notifications',
    sidebarMyProfile: 'My Profile',
    sidebarSecurityPrivacy: 'Security & Privacy',
    sidebarSecurity2FA: 'Security & 2FA',
    sidebarPrivacyControls: 'Privacy Controls',
    sidebarDonationSupport: 'Donation Support',

    // Temple Admin Sidebar Items
    sidebarTempleDashboard: 'Temple Dashboard',
    sidebarEditShrineProfile: 'Edit Shrine Profile',
    sidebarDonationCategories: 'Donation Categories',
    sidebarCampaigns: 'Campaigns',
    sidebarPoojaCatalog: 'Pooja & Seva Catalog',
    sidebarQRManagement: 'QR Code Management',
    sidebarCounterTVMode: 'Counter TV Mode',
    sidebarPrivateDonorCRM: 'Private Donor CRM',
    sidebarDonationsAudit: 'Donations Audit',

    // Financial Controller Sidebar Items
    sidebarFinanceDashboard: 'Finance Dashboard',
    sidebarReconciliation: 'Bank Reconciliation',
    sidebarPaymentGateways: 'Payment Gateways',
    sidebarQRDestinations: 'QR Destinations',
    sidebarRefundApprovals: 'Refund Approvals',
    sidebarSecurityAlerts: 'Security Alerts',
    sidebarAuditLogs: 'Audit Logs',
    sidebarFinancialReports: 'Financial Reports',

    // Super Admin Sidebar Items
    sidebarSuperDashboard: 'Super Dashboard',
    sidebarManageTemples: 'Manage Temples',
    sidebarUserRoleMatrix: 'User Role Matrix',
    sidebarUserMatrix: 'User Role Matrix',
    sidebarPanchangamManager: 'Panchangam & Muhurtham',
    sidebarSaaSSettings: 'SaaS Settings',
    sidebarSystemHealth: 'System Health',
    sidebarSecurityFraud: 'Security Center & Fraud',
    sidebarBankReconciliation: 'Bank Reconciliation',
    sidebarSevaCategories: 'Donation Categories',
    sidebarDonorCRM: 'Private Donor CRM',
    sidebarTempleProfile: 'Edit Shrine Profile',

    // Hero Section
    heroBadge: 'SACRED DIVINE PRESENCE',
    heroTitle: 'Sri Vasavi Kanyaka Parameswari Matha, Penugonda',
    heroSubtitle: 'Offer your sacred contributions to the holy Penugonda Devasthanam. Transparent, 100% digital, 80G tax-exempted devotional platform.',
    heroCtaDonate: '🙏 Offer Seva Now',
    heroCtaAutopay: '🔄 Monthly Autopay Seva',
    heroStatsDevotees: '1.2L+ Devotees',
    heroStatsAmount: '₹4.8 Cr+ Offered',
    heroStatsTrust: '100% Verified Trust',

    // Single Temple Info
    templeName: 'Sri Vasavi Kanyaka Parameswari Matha',
    templeLocation: 'Penugonda, West Godavari, Andhra Pradesh',
    templeDeity: 'Goddess Sri Vasavi Kanyaka Parameswari Ammavaru',
    templeRegNo: 'AP-SEC-TRUST-2024-8891',

    // Seva Form
    sevaHeaderBadge: 'SRI VASAVI MATHA DIVINE SEVA',
    sevaHeaderTitle: 'Offer Your Contribution to Sri Vasavi Matha',
    selectLocationLabel: 'Select Matha / Temple Location',
    selectCategoryLabel: 'Select Seva Category',
    selectAmountLabel: 'Select Contribution Amount (₹)',
    selectedOfferingLabel: 'SELECTED SEVA OFFERING',
    customAmountPlaceholder: 'Or enter custom amount in ₹ (minimum ₹1)',
    paymentGatewayLabel: 'Payment Gateway Mode',
    btnOfferSeva: '🙏 Offer Seva of',
    btnProcessing: 'Processing Sacred Offering...',
    securityNotice: '256-Bit Encrypted • Immediate Official Sri Vasavi Matha Digital Seva Certificate',

    // Seva Categories
    catAnnadanamTitle: 'Annadanam Seva',
    catAnnadanamSubtitle: 'OFFER FOOD TO DEVOTEES',
    catAnnadanamDesc: 'Sponsor daily sacred meals for thousands of visiting devotees and pilgrims at Penugonda & Matha centers.',

    catPushpaTitle: 'Pushpa Seva',
    catPushpaSubtitle: 'OFFER FLOWERS TO THE GODDESS',
    catPushpaDesc: 'Adorn Sri Vasavi Kanyaka Parameswari Matha with fresh scented jasmine, rose garlands, and lotus flowers.',

    catMathaTitle: 'Matha Development',
    catMathaSubtitle: 'SUPPORT TEMPLE DEVELOPMENT',
    catMathaDesc: 'Contribute to the architectural expansion, Gopuram gilding, stone carvings, and pilgrim facilities.',

    catPoojaTitle: 'Pooja Seva',
    catPoojaSubtitle: 'PARTICIPATE IN SACRED WORSHIP',
    catPoojaDesc: 'Book daily Archana, Sahasranama Kumkumarchana, and special Homam in your family name.',

    catCommunityTitle: 'Community Development',
    catCommunitySubtitle: 'SUPPORT ARYA VYSYA COMMUNITY INITIATIVES',
    catCommunityDesc: 'Fund community halls, Vysya youth skill centers, micro-grants, and heritage preservation funds.',

    catEducationTitle: 'Education',
    catEducationSubtitle: 'SUPPORT EDUCATIONAL INITIATIVES',
    catEducationDesc: 'Provide merit scholarships, books, and hostel facilities for deserving students across colleges.',

    catSocialTitle: 'Social Service',
    catSocialSubtitle: 'SUPPORT COMMUNITY WELFARE',
    catSocialDesc: 'Fund free medical camps, blood donation drives, senior care centers, and emergency relief funds.',

    btnOfferSevaNow: 'Offer This Seva Now',
    sacredSevaHeader: 'SACRED SEVA CATEGORIES',
    chooseDevotionalService: 'Choose Your Devotional Service',

    // 3D Map
    mapHeaderBadge: 'INTERACTIVE 3D TEMPLE NETWORK MAP',
    mapTitle: 'Discover Verified Shrines Across India',
    mapHelpText: 'Click any glowing 3D marker to inspect shrine details & offerings',
    verifiedDevasthanam: 'VERIFIED TEMPLE DEVASTHANAM',
    btnViewShrine: 'View Shrine',
    btnDonateNow: 'Donate Now',

    // Arya Vysya Heritage Section
    heritageBadge: 'ARYA VYSYA HERITAGE & LEGACY',
    heritageTitle: 'Preserving Sacred Values, Dharma & Community Unity',
    heritageDesc: 'Follow the divine path of Goddess Sri Vasavi Kanyaka Parameswari through Ahimsa (Non-violence), Satya (Truth), and Atma-Tyaham (Selfless Sacrifice).',
    heritageCard1Title: 'Sacred Ahimsa & Satya',
    heritageCard1Desc: 'Guided by the eternal principles of truth, peace, and non-violence laid down by Sri Vasavi Ammavaru.',
    heritageCard2Title: 'Penugonda Sacred Peetham',
    heritageCard2Desc: 'The birth soil and eternal holy abode of Goddess Sri Vasavi Matha, uniting Vysya devotees worldwide.',
    heritageCard3Title: '102 Gotra Heritage',
    heritageCard3Desc: 'Honoring the 102 sacred Gotras of noble Vysya families who sacrificed for righteousness.',

    // Autopay Page
    autopayBadge: 'AUTOMATED MONTHLY SEVA (UPI AUTOPAY / E-NACH)',
    autopayTitle: 'Nitya Annadanam & Matha Seva Monthly Subscription',
    autopaySubtitle: 'Set up hassle-free automated monthly offerings to Sri Vasavi Matha, Penugonda with 100% tax benefits.',
    autopaySelectPlan: 'Choose Monthly Contribution Tier (₹/month)',
    autopayBtnSubscribe: '🙏 Activate Monthly Autopay Seva',
    autopaySuccessMsg: 'Monthly Autopay Seva Activated Successfully!',

    // Footer
    footerDesc: 'Official Digital Devotional Platform for Sri Vasavi Kanyaka Parameswari Matha, Penugonda.',
    footerQuickLinks: 'Quick Links',
    footerLegal: 'Legal & Tax Benefits',
    footerRights: 'All Rights Reserved. Sri Vasavi Kanyaka Parameswari Matha Trust, Penugonda.',
  },

  te: {
    // Navigation
    navHome: 'హోమ్',
    navDonate: 'కానుక దానం',
    navAutopay: 'నెలవారీ ఆటోపే',
    navFestivals: 'ఉత్సవాలు',
    navCampaigns: 'ప్రచారాలు',
    navVerifyReceipt: '80G రశీదు తనిఖీ',
    navDevoteeDashboard: 'భక్తుల పోర్టల్',
    navAdminDashboard: 'మఠం అడ్మిన్',
    navLanguage: 'భాష',
    navEnglish: 'English',
    navTelugu: 'తెలుగు',

    // Devotee Sidebar Items
    sidebarDevoteeHome: 'భక్తుల నిలయం',
    sidebarMyDonations: 'నా కానుకలు / దానాలు',
    sidebarMyReceipts: 'నా 80G రశీదులు',
    sidebarAnnualStatement: 'వార్షిక నివేదిక',
    sidebarDonationAnalytics: 'కానుకల విశ్లేషణలు',
    sidebarAnalyticsAndStatement: 'విశ్లేషణలు & వార్షిక నివేదిక',
    sidebarMyTemples: 'నా మఠం క్షేత్రాలు',
    sidebarFavoriteShrines: 'ఇష్టమైన క్షేత్రాలు',
    sidebarRecurringSeva: 'నెలవారీ ఆటోపే సేవ',
    sidebarFamilyOccasions: 'కుటుంబం & విశేషాలు',
    sidebarUpcomingFestivals: 'రాబోయే ఉత్సవాలు',
    sidebarPoojaBookings: 'పూజా బుకింగ్‌లు',
    sidebarPrasadamOrders: 'ప్రసాదం ఆర్డర్లు',
    sidebarNotifications: 'నోటిఫికేషన్లు',
    sidebarMyProfile: 'నా ప్రొఫైల్',
    sidebarSecurityPrivacy: 'భద్రత & గోప్యత',
    sidebarSecurity2FA: 'భద్రత & సెక్యూరిటీ',
    sidebarPrivacyControls: 'గోప్యత నిబంధనలు',
    sidebarDonationSupport: 'సహాయం & మద్దతు',

    // Temple Admin Sidebar Items
    sidebarTempleDashboard: 'మఠం డ్యాష్‌బోర్డ్',
    sidebarEditShrineProfile: 'మఠం వివరాల సవరణ',
    sidebarDonationCategories: 'సేవ వర్గాలు',
    sidebarCampaigns: 'ప్రచారాలు & కార్యక్రమాలు',
    sidebarPoojaCatalog: 'పూజల జాబితా',
    sidebarQRManagement: 'QR కోడ్ నిర్వాహణ',
    sidebarCounterTVMode: 'కౌంటర్ TV డిస్ప్లే',
    sidebarPrivateDonorCRM: 'భక్తుల డేటాబేస్',
    sidebarDonationsAudit: 'కానుకల ఆడిట్',

    // Financial Controller Sidebar Items
    sidebarFinanceDashboard: 'ఆర్థిక డ్యాష్‌బోర్డ్',
    sidebarReconciliation: 'బ్యాంకు సమన్వయం',
    sidebarPaymentGateways: 'చెల్లింపు గేట్‌వేలు',
    sidebarQRDestinations: 'QR డెస్టినేషన్లు',
    sidebarRefundApprovals: 'రిఫండ్ ఆమోదాలు',
    sidebarSecurityAlerts: 'సెక్యూరిటీ హెచ్చరికలు',
    sidebarAuditLogs: 'ఆడిట్ లాగ్‌లు',
    sidebarFinancialReports: 'ఆర్థిక నివేదికలు',

    // Super Admin Sidebar Items
    sidebarSuperDashboard: 'సూపర్ అడ్మిన్ డ్యాష్‌బోర్డ్',
    sidebarManageTemples: 'మఠాల నిర్వాహణ',
    sidebarUserRoleMatrix: 'వినియోగదారుల హక్కులు',
    sidebarUserMatrix: 'వినియోగదారుల హక్కులు',
    sidebarPanchangamManager: 'పంచాంగం & ముహూర్తం',
    sidebarSaaSSettings: 'సిస్టమ్ సెట్టింగ్‌లు',
    sidebarSystemHealth: 'సిస్టమ్ ఆరోగ్యం',
    sidebarSecurityFraud: 'సెక్యూరిటీ సెంటర్ & ఫ్రాడ్',
    sidebarBankReconciliation: 'బ్యాంకు సమన్వయం',
    sidebarSevaCategories: 'సేవ వర్గాలు',
    sidebarDonorCRM: 'భక్తుల డేటాబేస్',
    sidebarTempleProfile: 'మఠం వివరాల సవరణ',

    // Hero Section
    heroBadge: 'పవిత్ర దివ్య సమక్షం',
    heroTitle: 'శ్రీ వాసవీ కన్యకా పరమేశ్వరి మఠం, పెనుగొండ',
    heroSubtitle: 'పవిత్ర పెనుగొండ దేవస్థానానికి మీ భక్తి కానుకలను సమర్పించండి. పారదర్శకమైన, 100% డిజిటల్, 80G పన్ను మినహాయింపు పొందిన భక్తి వేదిక.',
    heroCtaDonate: '🙏 ఇప్పుడే సేవను సమర్పించండి',
    heroCtaAutopay: '🔄 నెలవారీ ఆటోపే సేవ',
    heroStatsDevotees: '1.2 లక్షల+ భక్తులు',
    heroStatsAmount: '₹4.8 కోట్లు+ సమర్పణలు',
    heroStatsTrust: '100% ప్రామాణీకరించబడిన ట్రస్ట్',

    // Single Temple Info
    templeName: 'శ్రీ వాసవీ కన్యకా పరమేశ్వరి మఠం',
    templeLocation: 'పెనుగొండ, పశ్చిమ గోదావరి, ఆంధ్రప్రదేశ్',
    templeDeity: 'శ్రీ వాసవీ కన్యకా పరమేశ్వరి అమ్మవారు',
    templeRegNo: 'AP-SEC-TRUST-2024-8891',

    // Seva Form
    sevaHeaderBadge: 'శ్రీ వాసవీ మాత దివ్య సేవ',
    sevaHeaderTitle: 'శ్రీ వాసవీ మాతకు మీ పవిత్ర కానుకను సమర్పించండి',
    selectLocationLabel: 'మఠం / ఆలయ ప్రాంతాన్ని ఎంచుకోండి',
    selectCategoryLabel: 'సేవ వర్గాన్ని ఎంచుకోండి',
    selectAmountLabel: 'కానుక మొత్తాన్ని ఎంచుకోండి (₹)',
    selectedOfferingLabel: 'ఎంచుకున్న సేవ కానుక',
    customAmountPlaceholder: 'లేదా కావలసిన మొత్తాన్ని నమోదు చేయండి ₹ (కనీసం ₹1)',
    paymentGatewayLabel: 'చెల్లింపు విధానం',
    btnOfferSeva: '🙏 కానుకను సమర్పించండి ₹',
    btnProcessing: 'పవిత్ర కానుక ప్రక్రియ జరుగుతోంది...',
    securityNotice: '256-బిట్ ఎన్‌క్రిప్ట్ చేయబడింది • తక్షణ అధికారిక శ్రీ వాసవీ మాత డిజిటల్ రశీదు లభించును',

    // Seva Categories
    catAnnadanamTitle: 'అన్నదానం సేవ',
    catAnnadanamSubtitle: 'భక్తులకు అన్న ప్రసాద వితరణ',
    catAnnadanamDesc: 'పెనుగొండ మఠం కేంద్రంలో రోజువారీ వేలాది మంది భక్తులకు పవిత్ర అన్న ప్రసాదాన్ని స్పాన్సర్ చేయండి.',

    catPushpaTitle: 'పుష్ప సేవ',
    catPushpaSubtitle: 'అమ్మవారికి పవిత్ర పూల సమర్పణ',
    catPushpaDesc: 'శ్రీ వాసవీ కన్యకా పరమేశ్వరి మాతను తాజా సెంట్ మల్లెలు, గులాబీ దండలు మరియు కమలాలతో అలంకరించండి.',

    catMathaTitle: 'మఠం అభివృద్ధి సేవ',
    catMathaSubtitle: 'ఆలయ నిర్మాణ అభివృద్ధికి మద్దతు',
    catMathaDesc: 'ఆలయ గోపురం బంగారు పూత, శిల్ప కళా నిర్మాణాలు మరియు భక్తుల సౌకర్యాల విస్తరణకు తోడ్పడండి.',

    catPoojaTitle: 'పూజా సేవ',
    catPoojaSubtitle: 'పవిత్ర పూజలలో భాగస్వాములు అవ్వండి',
    catPoojaDesc: 'మీ కుటుంబ పేరుతో రోజువారీ అర్చన, సహస్రనామ కుంకుమార్చన మరియు హోమాలను నమోదు చేసుకోండి.',

    catCommunityTitle: 'సమాజ అభివృద్ధి సేవ',
    catCommunitySubtitle: 'ఆర్య వైశ్య సంక్షేమ కార్యక్రమాలకు మద్దతు',
    catCommunityDesc: 'వైశ్య యువత నైపుణ్య కేంద్రాలు, కమ్యూనిటీ హాళ్లు మరియు సాంస్కృతిక నిధులకు తోడ్పడండి.',

    catEducationTitle: 'విద్యా సేవ',
    catEducationSubtitle: 'పేద విద్యార్థుల విద్యా సహాయం',
    catEducationDesc: 'పేద ప్రతిభావంతులైన విద్యార్థులకు స్కాలర్‌షిప్‌లు, పుస్తకాలు మరియు హాస్టల్ సౌకర్యాలను అందించండి.',

    catSocialTitle: 'సామాజిక సేవ',
    catSocialSubtitle: 'సమాజ సంక్షేమ కార్యక్రమాలు',
    catSocialDesc: 'ఉచిత వైద్య శిబిరాలు, రక్తదాన శిబిరాలు, వృద్ధాశ్రమాలు మరియు అత్యవసర సహాయ నిధులకు మద్దతు ఇవ్వండి.',

    btnOfferSevaNow: 'ఈ సేవను ఇప్పుడే సమర్పించండి',
    sacredSevaHeader: 'పవిత్ర సేవ వర్గాలు',
    chooseDevotionalService: 'మీ భక్తి సేవను ఎంచుకోండి',

    // 3D Map
    mapHeaderBadge: 'ఇంటరాక్టివ్ 3D ఆలయ నెట్‌వర్క్ మ్యాప్',
    mapTitle: 'భారతదేశంలోని ప్రామాణీకరించబడిన క్షేత్రాలను అన్వేషించండి',
    mapHelpText: 'క్షేత్ర వివరాలు & సేవల కోసం కాంతివంతమైన 3D మార్కర్‌ను క్లిక్ చేయండి',
    verifiedDevasthanam: 'ప్రామాణీకరించబడిన దేవస్థానం',
    btnViewShrine: 'క్షేత్రాన్ని చూడండి',
    btnDonateNow: 'ఇప్పుడే దానం చేయండి',

    // Arya Vysya Heritage Section
    heritageBadge: 'ఆర్య వైశ్య వైభవం & సాంప్రదాయం',
    heritageTitle: 'ధర్మం, పవిత్ర విలువలు మరియు సమాజ ఐక్యతను కాపాడటం',
    heritageDesc: 'అహింస, సత్యం మరియు ఆత్మత్యాగం ద్వారా శ్రీ వాసవీ కన్యకా పరమేశ్వరి అమ్మవారి దివ్య మార్గాన్ని అనుసరించండి.',
    heritageCard1Title: 'పవిత్ర అహింస & సత్యం',
    heritageCard1Desc: 'శ్రీ వాసవీ అమ్మవారు అందించిన సత్యం, శాంతి మరియు అహింసల దివ్య సూత్రాల బాటలో పయనించడం.',
    heritageCard2Title: 'పెనుగొండ పవిత్ర పీఠం',
    heritageCard2Desc: 'శ్రీ వాసవీ మాత జన్మభూమి మరియు నిత్య దివ్య ధామం, ప్రపంచవ్యాప్త వైశ్య భక్తులను ఐక్యపరుస్తుంది.',
    heritageCard3Title: '102 గోత్రాల మహోన్నత వారసత్వం',
    heritageCard3Desc: 'ధర్మ రక్షణ కోసం ఆత్మత్యాగం చేసిన 102 పవిత్ర ఆర్య వైశ్య గోత్రాల త్యాగాన్ని స్మరించుకోవడం.',

    // Autopay Page
    autopayBadge: 'ఆటోమేటెడ్ నెలవారీ సేవ (UPI ఆటోపే / E-NACH)',
    autopayTitle: 'నిత్య అన్నదానం & మఠం సేవ నెలవారీ చందా',
    autopaySubtitle: 'పెనుగొండ శ్రీ వాసవీ మాతకు శ్రమలేని నెలవారీ సేవలను 100% పన్ను మినహాయింపుతో ప్రారంభించండి.',
    autopaySelectPlan: 'నెలవారీ సేవ కానుకను ఎంచుకోండి (₹/నెలకు)',
    autopayBtnSubscribe: '🙏 నెలవారీ ఆటోపే సేవను ప్రారంభించండి',
    autopaySuccessMsg: 'నెలవారీ ఆటోపే సేవ విజయవంతంగా ప్రారంభించబడింది!',

    // Footer
    footerDesc: 'శ్రీ వాసవీ కన్యకా పరమేశ్వరి మఠం, పెనుగొండ అధికారిక డిజిటల్ భక్తి వేదిక.',
    footerQuickLinks: 'ముఖ్యమైన లింకులు',
    footerLegal: 'చట్టపరమైన & పన్ను మినహాయింపులు',
    footerRights: 'అన్ని హక్కులు ప్రత్యేకించబడ్డాయి. శ్రీ వాసవీ కన్యకా పరమేశ్వరి మఠం ట్రస్ట్, పెనుగొండ.',
  },
};
