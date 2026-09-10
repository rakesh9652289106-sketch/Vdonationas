export interface GothiramItem {
  id: number;
  name: string;
  sankethanamams: string[];
  telugu?: string;
}

/**
 * 102 Gothirams and their associated Sankethanamams in exact A-Z order.
 * Strictly 1 to 102 with zero omissions or modifications.
 */
export const GOTHIRAM_DATA: GothiramItem[] = [
  {
    id: 1,
    name: "ACHAYANASA",
    sankethanamams: ["AKRAMULAKULA", "AKYAMULAKULA", "AMALAKULA", "ARKYAMULA"]
  },
  {
    id: 2,
    name: "AGASTHYASA",
    sankethanamams: ["ANUBHA GULA", "ANUBALA", "ANUBALA GULA"]
  },
  {
    id: 3,
    name: "ATHREYASA",
    sankethanamams: ["ARASAKULA", "ARISISHTAKULA", "ELISISHTAKULA", "ARISETLAKULA", "HARISISHTAKULA"]
  },
  {
    id: 4,
    name: "AUSHITHYASA",
    sankethanamams: ["YANASAKULA", "YAANASAKAKULA", "YAANASABIKULA"]
  },
  {
    id: 5,
    name: "BHARADHVAJASA",
    sankethanamams: ["BALASISHTA", "BALASESHTA", "BALISISHTA"]
  },
  {
    id: 6,
    name: "BHARGGAVASA",
    sankethanamams: ["PRUTHIVISISHTA", "PRUTHIVISRESHTA"]
  },
  {
    id: 7,
    name: "BHODHAYANASA",
    sankethanamams: ["BHUDHIKULA", "BHDHANAKULA"]
  },
  {
    id: 8,
    name: "BHOODHI MASHASA",
    sankethanamams: ["DHURVADIKULA", "DHULAASISHTAKULA", "DHURYADAKULA", "DHULASISHTAKULA", "DHULASIKULA", "DHODAKULA", "DHODILULA"]
  },
  {
    id: 9,
    name: "BRUHATHATHVASA",
    sankethanamams: ["PERUSISHTA", "BERISISHTAKULA", "BHYRUSISHTAKULA"]
  },
  {
    id: 10,
    name: "CHAKRAPANISA",
    sankethanamams: ["CHAKRAMULAKULA", "CHAKRAMULASAKULA"]
  },
  {
    id: 11,
    name: "CHAMARSHANASA",
    sankethanamams: ["BETHASHRESHTA", "BETHAKISHTA", "PATHASISHTAKULA", "PATHTHASISHTAKULA"]
  },
  {
    id: 12,
    name: "CHOWCHEYASA",
    sankethanamams: ["ILAMANCHIKULA", "YALAMANCHIKULA", "HELAMANCHIKULA"]
  },
  {
    id: 13,
    name: "CHOWNAKASA",
    sankethanamams: ["KAMALAKULA", "DHRUGASISHTA", "DHRUGASISHTAKULA", "THANATHAKULA", "CHAANAKALAKULA", "CHOWNAKA"]
  },
  {
    id: 14,
    name: "DHEVA KALKYASA",
    sankethanamams: ["USIRAKULA", "DHESISHTAKULA"]
  },
  {
    id: 15,
    name: "DHEVARATHASA",
    sankethanamams: ["HAARAASIKULA"]
  },
  {
    id: 16,
    name: "DHURVASASA",
    sankethanamams: ["THITHISA", "THITHINAKULA", "THENTHSULA", "THENTHASALA", "THETHANAKULA"]
  },
  {
    id: 17,
    name: "GANDHARPASA",
    sankethanamams: ["SARAKULA", "SEKOTLAKULA", "SEGOLLA", "SAMANAKULA", "SHRESHTA KUNDALA KULA"]
  },
  {
    id: 18,
    name: "GANVSA",
    sankethanamams: ["GARNAKULA"]
  },
  {
    id: 19,
    name: "GARKYASA",
    sankethanamams: ["PRAHEENUKULA", "PRAHEENIKULA", "PAIPIKULA"]
  },
  {
    id: 20,
    name: "GOPAKASA",
    sankethanamams: ["INJTHAPAKULA", "GOPAKULA", "KONDAKULA", "KONDAKAKULA"]
  },
  {
    id: 21,
    name: "GOUNDHEYASA",
    sankethanamams: ["KAMASISHTA"]
  },
  {
    id: 22,
    name: "GOUTHAMASA",
    sankethanamams: ["GANTHISEELA", "GANTHASEELAKULA", "GANTHASEELA", "GRANTHISEELA"]
  },
  {
    id: 23,
    name: "GRUTHSAN MATHASA",
    sankethanamams: ["ESABAKULA", "ESUBAKULA", "ESHUBAKULA", "SANNAKULA", "JANAKULA", "JYANUKULA"]
  },
  {
    id: 24,
    name: "GUTHSASA",
    sankethanamams: ["ISHVAKU KULA"]
  },
  {
    id: 25,
    name: "HARIVALGAYASA",
    sankethanamams: ["KAPATA", "KURATA", "KORATAKULA", "GORANTAKULU"]
  },
  {
    id: 26,
    name: "JABAALISA",
    sankethanamams: ["SIRISISHTAKULA", "SIRASISHTAKULA"]
  },
  {
    id: 27,
    name: "JADABARATHASA",
    sankethanamams: ["KUNDAKULA", "DHURASISHTA", "DHURASISHTAKULA"]
  },
  {
    id: 28,
    name: "JADHUKARNASA",
    sankethanamams: ["CHANDRAKULA", "CHANDRAMOOLA", "CHANDRAMASISHTA"]
  },
  {
    id: 29,
    name: "JAMBASOOTHANASA",
    sankethanamams: ["THRIMULA", "THRIMULAKULA"]
  },
  {
    id: 30,
    name: "JARATHKARASA",
    sankethanamams: ["SANTHAKULA"]
  },
  {
    id: 31,
    name: "JEEVANDHISA",
    sankethanamams: ["BURHTILASISHAKULA", "BRUMASISHTAKULA", "LRUTHTHIKULA"]
  },
  {
    id: 32,
    name: "KABEEDHASA",
    sankethanamams: ["VENKALAKULA"]
  },
  {
    id: 33,
    name: "KABILASA",
    sankethanamams: ["MANDU", "MANDHAKULA", "HASTHAKULA", "MANDAKULA"]
  },
  {
    id: 34,
    name: "KASYABASA",
    sankethanamams: ["GANAMUKU KULA"]
  },
  {
    id: 35,
    name: "KOUNDINYASA",
    sankethanamams: ["KANALOLA", "KANASRILA", "KANASRILA KULA"]
  },
  {
    id: 36,
    name: "KOUSIKASA",
    sankethanamams: ["KARAKA PALA"]
  },
  {
    id: 37,
    name: "KRUSHNASA",
    sankethanamams: ["DHANAKULA", "THANANAKULA", "THENUKULA"]
  },
  {
    id: 38,
    name: "MAANAVASA",
    sankethanamams: ["MATHYAKULA", "MANYUKULA", "MARAASAKULA", "MAANAACHAKULA"]
  },
  {
    id: 39,
    name: "MAARKANDEYASA",
    sankethanamams: ["MONUKULA", "MORUKA", "MORUSA", "MORKKALAKULA"]
  },
  {
    id: 40,
    name: "MAITHREYASA",
    sankethanamams: ["MATHTHIKULA", "MATHANAKULA", "MATHYASAKULA", "MITHUNAKULA", "MAITHRIKULA"]
  },
  {
    id: 41,
    name: "MANTHAPALASA",
    sankethanamams: ["VINNASA", "VINNAKULA", "VINUKULA", "VENNAKULA"]
  },
  {
    id: 42,
    name: "MAREECHASA",
    sankethanamams: ["THISHAMASISHTAKULA", "THEESHMAKULA", "THEESHMASISHTAKULA", "THEESHMASHRESHTA"]
  },
  {
    id: 43,
    name: "MOUNJAYA",
    sankethanamams: ["MUNJEEKULA", "MOUNJRISA", "MOUNJIKULA"]
  },
  {
    id: 44,
    name: "MOUTHKALYASA",
    sankethanamams: ["NAABILLA", "NAABEELAKULA", "NAABEELASAKULA", "MUNIKULA", "MOOLAKULA"]
  },
  {
    id: 45,
    name: "MUNIRAJASA",
    sankethanamams: ["PADMASISHTASA", "PADMASISHTAKULA", "PADMASHRESHTA"]
  },
  {
    id: 46,
    name: "NARADHASA",
    sankethanamams: ["PALAKAKULA", "PALAKULA"]
  },
  {
    id: 47,
    name: "NETHRA PAHTASA",
    sankethanamams: ["SANDHOKU", "SANDHOKULAKULA"]
  },
  {
    id: 48,
    name: "PAARAASARYASA",
    sankethanamams: ["KAMATHENUKULA", "PATAKASEELAKULA", "PANCHALAKULA", "PANCHALLAKULA", "PRANASEELAKULA", "PRANUSEELAKULA", "PRANA SEELA KULA", "PAMPAALLA"]
  },
  {
    id: 49,
    name: "PALLAVASA",
    sankethanamams: ["KANAPAKULA", "KANTAKULA", "KANTAASUKULA", "KANTASUUKULA", "KANTASTHULAKULA"]
  },
  {
    id: 50,
    name: "PAPREYASA",
    sankethanamams: ["SANASISHTA", "SANASISHTAKULA", "SINISHETLA"]
  },
  {
    id: 51,
    name: "PARAS PARAAYANYASA",
    sankethanamams: ["DHUVVISISHTAKULA", "POULATHATHSYA KULA", "SRIBHUMSIKULA"]
  },
  {
    id: 52,
    name: "PAVITHRA PAANISA",
    sankethanamams: ["DHAYASISHTAKULA", "DHAYAA SISHTAKULA", "DHASISHTAKULA", "THAISETTAKULA", "THESETLAKULA", "THESISHTAKULA", "THYSISHTAKULA"]
  },
  {
    id: 53,
    name: "PINGALASA",
    sankethanamams: ["AYANAKULA"]
  },
  {
    id: 54,
    name: "POULASTHYASA",
    sankethanamams: [
      "GOSEELA", "UTHAMAGOSEELA", "PALLALAGOOSEELA", "PADUGOSEELA", "SRIGOSEELA",
      "PUNAGOSEELA", "SOORYAKULA", "UTHAMASEELA", "PUNAGORSEELA", "PATTUGOSEELA",
      "PUNAKASEELAKULA", "BHEEMAGOSEELA", "SATHYAGOSEELA", "CHANDHIGOSEELA"
    ]
  },
  {
    id: 55,
    name: "POUNDRAKASA",
    sankethanamams: ["BUMSIMAMSUKULA", "BUMSIMANAKULA", "BROSISHTAKULA", "BROSI", "BROLEKAKULA"]
  },
  {
    id: 56,
    name: "PRABHADHASA",
    sankethanamams: ["UDHVAHAKULA", "PENDLIKULA", "RAVISISHTAKULA"]
  },
  {
    id: 57,
    name: "PRASEENASA",
    sankethanamams: ["VANISISHTAKULA", "LENASISHTAKULA", "LELISISHTAKULA"]
  },
  {
    id: 58,
    name: "PUNDAREEGASA",
    sankethanamams: ["ANUSISHTA", "ANUSISHTAKULA", "KRANUKULA", "THONDIKULA"]
  },
  {
    id: 59,
    name: "RUSHYASHRUNGASA",
    sankethanamams: ["ANANTHAKULA"]
  },
  {
    id: 60,
    name: "SAARGNARAVASA",
    sankethanamams: ["KUNDAKAKULA"]
  },
  {
    id: 61,
    name: "SAMVARTHAKASA",
    sankethanamams: ["RENDUKULA", "RENTAKULA"]
  },
  {
    id: 62,
    name: "SANAKASA",
    sankethanamams: ["SHANAKULA", "SANAKULA"]
  },
  {
    id: 63,
    name: "SANANTHANASA",
    sankethanamams: ["SAMASISHTAKULA"]
  },
  {
    id: 64,
    name: "SANATHKUMARASA",
    sankethanamams: ["DANKARAKULA", "MUTHUKULA"]
  },
  {
    id: 65,
    name: "SARABANKASA",
    sankethanamams: ["KRAMASISHTA", "KRAMASISHTAKULA", "KRAMASHRESHTAKULA"]
  },
  {
    id: 66,
    name: "SATHYASA",
    sankethanamams: ["ANTHIRAKULA", "CHINTHAKULA", "CHINTHAMASISHTA", "CHINTHYAKULA", "CHINTHALA"]
  },
  {
    id: 67,
    name: "SHANDILYASA",
    sankethanamams: ["THUPPALA", "THUPPALAKULA"]
  },
  {
    id: 68,
    name: "SHUKLASA",
    sankethanamams: ["SRISALAKULA", "SRISALLA", "SRISALLAKULA"]
  },
  {
    id: 69,
    name: "SOWBARNASA",
    sankethanamams: ["PUTHURUKULA", "PUTHURUKSAKULA"]
  },
  {
    id: 70,
    name: "SOWMYASA",
    sankethanamams: ["HASTHIKULA"]
  },
  {
    id: 71,
    name: "SOWVARNASA",
    sankethanamams: ["CHUSALAKULA", "SAKALLAKULA", "SOOCHALAKULA", "SOOKASALLAKULA", "SOOSALAKULA"]
  },
  {
    id: 72,
    name: "SRIDHARASA",
    sankethanamams: ["SIRISHESHTA", "SIRISHESHTAKULA", "SRishi"]
  },
  {
    id: 73,
    name: "SRIVATHSASA",
    sankethanamams: ["SILAKULA", "SRIRANGAKULA", "SRILAKULA"]
  },
  {
    id: 74,
    name: "SUBHRAMHANYASA",
    sankethanamams: ["SANTHANAKULA", "SANIKTHAKULA"]
  },
  {
    id: 75,
    name: "SUDHEESHANASA",
    sankethanamams: ["DHANTHAKULA", "DHYANTHAKULA", "DHVANTHAKULA", "DHENTHAKULA", "DHEVISETLA", "DHONTHAKULA"]
  },
  {
    id: 76,
    name: "SUKANCHANASA",
    sankethanamams: ["PUCHAKULA", "PUCHAKASEELA", "PUNITHA", "PUNEETHASA", "PUNTHAKULA"]
  },
  {
    id: 77,
    name: "SUNDHARASA",
    sankethanamams: ["INA", "INAKULA", "INAKOLA"]
  },
  {
    id: 78,
    name: "SUVARNASA",
    sankethanamams: ["PRODAYASAKULA", "PRODAJAKULA", "PROUDAAYAJA"]
  },
  {
    id: 79,
    name: "THAITHREYASA",
    sankethanamams: ["SITHURUBELLU", "SITHRUBELLU", "SITHRUBA", "SITHRUBAKULA"]
  },
  {
    id: 80,
    name: "THALPYASA",
    sankethanamams: ["PADINAKULA", "PLAKAKULA", "PALAKALAKULA", "PADANASISHTAKULA"]
  },
  {
    id: 81,
    name: "THARANISA",
    sankethanamams: ["THRIVIKRAMA", "SISHTASA", "THRIVIKRAMASISHTAKULA"]
  },
  {
    id: 82,
    name: "THITHIRISA",
    sankethanamams: ["PAMTHAKULA", "PRAHTAMAKULA", "PRAVATHAKULA"]
  },
  {
    id: 83,
    name: "THOUMYASA",
    sankethanamams: ["CHANDA", "CHANDHAKULA", "CHANDAKAKULA", "CHANKALAKULA"]
  },
  {
    id: 84,
    name: "THRIJADASA",
    sankethanamams: ["UPARAKULA", "USIRAKULA"]
  },
  {
    id: 85,
    name: "UDHGRUSHTASA",
    sankethanamams: ["KANYAKULA", "KANUKULA", "KRANU"]
  },
  {
    id: 86,
    name: "UGRASENASA",
    sankethanamams: ["KUMIRISISHTA", "KUMARSISHTA", "KOMARSISHTAKULA"]
  },
  {
    id: 87,
    name: "UTHAMOJASA",
    sankethanamams: ["UTHAKALAKULA", "UTHAKULA", "UTHASISHTAKULA", "UHTAMAKULA"]
  },
  {
    id: 88,
    name: "VADUGASA",
    sankethanamams: ["ANUMARSHANAKULA"]
  },
  {
    id: 89,
    name: "VAIROHITHYASA",
    sankethanamams: ["VASNTHA", "VASANTHAKULA"]
  },
  {
    id: 90,
    name: "VALMIKASA",
    sankethanamams: ["SUKALAKULA", "SAKALLAKULA", "SUCHALAKULA", "SUGOLLAKULA"]
  },
  {
    id: 91,
    name: "VAMADEVASA",
    sankethanamams: ["UPALAKULA", "UPAMAKULA", "UPANAKULA", "UPAMANYAKULA"]
  },
  {
    id: 92,
    name: "VARADHANTHUSA",
    sankethanamams: ["MASANTHA"]
  },
  {
    id: 93,
    name: "VARUNASA",
    sankethanamams: ["YELASISHTAKULA", "VELASISHTAKULA", "VELISISHTAKULA"]
  },
  {
    id: 94,
    name: "VASHISHTASA",
    sankethanamams: ["VASTHI", "VASTHISA", "VASTHIKULA", "VASTHRIKULA"]
  },
  {
    id: 95,
    name: "VASUDEVASA",
    sankethanamams: ["BHEEMASISHTA", "BHEEMASISHTAKULA", "BHEEMASRESHTAKULA"]
  },
  {
    id: 96,
    name: "VAYAVYAYA",
    sankethanamams: ["MRANGAMAKULA", "VRAHASISHTAKULA", "VRAKALAMULA", "VRANGAMAKULA", "VRANGAMULAKULA"]
  },
  {
    id: 97,
    name: "VISHNUVRUNTHASA",
    sankethanamams: ["PIPPALAKULA", "PUPPALAKULA"]
  },
  {
    id: 98,
    name: "VISHVAGSHENASA",
    sankethanamams: ["UBARISISHTA", "VIBARISISHTA"]
  },
  {
    id: 99,
    name: "VISVAMITHRASA",
    sankethanamams: ["VIKRAMASISHTA", "VIKRAMASISHTAKULA"]
  },
  {
    id: 100,
    name: "VYASASA",
    sankethanamams: ["THANAKU"]
  },
  {
    id: 101,
    name: "YAASKASA",
    sankethanamams: ["VYALAKOOLASA", "VELGOLLA", "VAELIGOLLA"]
  },
  {
    id: 102,
    name: "YAGNA VALKYASA",
    sankethanamams: ["ABIMANCHIKULA"]
  }
];

