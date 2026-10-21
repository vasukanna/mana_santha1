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
  // 1. Cereals & Grains
  {
    id: "cereals",
    nameEn: "Cereals & Grains",
    nameTe: "ధాన్యాలు & చిరుధాన్యాలు",
    icon: "Wheat",
    color: "amber",
    subcategories: [
      { id: "paddy", nameEn: "Paddy & Rice", nameTe: "వరి ధాన్యం & బియ్యం" },
      { id: "maize", nameEn: "Maize / Corn", nameTe: "మొక్కజొన్న" },
      { id: "jowar", nameEn: "Jowar (Sorghum)", nameTe: "తెల్ల / పచ్చ జొన్నలు" },
      { id: "bajra", nameEn: "Bajra (Pearl Millet)", nameTe: "సజ్జలు" },
      { id: "ragi", nameEn: "Ragi (Finger Millet)", nameTe: "రాగులు (చోళ్లు)" },
      { id: "wheat_barley", nameEn: "Wheat & Barley", nameTe: "గోధుమలు & బార్లీ" }
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

  // 2. Pulses
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
      { id: "bengal_gram", nameEn: "Bengal Gram (Chana)", nameTe: "శనగలు (పచ్చి శనగలు)" },
      { id: "horse_gram", nameEn: "Horse Gram (Ulavalu)", nameTe: "ఉలవలు" },
      { id: "cowpea", nameEn: "Cowpea (Alasandalu)", nameTe: "అలసందలు (బొబ్బర్లు)" }
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

  // 3. Oilseeds
  {
    id: "oilseeds",
    nameEn: "Oilseeds",
    nameTe: "నూనె గింజలు",
    icon: "Droplets",
    color: "yellow",
    subcategories: [
      { id: "groundnut", nameEn: "Groundnut (Peanut)", nameTe: "వేరుశనగ (కాయలు / పప్పు)" },
      { id: "sesame", nameEn: "Sesame (Gingelly)", nameTe: "నువ్వులు (తెల్ల / నల్ల)" },
      { id: "sunflower", nameEn: "Sunflower", nameTe: "పొద్దుతిరుగుడు" },
      { id: "castor", nameEn: "Castor", nameTe: "ఆముదం" },
      { id: "mustard", nameEn: "Mustard (Avalu)", nameTe: "ఆవాలు" },
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
      },
      {
        id: "quantityAvailable",
        labelEn: "Quantity (Quintals)",
        labelTe: "మొత్తం పరిమాణం (క్వింటాళ్లు)",
        type: "text",
        placeholderEn: "e.g. 50 Quintals",
        placeholderTe: "ఉదా: 50 క్వింటాళ్లు"
      }
    ]
  },

  // 4. Fruits & Vegetables
  {
    id: "fruits_vegetables",
    nameEn: "Fruits & Vegetables",
    nameTe: "పండ్లు & కూరగాయలు",
    icon: "Apple",
    color: "rose",
    subcategories: [
      { id: "tomato", nameEn: "Tomato", nameTe: "టమోటా (మదనపల్లె / పలమనేరు)" },
      { id: "onion", nameEn: "Onion", nameTe: "ఉల్లిపాయలు" },
      { id: "mango", nameEn: "Mango (Banginapalli/Totapuri)", nameTe: "మామిడి (బంగినపల్లి, తోతాపురి)" },
      { id: "banana", nameEn: "Banana (Karpura/Chakkarakeli)", nameTe: "అరటి (కర్పూర, చక్కెరకేళి)" },
      { id: "citrus", nameEn: "Sweet Orange & Lemon", nameTe: "బత్తాయి & నిమ్మకాయలు" },
      { id: "papaya", nameEn: "Papaya (Red Lady)", nameTe: "బొప్పాయి (రెడ్ లేడీ)" },
      { id: "green_chilli", nameEn: "Green Chilli", nameTe: "పచ్చిమిర్చి" },
      { id: "brinjal", nameEn: "Brinjal (Eggplant)", nameTe: "వంకాయలు (గుత్తి వంకాయ)" },
      { id: "watermelon", nameEn: "Watermelon / Melons", nameTe: "పుచ్చకాయ & ఖర్బూజ" },
      { id: "leafy_veg", nameEn: "Leafy Vegetables", nameTe: "ఆకుకూరలు (తోటకూర, పాలకూర)" },
      { id: "flowers", nameEn: "Flowers (Marigold/Jasmine)", nameTe: "పూలు (బంతి, మల్లె, చామంతి)" }
    ],
    customFields: [
      {
        id: "variety",
        labelEn: "Variety / Name",
        labelTe: "పండు / కూరగాయ రకం (ఉదా: సాహో టమోటా, బంగినపల్లి)",
        type: "text",
        placeholderEn: "e.g. Saho Tomato, Banganapalli, Red Lady",
        placeholderTe: "ఉదా: సాహో టమోటా, బంగినపల్లి మామిడి"
      },
      {
        id: "dailyQuantity",
        labelEn: "Available Quantity (Crates/Boxes/Tons)",
        labelTe: "అందుబాటులో ఉన్న బాక్సులు / క్రేట్లు / టన్నులు",
        type: "text",
        placeholderEn: "e.g. 50 Crates / 2 Tons",
        placeholderTe: "ఉదా: 50 క్రేట్లు లేదా 2 టన్నులు",
        required: true
      },
      {
        id: "freshness",
        labelEn: "Harvest Time",
        labelTe: "కోత సమయం",
        type: "select",
        options: [
          { value: "fresh_today", labelEn: "Harvested Today (ఈరోజే కోసిన తాజా సరుకు)", labelTe: "ఈరోజే కోసిన తాజా సరుకు" },
          { value: "harvest_tomorrow", labelEn: "Will harvest on order (ఆర్డర్ ఇస్తే కోసి ఇస్తాం)", labelTe: "ఆర్డర్ ఇస్తే కోసి ఇస్తాం" },
          { value: "orchard_lease", labelEn: "Full Garden/Orchard Lease (తోట కౌలు / వేలం)", labelTe: "మొత్తం తోట కౌలు / కాపు వేలం" }
        ]
      }
    ]
  },

  // 5. Commercial Crops
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

  // 6. Livestock & Poultry
  {
    id: "livestock",
    nameEn: "Livestock & Poultry",
    nameTe: "పశువులు & పౌల్ట్రీ",
    icon: "Beef",
    color: "amber",
    subcategories: [
      { id: "sheep", nameEn: "Sheep", nameTe: "గొర్రెలు (పొట్టేళ్లు)" },
      { id: "buffalo", nameEn: "Buffalo", nameTe: "గేదెలు / ఎనుములు" },
      { id: "cows_bulls", nameEn: "Cows & Bulls", nameTe: "ఆవులు & ఎద్దులు" },
      { id: "goats", nameEn: "Goats", nameTe: "మేకలు" },
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
        labelTe: "వయస్సు (నెలలు లేదా సంవత్సరాలు)",
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

  // 7. Aqua & Fisheries
  {
    id: "aqua",
    nameEn: "Aqua & Fisheries",
    nameTe: "ఆక్వా & మత్స్య సంపద",
    icon: "Fish",
    color: "cyan",
    subcategories: [
      { id: "shrimp", nameEn: "Shrimp / Prawn (Vannamei/Tiger)", nameTe: "రొయ్యలు (వెన్నామి / టైగర్)" },
      { id: "fish", nameEn: "Fish (Freshwater / Sea)", nameTe: "చేపలు (కట్ల, రోహు, పండుగప్ప)" },
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

  // 8. Agri Inputs
  {
    id: "inputs",
    nameEn: "Agri Inputs",
    nameTe: "ఎరువులు, విత్తనాలు & రసాయనాలు",
    icon: "Sprout",
    color: "lime",
    subcategories: [
      { id: "seeds", nameEn: "Certified Seeds", nameTe: "సర్టిఫైడ్ విత్తనాలు" },
      { id: "fertilisers", nameEn: "Fertilisers (Bio & Chemical)", nameTe: "రసాయన & సేంద్రీయ ఎరువులు" },
      { id: "pesticides", nameEn: "Pesticides & Bio-Pesticides", nameTe: "పురుగు మందులు & బయో మందులు" },
      { id: "organic_manure", nameEn: "Organic Manure & Vermicompost", nameTe: "పశువుల పెంట, వర్మీ కంపోస్ట్ & జీవామృతం" },
      { id: "tonics", nameEn: "Plant Growth Regulators & Tonics", nameTe: "మొక్కల బయో టానిక్కులు & పోషకాలు" }
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

  // 9. Machinery & Rentals
  {
    id: "machinery",
    nameEn: "Machinery & Rentals",
    nameTe: "యంత్రాలు, ట్రాక్టర్లు & అద్దెలు",
    icon: "Tractor",
    color: "indigo",
    subcategories: [
      { id: "tractors", nameEn: "Tractors & Trolleys", nameTe: "ట్రాక్టర్లు & ట్రాలీలు" },
      { id: "tillers", nameEn: "Power Tillers & Weeders", nameTe: "పవర్ టిల్లర్లు & వీడర్లు" },
      { id: "harvesters", nameEn: "Combine Harvesters & Threshers", nameTe: "వరి కోత మిషన్లు & నూర్పిడి యంత్రాలు" },
      { id: "sprayers", nameEn: "Battery / Engine Sprayers & Drones", nameTe: "స్ప్రేయర్లు & డ్రోన్ స్ప్రేయింగ్" },
      { id: "ploughs", nameEn: "Ploughs, Rotavators & Cultivators", nameTe: "నాగళ్లు, రొటవేటర్లు & కల్టివేటర్లు" }
    ],
    customFields: [
      {
        id: "machineModel",
        labelEn: "Make & Model (తయారీ & మోడల్)",
        labelTe: "బ్రాండ్ & మోడల్ (ఉదా: మహీంద్రా 575, జాన్ డీర్)",
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

  // 10. Irrigation & Water Solutions
  {
    id: "irrigation",
    nameEn: "Irrigation & Water Solutions",
    nameTe: "నీటిపారుదల, మోటార్లు & డ్రిప్ పరికరాలు",
    icon: "Waves",
    color: "blue",
    subcategories: [
      { id: "submersible_pumps", nameEn: "Submersible Pumps & Motors", nameTe: "బోరుబావి మోటార్లు & పంపులు" },
      { id: "drip_sprinklers", nameEn: "Drip & Sprinkler Systems", nameTe: "డ్రిప్ ఇరిగేషన్ & స్ప్రింక్లర్లు" },
      { id: "pipes_tarpaulins", nameEn: "PVC, HDPE & Tarpaulin Pipes", nameTe: "పైపులు, డెలివరీ పైపులు & టార్పాలిన్లు" },
      { id: "solar_pumps", nameEn: "Solar Agri Pumps & Panels", nameTe: "సోలార్ పంపులు & ప్యానెల్స్" },
      { id: "valves_fittings", nameEn: "Water Valves, Filters & Fittings", nameTe: "వాల్వ్‌లు, ఫిల్టర్లు & ఫిట్టింగ్‌లు" }
    ],
    customFields: [
      {
        id: "equipmentType",
        labelEn: "Equipment Type",
        labelTe: "పరికర రకం (మోటార్ / డ్రిప్ / పైపులు)",
        type: "text",
        placeholderEn: "e.g. 7.5 HP Submersible, Drip Kit for 2 Acres",
        placeholderTe: "ఉదా: 7.5 హెచ్‌పీ మోటార్, 2 ఎకరాల డ్రిప్ కిట్",
        required: true
      },
      {
        id: "motorHp",
        labelEn: "Motor Capacity (HP) - if pump",
        labelTe: "మోటార్ సామర్థ్యం (HP - పంపు అయితే)",
        type: "text",
        placeholderEn: "e.g. 5 HP, 7.5 HP, 10 HP",
        placeholderTe: "ఉదా: 5 హెచ్‌పీ, 7.5 హెచ్‌పీ"
      },
      {
        id: "brand",
        labelEn: "Brand Name",
        labelTe: "కంపెనీ పేరు (CRI, Texmo, Finolex, Netafim)",
        type: "text",
        placeholderEn: "e.g. CRI, Texmo, Kirloskar, Finolex",
        placeholderTe: "ఉదా: టెక్స్‌మో, సి.ఆర్.ఐ, ఫినోలెక్స్"
      }
    ]
  },

  // 11. Fodder & Agricultural By-products
  {
    id: "fodder",
    nameEn: "Fodder & Agricultural By-products",
    nameTe: "పశుగ్రాసం & వ్యవసాయ ఉప-ఉత్పత్తులు",
    icon: "Leaf",
    color: "emerald",
    subcategories: [
      { id: "dry_straw", nameEn: "Paddy Straw & Dry Fodder (Gaddi)", nameTe: "వరి ఎండుగడ్డి & చొప్ప (గడ్డి వాములు)" },
      { id: "green_fodder", nameEn: "Green Fodder, Napier & Silage", nameTe: "పచ్చిగడ్డి, సూపర్‌నేపియర్ & సైలేజ్" },
      { id: "cattle_feed", nameEn: "Cattle & Poultry Feed, Oil Cakes", nameTe: "చెక్కలు, తవుడు & దాణా" },
      { id: "husk_bran", nameEn: "Husk, Bran & Agro By-products", nameTe: "వరి పొట్టు, తౌడు & వేస్ట్" }
    ],
    customFields: [
      {
        id: "fodderType",
        labelEn: "Fodder / Product Type",
        labelTe: "గడ్డి / ఉప-ఉత్పత్తి రకం",
        type: "text",
        placeholderEn: "e.g. Dry Paddy Straw, Corn Silage, Cotton Seed Cake",
        placeholderTe: "ఉదా: వరి ఎండుగడ్డి, మొక్కజొన్న సైలేజ్, పత్తి చెక్క",
        required: true
      },
      {
        id: "quantityAvailable",
        labelEn: "Quantity (Tractor Loads/Bales/Tons)",
        labelTe: "పరిమాణం (ట్రాక్టర్ లోడ్లు / బేళ్ళు / టన్నులు)",
        type: "text",
        placeholderEn: "e.g. 5 Tractor Loads / 100 Bales",
        placeholderTe: "ఉదా: 3 ట్రాక్టర్ లోడ్లు లేదా 50 బేళ్ళు",
        required: true
      },
      {
        id: "deliveryAvailable",
        labelEn: "Transport / Delivery Available?",
        labelTe: "రవాణా సౌకర్యం కలదా?",
        type: "select",
        options: [
          { value: "yes", labelEn: "Yes, delivery arranged to buyer village", labelTe: "అవును, ఊరికి చేరవేస్తాము" },
          { value: "buyer_pickup", labelEn: "Buyer must arrange pickup at field", labelTe: "కొనుగోలుదారుడే వాహనం తీసుకురావాలి" }
        ]
      }
    ]
  },

  // 12. Land & Farm Lease
  {
    id: "land",
    nameEn: "Land & Farm Lease",
    nameTe: "వ్యవసాయ భూములు & కౌలు",
    icon: "MapPin",
    color: "teal",
    subcategories: [
      { id: "agri_land_sale", nameEn: "Agricultural Land for Sale", nameTe: "వ్యవసాయ భూమి అమ్మకం" },
      { id: "lease_land", nameEn: "Land for Crop Lease (కౌలు భూమి)", nameTe: "పంటల కౌలు భూమి" },
      { id: "farm_sheds", nameEn: "Poultry / Dairy Farm Sheds", nameTe: "పౌల్ట్రీ / డైరీ ఫామ్ షెడ్లు & గోదాములు" },
      { id: "orchard_lease", nameEn: "Orchard / Garden Lease (తోటల కౌలు)", nameTe: "మామిడి, బత్తాయి తోటల కౌలు & వేలం" }
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

  // 13. Spare Parts & Repairs
  {
    id: "spare_parts",
    nameEn: "Spare Parts & Repairs",
    nameTe: "స్పేర్ పార్ట్స్ & రిపేర్ సేవలు",
    icon: "Wrench",
    color: "zinc",
    subcategories: [
      { id: "tractor_spares", nameEn: "Tractor & Auto Spares", nameTe: "ట్రాక్టర్ స్పేర్ పార్ట్స్ & టైర్లు" },
      { id: "motor_rewinding", nameEn: "Motor Rewinding & Pump Spares", nameTe: "మోటార్ రీవైండింగ్ & పంపు సామాన్లు" },
      { id: "sprayer_batteries", nameEn: "Sprayer Parts & Batteries", nameTe: "స్ప్రేయర్ బ్యాటరీలు & నాజిళ్ళు" },
      { id: "blades_belts", nameEn: "Harvester & Tiller Blades & Belts", nameTe: "కోత మిషన్ బ్లేడ్లు & బెల్టులు" },
      { id: "workshop_repairs", nameEn: "Workshop & Mechanical Repairs", nameTe: "వర్క్‌షాప్ రిపేర్లు & వెల్డింగ్" }
    ],
    customFields: [
      {
        id: "compatibleMachine",
        labelEn: "Compatible Machine / Brand",
        labelTe: "ఏ యంత్రానికి ఉపయోగపడుతుంది? (ఉదా: మహీంద్రా, జాన్ డీర్, టెక్స్‌మో)",
        type: "text",
        placeholderEn: "e.g. Mahindra 575 DI, CRI 5HP Pump, Power Tiller",
        placeholderTe: "ఉదా: మహీంద్రా 575, సీఆర్ఐ పంపు, పవర్ టిల్లర్",
        required: true
      },
      {
        id: "partType",
        labelEn: "Spare Part Name / Service",
        labelTe: "స్పేర్ పార్ట్ పేరు / సర్వీస్ వివరాలు",
        type: "text",
        placeholderEn: "e.g. Clutch Plate, Submersible Bush, 12V Battery",
        placeholderTe: "ఉదా: క్లచ్ ప్లేట్, బుష్, 12V బ్యాటరీ"
      },
      {
        id: "condition",
        labelEn: "Part Condition",
        labelTe: "స్థితి",
        type: "select",
        options: [
          { value: "brand_new", labelEn: "Brand New (పూర్తిగా కొత్తది)", labelTe: "పూర్తిగా కొత్తది (కంపెనీ ప్యాక్)" },
          { value: "reconditioned", labelEn: "Reconditioned / Refurbished", labelTe: "రీకండిషన్ చేసినది (మంచి కండిషన్)" },
          { value: "repair_service", labelEn: "Repair Service (రిపేర్ సేవ)", labelTe: "సర్వీస్ / రిపేర్ చేస్తాము" }
        ]
      }
    ]
  },

  // 14. Farm Labour & Services
  {
    id: "farm_labour",
    nameEn: "Farm Labour & Services",
    nameTe: "వ్యవసాయ కూలీలు, కాంట్రాక్టర్లు & సేవలు",
    icon: "Users",
    color: "violet",
    subcategories: [
      { id: "harvest_planting_labour", nameEn: "Harvesting & Planting Labour Teams", nameTe: "వరి నాట్లు & కోతల కూలీల ముఠా" },
      { id: "agri_transport", nameEn: "Agri Transport (Auto / Lorry / Tractor)", nameTe: "వ్యవసాయ రవాణా వాహనాలు (ఆటో / లారీ)" },
      { id: "crop_advisory", nameEn: "Crop Advisory & Soil Testing", nameTe: "నేల పరీక్ష & పంట రక్షణ సలహాలు" },
      { id: "vet_services", nameEn: "Veterinary Doctors & AI Services", nameTe: "పశు వైద్య సేవలు & కృత్రిమ గర్భధారణ" }
    ],
    customFields: [
      {
        id: "serviceType",
        labelEn: "Service / Labour Specialisation",
        labelTe: "సేవ / కూలీల పని రకం (నాట్లు / కోతలు / రవాణా)",
        type: "text",
        placeholderEn: "e.g. Paddy Transplantation Gang, Lorry Load Transport",
        placeholderTe: "ఉదా: వరి నాట్ల ముఠా (15 మంది), లారీ లోడ్ రవాణా",
        required: true
      },
      {
        id: "teamSize",
        labelEn: "Team Size / Capacity",
        labelTe: "కూలీల సంఖ్య లేదా వాహన సామర్థ్యం",
        type: "text",
        placeholderEn: "e.g. 15 Persons / 10 Ton Lorry",
        placeholderTe: "ఉదా: 15 మంది కూలీలు / 10 టన్నుల లారీ"
      },
      {
        id: "dailyRate",
        labelEn: "Rate / Pricing Terms",
        labelTe: "రేటు / ధర (రోజుకు లేదా ఎకరానికి)",
        type: "text",
        placeholderEn: "e.g. ₹500 per day / ₹4,000 per acre",
        placeholderTe: "ఉదా: రోజుకు ₹500 లేదా ఎకరానికి ₹4,000"
      }
    ]
  },

  // 15. Other Rural Needs
  {
    id: "other",
    nameEn: "Other Rural Needs",
    nameTe: "ఇతర గ్రామీణ అవసరాలు & వస్తువులు",
    icon: "PackageCheck",
    color: "slate",
    subcategories: [
      { id: "used_agri_items", nameEn: "Used Farm Tools & Implements", nameTe: "పాత వ్యవసాయ పనిముట్లు & పరికరాలు" },
      { id: "household", nameEn: "Village Household & Solar Items", nameTe: "గ్రామీణ గృహోపకరణాలు & సోలార్ లైట్లు" },
      { id: "handicrafts", nameEn: "Rural Handicrafts & Trade", nameTe: "చేతివృత్తులు, బుట్టలు & చేనేత" }
    ],
    customFields: [
      {
        id: "itemCategory",
        labelEn: "Item / Service Details",
        labelTe: "వస్తువు లేదా సేవ వివరాలు",
        type: "text",
        placeholderEn: "e.g. Used Diesel Engine, Solar Home Light",
        placeholderTe: "ఉదా: డీజిల్ ఇంజిన్, సోలార్ లైట్",
        required: true
      },
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
