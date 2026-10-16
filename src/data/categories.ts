export interface CustomFieldDef {
  id: string;
  labelEn: string;
  labelTe: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  options?: { value: string; labelEn: string; labelTe: string }[];
  placeholderEn?: string;
  placeholderTe?: string;
  required?: boolean;
}

export interface SubCategory {
  id: string;
  nameEn: string;
  nameTe: string;
}

export interface CategoryDef {
  id: string;
  nameEn: string;
  nameTe: string;
  icon: string;
  color: string;
  subcategories: SubCategory[];
  customFields: CustomFieldDef[];
}

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  {
    id: "livestock",
    nameEn: "Livestock",
    nameTe: "పశువులు & పెంపుడు జీవులు",
    icon: "Beef",
    color: "amber",
    subcategories: [
      { id: "sheep", nameEn: "Sheep", nameTe: "గొర్రెలు (పొట్టేళ్లు)" },
      { id: "goats", nameEn: "Goats", nameTe: "మేకలు" },
      { id: "buffalo", nameEn: "Buffalo", nameTe: "గేదెలు / ఎనుములు" },
      { id: "cows_bulls", nameEn: "Cows & Bulls", nameTe: "ఆవులు & ఎద్దులు" },
      { id: "poultry", nameEn: "Country Chicken & Poultry", nameTe: "నాటు కోళ్లు & పౌల్ట్రీ" },
      { id: "eggs", nameEn: "Eggs", nameTe: "నాటు గుడ్లు & లేయర్ గుడ్లు" }
    ],
    customFields: [
      {
        id: "breed",
        labelEn: "Breed / జాతి",
        labelTe: "జాతి (ఉదా: ఒంగోలు, ముర్రా, నెల్లూరు జాతి)",
        type: "text",
        placeholderEn: "e.g. Ongole, Murrah, Nellore Brown, Desi",
        placeholderTe: "ఉదా: ఒంగోలు జాతి, ముర్రా, నెల్లూరు పొట్టేలు",
        required: true
      },
      {
        id: "age",
        labelEn: "Age (వయస్సు)",
        labelTe: "వయస్సు (నెల్ల లేదా సంవత్సరాలు)",
        type: "text",
        placeholderEn: "e.g. 2 Years / 8 Months",
        placeholderTe: "ఉదా: 2 సంవత్సరాలు లేదా 8 నెలలు"
      },
      {
        id: "weight",
        labelEn: "Approx Weight (Kg)",
        labelTe: "అంచనా బరువు (కిలోలు)",
        type: "number",
        placeholderEn: "e.g. 35",
        placeholderTe: "ఉదా: 35 కేజీలు"
      },
      {
        id: "gender",
        labelEn: "Gender (లింగం)",
        labelTe: "లింగం",
        type: "select",
        options: [
          { value: "male", labelEn: "Male (మగ)", labelTe: "మగ" },
          { value: "female", labelEn: "Female (ఆడ)", labelTe: "ఆడ" },
          { value: "pair", labelEn: "Pair (జత)", labelTe: "జత" },
          { value: "flock", labelEn: "Flock / Herd (మంద)", labelTe: "మంద (ఎక్కువ సంఖ్య)" }
        ]
      },
      {
        id: "milkYield",
        labelEn: "Milk Yield (Liters/Day)",
        labelTe: "పాల దిగుబడి (రోజుకు లీటర్లు - వర్తిస్తే)",
        type: "text",
        placeholderEn: "e.g. 8 - 10 Liters/day",
        placeholderTe: "ఉదా: రోజుకు 8-10 లీటర్లు"
      },
      {
        id: "health",
        labelEn: "Health / Vaccination Status",
        labelTe: "ఆరోగ్య పరిస్థితి & టీకాలు",
        type: "select",
        options: [
          { value: "healthy_vaccinated", labelEn: "Healthy & Fully Vaccinated", labelTe: "ఆరోగ్యంగా ఉంది, టీకాలు వేశారు" },
          { value: "healthy", labelEn: "Healthy & Active", labelTe: "చాలా చురుగ్గా మరియు ఆరోగ్యంగా ఉంది" },
          { value: "pregnant", labelEn: "Pregnant / గర్భంతో ఉంది", labelTe: "గర్భంతో ఉంది (చూడి)" }
        ]
      }
    ]
  },
  {
    id: "aqua",
    nameEn: "Aqua Culture",
    nameTe: "ఆక్వా కల్చర్",
    icon: "Fish",
    color: "cyan",
    subcategories: [
      { id: "fish", nameEn: "Fish (Freshwater / Sea)", nameTe: "చేపలు (కట్ల, రోహు, పండుగప్ప)" },
      { id: "shrimp", nameEn: "Shrimp / Prawn (Vannamei/Tiger)", nameTe: "రొయ్యలు (వెన్నామి / టైగర్)" },
      { id: "fish_seed", nameEn: "Fish & Shrimp Seed", nameTe: "చేప పిల్లలు / రొయ్య పిల్లలు (సీడ్)" },
      { id: "aqua_feed", nameEn: "Aqua Feed & Supplements", nameTe: "ఆక్వా ఫీడ్ & మందులు" }
    ],
    customFields: [
      {
        id: "countPerKg",
        labelEn: "Count / Size (per Kg)",
        labelTe: "కౌంట్ / పరిమాణం (కేజీకి ఎన్ని)",
        type: "text",
        placeholderEn: "e.g. 30-40 count or 1.5kg fish",
        placeholderTe: "ఉదా: 30-40 కౌంట్ లేదా 1.5 కేజీ చేప"
      },
      {
        id: "pondType",
        labelEn: "Water Type (నీటి రకం)",
        labelTe: "సాగు నీటి రకం",
        type: "select",
        options: [
          { value: "freshwater", labelEn: "Fresh Water (మంచినీరు)", labelTe: "మంచినీరు" },
          { value: "brackish", labelEn: "Brackish / Saline (ఉప్పునీరు)", labelTe: "ఉప్పునీరు / తీరప్రాంతం" }
        ]
      },
      {
        id: "harvestReadiness",
        labelEn: "Harvest Status",
        labelTe: "పట్టుబడి పరిస్థితి",
        type: "select",
        options: [
          { value: "ready", labelEn: "Ready to harvest now", labelTe: "ఇప్పుడే పట్టుబడికి సిద్ధం" },
          { value: "within_10_days", labelEn: "Within 10 days", labelTe: "10 రోజుల్లో పట్టుబడి" },
          { value: "seed_available", labelEn: "Seed ready for booking", labelTe: "సీడ్ బుకింగ్ సిద్ధం" }
        ]
      }
    ]
  },
  {
    id: "cereals",
    nameEn: "Cereals & Millets",
    nameTe: "ధాన్యాలు & చిరుధాన్యాలు",
    icon: "Wheat",
    color: "yellow",
    subcategories: [
      { id: "paddy", nameEn: "Paddy & Rice", nameTe: "వరి ధాన్యం & బియ్యం" },
      { id: "maize", nameEn: "Maize / Corn", nameTe: "మొక్కజొన్న" },
      { id: "jowar", nameEn: "Jowar (Sorghum)", nameTe: "తెల్ల / పచ్చ జొన్నలు" },
      { id: "bajra", nameEn: "Bajra (Pearl Millet)", nameTe: "సజ్జలు" },
      { id: "ragi", nameEn: "Ragi (Finger Millet)", nameTe: "రాగులు (చోళ్లు)" }
    ],
    customFields: [
      {
        id: "variety",
        labelEn: "Variety / రకం",
        labelTe: "రకం / వెరైటీ (ఉదా: BPT 5204, RNR 15048, సోనా మసూరి)",
        type: "text",
        placeholderEn: "e.g. BPT 5204, RNR, MTU 1010, Sona Masoori",
        placeholderTe: "ఉదా: బి.పి.టి 5204, ఆర్.ఎన్.ఆర్, సోనా మసూరి",
        required: true
      },
      {
        id: "quantityAvailable",
        labelEn: "Quantity (క్వింటాళ్ళు / బస్తాలు)",
        labelTe: "మొత్తం పరిమాణం (క్వింటాళ్లు / బస్తాలు / టన్నులు)",
        type: "text",
        placeholderEn: "e.g. 50 Quintals / 100 Bags",
        placeholderTe: "ఉదా: 50 క్వింటాళ్లు / 100 బస్తాలు",
        required: true
      },
      {
        id: "organic",
        labelEn: "Organic (సేంద్రీయ పద్ధతి)",
        labelTe: "సేంద్రీయ పద్ధతిలో పండించినదా?",
        type: "select",
        options: [
          { value: "no", labelEn: "Standard Farming (సాధారణ సాగు)", labelTe: "సాధారణ సాగు" },
          { value: "yes", labelEn: "100% Organic (సేంద్రీయం / ప్రకృతి వ్యవసాయం)", labelTe: "100% సేంద్రీయం / జీవామృతం" }
        ]
      },
      {
        id: "qualityGrade",
        labelEn: "Quality Grade (నాణ్యత)",
        labelTe: "ధాన్యం నాణ్యత గ్రేడ్",
        type: "select",
        options: [
          { value: "grade_a", labelEn: "Grade A (Super Clean & Dry)", labelTe: "గ్రేడ్ A (మంచి పొడి & శుభ్రమైనది)" },
          { value: "grade_b", labelEn: "Grade B (Fair Average Quality)", labelTe: "గ్రేడ్ B (మధ్యమ రకం)" }
        ]
      }
    ]
  },
  {
    id: "pulses",
    nameEn: "Pulses",
    nameTe: "పప్పు ధాన్యాలు",
    icon: "CircleDot",
    color: "emerald",
    subcategories: [
      { id: "red_gram", nameEn: "Red Gram (Toor Dal)", nameTe: "కందులు (కందిపప్పు)" },
      { id: "black_gram", nameEn: "Black Gram (Urad Dal)", nameTe: "మినుములు (మినపపప్పు)" },
      { id: "green_gram", nameEn: "Green Gram (Moong Dal)", nameTe: "పెసలు (పెసరపప్పు)" },
      { id: "bengal_gram", nameEn: "Bengal Gram (Chana)", nameTe: "శనగలు (పచ్చి శనగలు)" }
    ],
    customFields: [
      {
        id: "variety",
        labelEn: "Variety",
        labelTe: "రకం (ఉదా: దేశీ కందులు, LBG మినుములు)",
        type: "text",
        placeholderEn: "e.g. Desi, LBG, Asha",
        placeholderTe: "ఉదా: దేశీ, ఎల్.బి.జి"
      },
      {
        id: "quantityAvailable",
        labelEn: "Quantity (Quintals)",
        labelTe: "పరిమాణం (క్వింటాళ్లలో)",
        type: "text",
        placeholderEn: "e.g. 20 Quintals",
        placeholderTe: "ఉదా: 20 క్వింటాళ్లు"
      },
      {
        id: "processing",
        labelEn: "Condition",
        labelTe: "పరిస్థితి",
        type: "select",
        options: [
          { value: "raw_crop", labelEn: "Raw Crop (నేరుగా కల్లం నుంచి)", labelTe: "నేరుగా కల్లం నుంచి" },
          { value: "cleaned_graded", labelEn: "Cleaned & Graded (శుభ్రం చేసినది)", labelTe: "శుభ్రం చేసి గ్రేడింగ్ చేసినది" },
          { value: "dal_milled", labelEn: "Milled Dal (మిల్లు పప్పు)", labelTe: "మిల్లు పప్పు సిద్ధం" }
        ]
      }
    ]
  },
  {
    id: "oilseeds",
    nameEn: "Oilseeds",
    nameTe: "నూనె గింజలు",
    icon: "Droplets",
    color: "orange",
    subcategories: [
      { id: "groundnut", nameEn: "Groundnut (Peanut)", nameTe: "వేరుశనగ (వేరుసెనగ కాయలు / పప్పు)" },
      { id: "sesame", nameEn: "Sesame (Gingelly)", nameTe: "నువ్వులు (తెల్ల / నల్ల)" },
      { id: "sunflower", nameEn: "Sunflower", nameTe: "పొద్దుతిరుగుడు" },
      { id: "castor", nameEn: "Castor", nameTe: "ఆముదం" },
      { id: "oil_palm", nameEn: "Oil Palm", nameTe: "ఆయిల్ పామ్ గెలలు" }
    ],
    customFields: [
      {
        id: "variety",
        labelEn: "Variety",
        labelTe: "రకం (ఉదా: కదిరి లేపాక్షి K6, ధరణి, TAG)",
        type: "text",
        placeholderEn: "e.g. K6 Lepakshi, Dharani, TAG-24",
        placeholderTe: "ఉదా: కదిరి-6, ధరణి"
      },
      {
        id: "podOrSeed",
        labelEn: "Form (రూపం)",
        labelTe: "విక్రయ రూపం",
        type: "select",
        options: [
          { value: "raw_pod", labelEn: "Raw Pods with shell (కాయలు)", labelTe: "కాయలతో సహా" },
          { value: "kernel", labelEn: "Kernels / Seeds (పప్పు / గింజలు)", labelTe: "పప్పు / గింజలు" }
        ]
      }
    ]
  },
  {
    id: "commercial_crops",
    nameEn: "Commercial Crops",
    nameTe: "వాణిజ్య పంటలు",
    icon: "Flame",
    color: "red",
    subcategories: [
      { id: "chilli", nameEn: "Chilli (Red Mirchi)", nameTe: "ఎండిన మిర్చి (గుంటూరు / తేజ)" },
      { id: "cotton", nameEn: "Cotton (Kapas)", nameTe: "పత్తి" },
      { id: "tobacco", nameEn: "Tobacco", nameTe: "పొగాకు (బ్యారన్)" },
      { id: "sugarcane", nameEn: "Sugarcane", nameTe: "చెరకు" },
      { id: "turmeric", nameEn: "Turmeric", nameTe: "పసుపు కొమ్ములు / దుంపలు" },
      { id: "cashew", nameEn: "Cashew (Raw nuts)", nameTe: "జీడిపిక్కలు (ముడి జీడి)" },
      { id: "coconut", nameEn: "Coconut & Copra", nameTe: "కొబ్బరికాయలు & కొబ్బరి కురిడీ" },
      { id: "cocoa", nameEn: "Cocoa", nameTe: "కోకో గింజలు" }
    ],
    customFields: [
      {
        id: "variety",
        labelEn: "Variety / Grade",
        labelTe: "రకం (ఉదా: తేజ, 334, సన్నం, DD, అర్మూర్)",
        type: "text",
        placeholderEn: "e.g. Teja, Byadgi, 334 Sannam, Armoor",
        placeholderTe: "ఉదా: తేజ మిర్చి, 334 సన్నం, సువర్ణ",
        required: true
      },
      {
        id: "colorGrade",
        labelEn: "Color / Quality Rating",
        labelTe: "రంగు & నాణ్యత",
        type: "select",
        options: [
          { value: "deluxe", labelEn: "Deluxe / Top Deep Red (డీలక్స్ / మొదటి రకం)", labelTe: "మొదటి రకం (డీలక్స్)" },
          { value: "medium", labelEn: "Medium Best (మధ్యస్థ నాణ్యత)", labelTe: "మధ్యస్థ నాణ్యత" },
          { value: "talu", labelEn: "Talu / Second Quality (తాలు / రెండవ రకం)", labelTe: "రెండవ రకం (తాలు)" }
        ]
      },
      {
        id: "quantityAvailable",
        labelEn: "Total Quantity (Tikka / Quintals / Bales)",
        labelTe: "మొత్తం నిల్వ (టిక్కాలు / క్వింటాళ్లు / బేళ్ళు)",
        type: "text",
        placeholderEn: "e.g. 50 Quintals / 20 Bales",
        placeholderTe: "ఉదా: 50 క్వింటాళ్లు లేదా 20 బేళ్ళు",
        required: true
      }
    ]
  },
  {
    id: "fruits",
    nameEn: "Fruits & Orchards",
    nameTe: "పండ్ల తోటలు & పండ్లు",
    icon: "Apple",
    color: "rose",
    subcategories: [
      { id: "mango", nameEn: "Mango (Banginapalli/Totapuri)", nameTe: "మామిడి (బంగినపల్లి, తోతాపురి)" },
      { id: "banana", nameEn: "Banana (Karpura/Chakkarakeli)", nameTe: "అరటి (కర్పూర, చక్కెరకేళి, గ్రాండ్ నైన్)" },
      { id: "citrus", nameEn: "Sweet Orange / Citrus / Lemon", nameTe: "బత్తాయి & నిమ్మకాయలు" },
      { id: "papaya", nameEn: "Papaya (Red Lady)", nameTe: "బొప్పాయి (రెడ్ లేడీ)" },
      { id: "guava", nameEn: "Guava (Taiwan Pink/L-49)", nameTe: "జామ (తైవాన్ జామ)" },
      { id: "watermelon", nameEn: "Watermelon / Muskmelon", nameTe: "పుచ్చకాయ / ఖర్బూజ" },
      { id: "pomegranate", nameEn: "Pomegranate (Bhagwa)", nameTe: "దానిమ్మ (భగ్వా)" }
    ],
    customFields: [
      {
        id: "variety",
        labelEn: "Fruit Variety",
        labelTe: "పండు రకం (ఉదా: బంగినపల్లి, రసాలు, భగ్వా)",
        type: "text",
        placeholderEn: "e.g. Banganapalli, Suvarnarekha, Red Lady",
        placeholderTe: "ఉదా: బంగినపల్లి, రసాలు, రెడ్ లేడీ"
      },
      {
        id: "orchardOrBulk",
        labelEn: "Sale Type",
        labelTe: "విక్రయ రకం",
        type: "select",
        options: [
          { value: "harvested_crates", labelEn: "Harvested in Crates/Boxes (కోసిన కాయలు)", labelTe: "కోసిన కాయలు (క్రేట్లు / బాక్సులు)" },
          { value: "full_orchard_lease", labelEn: "Full Garden/Orchard Lease (మొత్తం తోట కౌలు / వేలం)", labelTe: "మొత్తం తోట కౌలు / కాపు వేలం" },
          { value: "tonnage", labelEn: "Per Ton / Lorry Load (టన్నుల చొప్పున)", labelTe: "టన్నుల చొప్పున / లారీ లోడ్" }
        ]
      }
    ]
  },
  {
    id: "vegetables",
    nameEn: "Vegetables & Flowers",
    nameTe: "కూరగాయలు & పూలు",
    icon: "Carrot",
    color: "green",
    subcategories: [
      { id: "tomato", nameEn: "Tomato", nameTe: "టమోటా (మదనపల్లె / పలమనేరు రకాలు)" },
      { id: "onion", nameEn: "Onion", nameTe: "ఉల్లిపాయలు" },
      { id: "brinjal", nameEn: "Brinjal (Eggplant)", nameTe: "వంకాయలు (గుత్తి వంకాయ)" },
      { id: "okra", nameEn: "Okra (Bhendi)", nameTe: "బెండకాయలు" },
      { id: "green_chilli", nameEn: "Green Chilli", nameTe: "పచ్చిమిర్చి" },
      { id: "leafy_veg", nameEn: "Leafy Vegetables", nameTe: "ఆకుకూరలు (తోటకూర, పాలకూర, కొత్తిమీర)" },
      { id: "flowers", nameEn: "Flowers (Marigold/Jasmine)", nameTe: "పూలు (బంతి, మల్లె, చామంతి)" }
    ],
    customFields: [
      {
        id: "dailyQuantity",
        labelEn: "Daily / Available Quantity (Boxes/Bags)",
        labelTe: "అందుబాటులో ఉన్న బాక్సులు / బస్తాలు",
        type: "text",
        placeholderEn: "e.g. 50 Crates / 25 Kg bags",
        placeholderTe: "ఉదా: 50 క్రేట్లు లేదా 20 బస్తాలు",
        required: true
      },
      {
        id: "freshness",
        labelEn: "Harvest Time",
        labelTe: "కోత సమయం",
        type: "select",
        options: [
          { value: "fresh_today", labelEn: "Harvested Today (ఈరోజే కోసిన తాజా సరుకు)", labelTe: "ఈరోజే కోసిన తాజా సరుకు" },
          { value: "harvest_tomorrow", labelEn: "Will harvest on order (ఆర్డర్ ఇస్తే కోసి ఇస్తాం)", labelTe: "ఆర్డర్ ఇస్తే కోసి ఇస్తాం" }
        ]
      }
    ]
  },
  {
    id: "inputs",
    nameEn: "Agri Inputs",
    nameTe: "ఎరువులు, విత్తనాలు & మందులు",
    icon: "Sprout",
    color: "lime",
    subcategories: [
      { id: "fertilisers", nameEn: "Fertilisers (Urea/DAP/Complex)", nameTe: "రసాయన ఎరువులు" },
      { id: "seeds", nameEn: "Certified Seeds", nameTe: "సర్టిఫైడ్ విత్తనాలు" },
      { id: "pesticides", nameEn: "Pesticides & Bio-Pesticides", nameTe: "పురుగు మందులు & బయో మందులు" },
      { id: "organic_manure", nameEn: "Organic Manure & Vermicompost", nameTe: "పశువుల పెంట, వర్మీ కంపోస్ట్ & జీవామృతం" },
      { id: "cattle_feed", nameEn: "Cattle & Poultry Feed", nameTe: "దాణా, పశుగ్రాసం (సైలేజ్ / గడ్డి)" },
      { id: "vet_medicines", nameEn: "Veterinary Medicines & Tonics", nameTe: "పశువైద్య మందులు & టానిక్కులు" }
    ],
    customFields: [
      {
        id: "brand",
        labelEn: "Company / Brand Name",
        labelTe: "కంపెనీ / బ్రాండ్ పేరు",
        type: "text",
        placeholderEn: "e.g. IFFCO, Coromandel, Syngenta, Desi",
        placeholderTe: "ఉదా: ఇఫ్కో, కోరమాండల్, బయో"
      },
      {
        id: "billAvailable",
        labelEn: "GST Bill / License Available",
        labelTe: "జీఎస్టీ బిల్లు / లైసెన్స్ రసీదు కలదా?",
        type: "select",
        options: [
          { value: "yes", labelEn: "Yes, Official Shop Bill Provided", labelTe: "అవును, షాపు బిల్లు ఇస్తాము" },
          { value: "farmer_direct", labelEn: "Direct Farmer / Homemade Vermicompost", labelTe: "రైతు తయారుచేసిన సేంద్రీయ ఎరువు" }
        ]
      }
    ]
  },
  {
    id: "machinery",
    nameEn: "Machinery & Rentals",
    nameTe: "ట్రాక్టర్లు, యంత్రాలు & అద్దెలు",
    icon: "Tractor",
    color: "indigo",
    subcategories: [
      { id: "tractors", nameEn: "Tractors & Trolleys", nameTe: "ట్రాక్టర్లు & ట్రాలీలు" },
      { id: "tillers", nameEn: "Power Tillers & Weeders", nameTe: "పవర్ టిల్లర్లు & వీడర్లు" },
      { id: "sprayers", nameEn: "Battery / Engine Sprayers", nameTe: "స్ప్రేయర్లు & డ్రోన్ స్ప్రేయింగ్" },
      { id: "pumps", nameEn: "Motors, Submersible Pumps & Pipes", nameTe: "బోరు మోటార్లు, పంపులు & పైపులు" },
      { id: "equipment_rental", nameEn: "Harvesters & Threshers Rental", nameTe: "వరి కోత మిషన్లు & నూర్పిడి యంత్రాల అద్దె" },
      { id: "labour", nameEn: "Farm Labour Contractors", nameTe: "వ్యవసాయ కూలీల సమూహం" },
      { id: "transport", nameEn: "Transport Vehicles (Auto / Lorry)", nameTe: "వ్యవసాయ రవాణా వాహనాలు (ఆటో/లారీ)" }
    ],
    customFields: [
      {
        id: "machineModel",
        labelEn: "Make & Model (తయారీ & మోడల్)",
        labelTe: "బ్రాండ్ & మోడల్ (ఉదా: మహీంద్రా 575, జాన్ డీర్, సోనాలిక)",
        type: "text",
        placeholderEn: "e.g. Mahindra 575 DI, 2021 Model",
        placeholderTe: "ఉదా: మహీంద్రా 575 DI, 2021 మోడల్",
        required: true
      },
      {
        id: "rentalOrSale",
        labelEn: "For Rent or Sale? (అద్దెకా / అమ్మకానికా?)",
        labelTe: "అద్దెకా లేక పూర్తి అమ్మకానికా?",
        type: "select",
        options: [
          { value: "rent_per_hour", labelEn: "Rent - Per Hour (గంటకు అద్దె)", labelTe: "గంటకు అద్దె (డీజిల్ లేదా డ్రైవర్ సహా)" },
          { value: "rent_per_acre", labelEn: "Rent - Per Acre (ఎకరానికి అద్దె)", labelTe: "ఎకరానికి అద్దె" },
          { value: "sale", labelEn: "Outright Sale (పూర్తి అమ్మకం)", labelTe: "పూర్తి అమ్మకం (సెకండ్ హ్యాండ్ / కొత్తది)" }
        ]
      },
      {
        id: "driverIncluded",
        labelEn: "Driver / Operator Included?",
        labelTe: "డ్రైవర్ సౌకర్యం కలదా?",
        type: "select",
        options: [
          { value: "yes", labelEn: "Yes, experienced driver provided", labelTe: "అవును, డ్రైవర్ ఉంటారు" },
          { value: "no", labelEn: "No, machine only", labelTe: "కేవలం యంత్రం మాత్రమే" }
        ]
      }
    ]
  },
  {
    id: "land",
    nameEn: "Land & Farm Lease",
    nameTe: "వ్యవసాయ భూములు & కౌలు",
    icon: "MapPin",
    color: "emerald",
    subcategories: [
      { id: "agri_land_sale", nameEn: "Agricultural Land for Sale", nameTe: "వ్యవసాయ భూమి అమ్మకం" },
      { id: "lease_land", nameEn: "Land for Crop Lease (కౌలు భూమి)", nameTe: "పంటల కౌలు భూమి" },
      { id: "farm_sheds", nameEn: "Poultry / Dairy Farm Sheds", nameTe: "పౌల్ట్రీ / డైరీ ఫామ్ షెడ్లు & గోదాములు" }
    ],
    customFields: [
      {
        id: "landExtent",
        labelEn: "Land Extent (Acres & Cents)",
        labelTe: "భూమి విస్తీర్ణం (ఎకరాలు & సెంట్లు)",
        type: "text",
        placeholderEn: "e.g. 3 Acres 25 Cents",
        placeholderTe: "ఉదా: 3 ఎకరాలు 25 సెంట్లు",
        required: true
      },
      {
        id: "waterFacility",
        labelEn: "Water Facility (నీటి సౌకర్యం)",
        labelTe: "నీటి వసతి",
        type: "select",
        options: [
          { value: "borewell", labelEn: "Borewell with Free Agri Power (రైతు ఉచిత విద్యుత్ బోరు)", labelTe: "ఉచిత కరెంటు బోరుబావి కలదు" },
          { value: "canal", labelEn: "Canal Water (కాలువ నీరు)", labelTe: "కాలువ ఆయకట్టు నీరు" },
          { value: "rainfed", labelEn: "Rainfed / Dry Land (మెట్ట భూమి)", labelTe: "వర్షాధార మెట్ట భూమి" }
        ]
      },
      {
        id: "soilType",
        labelEn: "Soil Type (మట్టి రకం)",
        labelTe: "నేల రకం",
        type: "select",
        options: [
          { value: "black_cotton", labelEn: "Black Cotton Soil (నల్లరేగడి నేల)", labelTe: "నల్లరేగడి నేల" },
          { value: "red_soil", labelEn: "Red Soil (ఎర్ర నేల)", labelTe: "ఎర్ర నేల" },
          { value: "alluvial_sand", labelEn: "Alluvial / Sandy (ఒండ్రు / ఇసుక నేల)", labelTe: "ఒండ్రు / ఇసుక నేల" }
        ]
      },
      {
        id: "clearTitle",
        labelEn: "Clear Title / 1B Passbook",
        labelTe: "పట్టాదారు పాస్ పుస్తకం & 1B రికార్డు",
        type: "select",
        options: [
          { value: "yes", labelEn: "100% Clear Title & Digital Passbook", labelTe: "స్పష్టమైన పట్టా & డిజిటల్ పాస్ పుస్తకం" },
          { value: "lease_agreement", labelEn: "Lease on Stamp Paper", labelTe: "స్టాంప్ పేపర్‌పై ఒప్పందం" }
        ]
      }
    ]
  },
  {
    id: "other",
    nameEn: "Other Rural Needs",
    nameTe: "ఇతర అవసరాలు & సేవలు",
    icon: "PackageCheck",
    color: "slate",
    subcategories: [
      { id: "used_agri_items", nameEn: "Used Farm Items & Tools", nameTe: "పాత వ్యవసాయ పనిముట్లు & పరికరాలు" },
      { id: "household", nameEn: "Village Household Items", nameTe: "గ్రామీణ గృహోపకరణాలు & వస్తువులు" },
      { id: "services", nameEn: "Local Agricultural & Trade Services", nameTe: "గ్రామీణ సేవలు & వ్యాపారాలు" }
    ],
    customFields: [
      {
        id: "condition",
        labelEn: "Item Condition (స్థితి)",
        labelTe: "వస్తువు స్థితి",
        type: "select",
        options: [
          { value: "like_new", labelEn: "Like New / కొద్దిగా వాడినది", labelTe: "దాదాపు కొత్తది" },
          { value: "good", labelEn: "Good Working Condition (మంచి స్థితి)", labelTe: "మంచి రన్నింగ్ కండిషన్" },
          { value: "as_is", labelEn: "Used (ఉన్నది ఉన్నట్లుగా)", labelTe: "వాడిన స్థితిలో" }
        ]
      }
    ]
  }
];
