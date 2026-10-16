import { Listing } from '../types';

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: "init_nlr_sangam_00",
    sellerId: "seed_seller_sangam",
    sellerName: "సురేంద్ర నాథ్ రెడ్డి (Surendra Reddy)",
    sellerPhone: "9848123987",
    category: "cereals",
    subcategory: "paddy",
    title: "సంగం BPT 5204 సోనా మసూరి వరి ధాన్యం (Sangam BPT Paddy)",
    description: "నెల్లూరు జిల్లా సంగం మండలం చెన్నవరప్పాడు గ్రామంలో మా పొలంలో పండిన మేలిరకం BPT 5204 (సాంబ మసూరి) వరి ధాన్యం. మంచి పొడి ధాన్యం, మిల్లింగ్ రికవరీ బాగుంటుంది. హోల్‌సేల్ వ్యాపారులకు మరియు రైస్ మిల్లులకు నేరుగా లారీ లోడ్ ఇవ్వబడును.",
    price: 2450,
    negotiable: true,
    quantity: "150 బస్తాలు (క్వింటాళ్ళు)",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=1200&q=80"
    ],
    district: "Nellore (SPSR Nellore)",
    mandal: "Sangam",
    village: "Chennavarappadu",
    status: "active",
    featured: true,
    customFields: {
      variety: "BPT 5204 (సోనా మసూరి)",
      quantityAvailable: "150 బస్తాలు",
      qualityGrade: "grade_a",
      organic: "no"
    },
    createdAt: new Date().toISOString(),
    viewsCount: 210,
    callsCount: 35,
    whatsappCount: 18
  },
  {
    id: "init_nlr_kovur_00",
    sellerId: "seed_seller_kovur",
    sellerName: "రాఘవయ్య చౌదరి (Raghavaiah)",
    sellerPhone: "9440332211",
    category: "livestock",
    subcategory: "buffalo",
    title: "కోవూరు పడుగుపాడు ముర్రా పాడి గేదె (Kovur Padugupadu Murrah Buffalo)",
    description: "కోవూరు మండలం పడుగుపాడులో రెండవ ఈత పాడి గేదె. రోజుకు ఉదయం-సాయంత్రం కలిపి 11 లీటర్ల చిక్కటి పాలు ఇస్తుంది. చాలా సాధు జంతువు, ఆరోగ్యం బాగుంది. దూడతో సహా ఇవ్వబడును.",
    price: 88000,
    negotiable: true,
    quantity: "1 గేదె + ఆడ దూడ",
    images: [
      "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=80"
    ],
    district: "Nellore (SPSR Nellore)",
    mandal: "Kovur",
    village: "Padugupadu",
    status: "active",
    featured: true,
    customFields: {
      breed: "ముర్రా హైబ్రిడ్ (Murrah)",
      age: "4.5 సంవత్సరాలు",
      milkYield: "11 లీటర్లు / రోజుకు",
      gender: "female",
      health: "healthy_vaccinated"
    },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    viewsCount: 180,
    callsCount: 26,
    whatsappCount: 14
  },
  {
    id: "init_nlr_sheep_01",
    sellerId: "seed_seller_01",
    sellerName: "వెంకటేశ్వర్లు రెడ్డి (Venkateswarlu)",
    sellerPhone: "9849234567",
    category: "livestock",
    subcategory: "sheep",
    title: "నెల్లూరు జోడిపి మేలిజాతి పొట్టేళ్లు (Nellore Jodipi Sheep)",
    description: "మంచి నెల్లూరు జోడిపి జాతి పొట్టేళ్లు 12 సంఖ్య కలవు. సగటు బరువు 35-40 కేజీలు. సంక్రాంతి & పండుగలకు వ్యాపారులకు లేదా పెంచుకోవడానికి అత్యుత్తమం. అన్ని రకాల టీకాలు వేయబడ్డాయి. నేరుగా మా పొలంలో చూడవచ్చు.",
    price: 18500,
    negotiable: true,
    quantity: "12 పొట్టేళ్లు",
    images: [
      "https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=80"
    ],
    district: "Nellore (SPSR Nellore)",
    mandal: "Kavali",
    village: "Chennuru",
    status: "active",
    featured: true,
    customFields: {
      breed: "నెల్లూరు జోడిపి (Nellore Jodipi)",
      age: "1.5 సంవత్సరాలు",
      weight: 38,
      gender: "male",
      health: "healthy_vaccinated"
    },
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    viewsCount: 142,
    callsCount: 19,
    whatsappCount: 12
  },
  {
    id: "init_ogl_bull_02",
    sellerId: "seed_seller_02",
    sellerName: "రామారావు చౌదరి (Rama Rao)",
    sellerPhone: "9440187654",
    category: "livestock",
    subcategory: "cows_bulls",
    title: "ఒంగోలు మేలుజాతి గిత్తలు / కోడె దూడలు (Pure Ongole Bulls)",
    description: "స్వచ్ఛమైన ఒంగోలు జాతి కోడె గిత్తలు. ఎత్తయిన మూపురం, మంచి నడక, వ్యవసాయ పనులకు మరియు బ్రీడింగ్ కోసం చాలా అనువైనవి. ఆరోగ్యంగా ఉన్నవి.",
    price: 78000,
    negotiable: true,
    quantity: "1 జత (2 Bulls)",
    images: [
      "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=1200&q=80"
    ],
    district: "Ongole (Prakasam)",
    mandal: "Chimakurthy",
    village: "Ramateertham",
    status: "active",
    featured: true,
    customFields: {
      breed: "స్వచ్ఛమైన ఒంగోలు (Ongole)",
      age: "2.5 సంవత్సరాలు",
      weight: 380,
      gender: "pair",
      health: "healthy"
    },
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    viewsCount: 230,
    callsCount: 28,
    whatsappCount: 15
  },
  {
    id: "init_ctr_tomato_03",
    sellerId: "seed_seller_03",
    sellerName: "శంకర్ నాయుడు (Shankar Naidu)",
    sellerPhone: "9989345123",
    category: "vegetables",
    subcategory: "tomato",
    title: "మదనపల్లె హైబ్రిడ్ నాణ్యమైన టమోటా (Fresh Madanapalle Tomatoes)",
    description: "మదనపల్లె మార్కెట్ నాణ్యత కలిగిన సాహో వెరైటీ టమోటా క్రేట్లు. రోజూ 60 క్రేట్లు కోత కోస్తున్నాము. హైదరాబాద్, చెన్నై హోల్‌సేల్ వ్యాపారులకు నేరుగా లారీ లోడ్ ఇవ్వబడును.",
    price: 450,
    negotiable: true,
    quantity: "60 Crates (బాక్సులు)",
    images: [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546470427-e26264be0b11?auto=format&fit=crop&w=1200&q=80"
    ],
    district: "Chittoor",
    mandal: "Palamaner",
    village: "Moram",
    status: "active",
    featured: false,
    customFields: {
      dailyQuantity: "60 Crates (1500 Kg)",
      freshness: "fresh_today"
    },
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    viewsCount: 88,
    callsCount: 14,
    whatsappCount: 9
  },
  {
    id: "init_atp_groundnut_04",
    sellerId: "seed_seller_04",
    sellerName: "లక్ష్మీనారాయణ (Laxminarayana)",
    sellerPhone: "9701456789",
    category: "oilseeds",
    subcategory: "groundnut",
    title: "కదిరి లేపాక్షి K-6 వేరుశనగ కాయలు (Kadiri Lepakshi K6 Groundnut)",
    description: "అనంతపురం కరువును తట్టుకుని పండిన నాణ్యమైన K-6 లేపాక్షి వేరుశనగ కాయలు. గింజ పరిమాణం బాగుంది, నూనె శాతం ఎక్కువ. విత్తనాలకు లేదా మిల్లులకు అనుకూలం.",
    price: 7400,
    negotiable: false,
    quantity: "80 క్వింటాళ్లు",
    images: [
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=1200&q=80"
    ],
    district: "Anantapur (Ananthapuramu)",
    mandal: "Tadipatri",
    village: "Sajjaladinne",
    status: "active",
    featured: true,
    customFields: {
      variety: "కదిరి లేపాక్షి K-6",
      podOrSeed: "raw_pod"
    },
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    viewsCount: 165,
    callsCount: 22,
    whatsappCount: 11
  },
  {
    id: "init_bpt_tractor_05",
    sellerId: "seed_seller_05",
    sellerName: "శ్రీనివాస రావు (Srinivasa Rao)",
    sellerPhone: "9618239012",
    category: "machinery",
    subcategory: "tractors",
    title: "మహీంద్రా 575 DI ట్రాక్టర్ & రోటవేటర్ అద్దెకు (Mahindra 575 DI Rental)",
    description: "బాపట్ల మరియు చీరాల పరిసర ప్రాంతాల్లో పొలం దుక్కులు, రొట్టవేటర్, కల్టివేటర్ మరియు కేజ్ వీల్ పనులకు గంటల చొప్పున అద్దెకు ఇవ్వబడును. అనుభవజ్ఞుడైన డ్రైవర్ కలడు.",
    price: 900,
    negotiable: true,
    quantity: "గంటకు ₹900",
    images: [
      "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1200&q=80"
    ],
    district: "Bapatla",
    mandal: "Bapatla",
    village: "Appikatla",
    status: "active",
    featured: false,
    customFields: {
      machineModel: "Mahindra 575 DI - 45 HP",
      rentalOrSale: "rent_per_hour",
      driverIncluded: "yes"
    },
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    viewsCount: 112,
    callsCount: 15,
    whatsappCount: 7
  },
  {
    id: "init_kdp_orange_06",
    sellerId: "seed_seller_06",
    sellerName: "సుబ్బారెడ్డి (Subbareddy)",
    sellerPhone: "9848567890",
    category: "fruits",
    subcategory: "citrus",
    title: "పులివెందుల తీపి బత్తాయి తోట (Pulivendula Sweet Citrus Orchard)",
    description: "5 ఎకరాల విస్తీర్ణంలో ఉన్న బత్తాయి తోట కాపు వేలం లేదా టన్నుల చొప్పున విక్రయించబడును. కాయ నాణ్యమైన సైజు, రంగు మరియు తియ్యటి రసంతో ఉన్నది.",
    price: 36000,
    negotiable: true,
    quantity: "టన్నుకు ₹36,000",
    images: [
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=1200&q=80"
    ],
    district: "Kadapa (YSR District)",
    mandal: "Pulivendula",
    village: "Brahmanapalle",
    status: "active",
    featured: true,
    customFields: {
      variety: "తీపి బత్తాయి (Sweet Orange)",
      orchardOrBulk: "tonnage"
    },
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    viewsCount: 198,
    callsCount: 31,
    whatsappCount: 20
  },
  {
    id: "init_tpt_land_07",
    sellerId: "seed_seller_07",
    sellerName: "మురళీ కృష్ణ (Murali Krishna)",
    sellerPhone: "9441238901",
    category: "land",
    subcategory: "agri_land_sale",
    title: "తిరుపతి దగ్గర 4 ఎకరాల వ్యవసాయ భూమి (Agri Land with Borewell)",
    description: "తిరుపతి - చంద్రగిరి మార్గంలో 4 ఎకరాల సారవంతమైన ఎర్ర నేల. నిరంతర నీరు ఉండే 3 అంగుళాల బోరుబావి, రైతు ఉచిత విద్యుత్ కనెక్షన్, ఫెన్సింగ్ మరియు తారు రోడ్డు సౌకర్యం కలదు. 1B పట్టాదారు పాస్ పుస్తకం కలదు.",
    price: 3200000,
    negotiable: true,
    quantity: "ఎకరానికి ₹32 లక్షలు",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1200&q=80"
    ],
    district: "Tirupati",
    mandal: "Chandragiri",
    village: "Narasingapuram",
    status: "active",
    featured: true,
    customFields: {
      landExtent: "4 ఎకరాలు 10 సెంట్లు",
      waterFacility: "borewell",
      soilType: "red_soil",
      clearTitle: "yes"
    },
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    viewsCount: 380,
    callsCount: 42,
    whatsappCount: 26
  },
  {
    id: "init_nlr_shrimp_08",
    sellerId: "seed_seller_08",
    sellerName: "ప్రసాద్ బాబు (Prasad Babu)",
    sellerPhone: "9866123456",
    category: "aqua",
    subcategory: "shrimp",
    title: "కృష్ణపట్నం వెన్నామి రొయ్యలు (Vannamei Fresh Harvest)",
    description: "30-కౌంట్ వెన్నామి రొయ్యల పట్టుబడి రేపు ఉదయం మొదలవుతుంది. నాణ్యమైన కవచం, తెల్ల రంగు, ఎగుమతి నాణ్యత. ప్రాసెసింగ్ ప్లాంట్లు మరియు ఎగుమతిదారులకు సిద్ధంగా ఉంది.",
    price: 410,
    negotiable: true,
    quantity: "5 టన్నులు (5000 Kg)",
    images: [
      "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80"
    ],
    district: "Nellore (SPSR Nellore)",
    mandal: "Muthukur",
    village: "Krishnapatnam",
    status: "active",
    featured: false,
    customFields: {
      countPerKg: "30 Count",
      pondType: "brackish",
      harvestReadiness: "ready"
    },
    createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    viewsCount: 95,
    callsCount: 16,
    whatsappCount: 10
  }
];