export interface SankethanamamEntry {
  sankethanamam: string;
  gotraId: number;
  gotraName: string;
}

/**
 * Returns all unique Sankethanamam entries across all 102 Gotras with their parent Gotram.
 */
export function getAllSankethanamamEntries(): SankethanamamEntry[] {
  const entries: SankethanamamEntry[] = [];
  for (const g of GOTHIRAM_DATA) {
    for (const s of g.sankethanamams) {
      entries.push({
        sankethanamam: s,
        gotraId: g.id,
        gotraName: g.name,
      });
    }
  }
  return entries;
}

/**
 * Find parent Gotram for a given Sankethanamam (case-insensitive)
 */
export function findGotramBySankethanamam(sankethanamam: string): GothiramItem | undefined {
  if (!sankethanamam) return undefined;
  const target = sankethanamam.trim().toUpperCase();
  return GOTHIRAM_DATA.find((g) =>
    g.sankethanamams.some((s) => s.trim().toUpperCase() === target)
  );
}

/**
 * Unified search matching Gotram names/IDs AND Sankethanamams
 */
export function searchGotramAndSankethanamam(rawQuery: string): {
  matchingGotras: GothiramItem[];
  matchingSankethanamams: SankethanamamEntry[];
} {
  const q = rawQuery.trim().toUpperCase();
  if (!q) {
    return {
      matchingGotras: GOTHIRAM_DATA,
      matchingSankethanamams: [],
    };
  }

  const matchingGotras = GOTHIRAM_DATA.filter((g) =>
    g.name.toUpperCase().includes(q) ||
    g.id.toString() === q ||
    `GOTRA ${g.id}`.includes(q) ||
    (g.telugu && g.telugu.includes(rawQuery.trim()))
  );

  const allEntries = getAllSankethanamamEntries();
  const matchingSankethanamams = allEntries.filter((e) =>
    e.sankethanamam.toUpperCase().includes(q)
  );

  return { matchingGotras, matchingSankethanamams };
}

// Attach globally for browser usage and support ES module export
if (typeof window !== 'undefined') {
  (window as any).GOTHIRAM_DATA = GOTHIRAM_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GOTHIRAM_DATA,
    getAllSankethanamamEntries,
    findGotramBySankethanamam,
    searchGotramAndSankethanamam,
  };
}
