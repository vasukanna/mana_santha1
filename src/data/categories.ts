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
  bgColor?: string;
  subcategories: SubCategory[];
}

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  // 1. Cereals & Grains
  {
    id: "cereals_grains",
    nameEn: "Cereals & Grains",
    nameTe: "ధాన్యాలు & చిరుధాన్యాలు",
    icon: "cereals_grains",
    color: "amber",
    bgColor: "bg-amber-50",
    subcategories: [
      { id: "paddy_rice", nameEn: "Paddy and Rice (వరి ధాన్యం)", nameTe: "వరి ధాన్యం & బియ్యం" },
      { id: "corn", nameEn: "Corn (Maize - మొక్కజొన్న)", nameTe: "మొక్కజొన్న" },
      { id: "sorghum", nameEn: "Sorghum (Jowar - జొన్నలు)", nameTe: "జొన్నలు" },
      { id: "ragi", nameEn: "Ragi (Finger Millet - రాగులు)", nameTe: "రాగులు (చోళ్లు)" },
      { id: "wheat_barley", nameEn: "Wheat and Barley (గోధుమలు)", nameTe: "గోధుమలు & బార్లీ" },
      { id: "bajra_millets", nameEn: "Bajra & Other Millets (సజ్జలు)", nameTe: "సజ్జలు & ఇతర చిరుధాన్యాలు" }
    ]
  },

  // 2. Pulses
  {
    id: "pulses",
    nameEn: "Pulses",
    nameTe: "పప్పు ధాన్యాలు",
    icon: "pulses",
    color: "orange",
    bgColor: "bg-orange-50",
    subcategories: [
      { id: "red_gram", nameEn: "Red Gram (Toor Dal - కందులు)", nameTe: "కందులు (కందిపప్పు)" },
      { id: "bengal_gram", nameEn: "Bengal Gram (Chana - శనగలు)", nameTe: "శనగలు (పచ్చి శనగలు)" },
      { id: "black_gram", nameEn: "Black Gram (Urad Dal - మినుములు)", nameTe: "మినుములు (మినపపప్పు)" },
      { id: "green_gram", nameEn: "Green Gram (Moong Dal - పెసలు)", nameTe: "పెసలు (పెసరపప్పు)" },
      { id: "horse_gram", nameEn: "Horse Gram (Ulavalu - ఉలవలు)", nameTe: "ఉలవలు" },
      { id: "cowpea", nameEn: "Cowpea (Alasandalu - అలసందలు)", nameTe: "అలసందలు (బొబ్బర్లు)" },
      { id: "other_pulses", nameEn: "Other Pulses (ఇతర పప్పులు)", nameTe: "ఇతర పప్పులు" }
    ]
  },

  // 3. Oilseeds
  {
    id: "oilseeds",
    nameEn: "Oilseeds",
    nameTe: "నూనెగింజలు",
    icon: "oilseeds",
    color: "yellow",
    bgColor: "bg-yellow-50",
    subcategories: [
      { id: "groundnut", nameEn: "Groundnut / Peanut (వేరుశనగ)", nameTe: "వేరుశనగ (పల్లీలు)" },
      { id: "sunflower", nameEn: "Sunflower (పొద్దుతిరుగుడు)", nameTe: "పొద్దుతిరుగుడు" },
      { id: "sesame", nameEn: "Sesame / Til (నువ్వులు)", nameTe: "నువ్వులు" },
      { id: "mustard", nameEn: "Mustard (ఆవాలు)", nameTe: "ఆవాలు" },
      { id: "castor", nameEn: "Castor Seeds (ఆముదాలు)", nameTe: "ఆముదాలు" },
      { id: "soyabean", nameEn: "Soyabean (సోయాబీన్)", nameTe: "సోయాబీన్" },
      { id: "other_oilseeds", nameEn: "Other Oilseeds (ఇతర నూనెగింజలు)", nameTe: "ఇతర నూనెగింజలు" }
    ]
  },

  // 4. Fruits & Vegetables
  {
    id: "fruits_vegetables",
    nameEn: "Fruits & Vegetables",
    nameTe: "కూరగాయలు & పండ్లు",
    icon: "fruits_vegetables",
    color: "rose",
    bgColor: "bg-rose-50",
    subcategories: [
      { id: "coconuts", nameEn: "Coconuts (Tender & Dry Coconuts, Copra)", nameTe: "కొబ్బరికాయలు, బోండాలు & కొబ్బరి చిప్పలు" },
      { id: "tomatoes", nameEn: "Tomatoes (టమోటాలు)", nameTe: "టమోటాలు" },
      { id: "onions", nameEn: "Onions (ఉల్లిపాయలు)", nameTe: "ఉల్లిపాయలు" },
      { id: "chillies", nameEn: "Chillies (Green & Dry Mirchi)", nameTe: "పచ్చిమిర్చి & ఎండుమిర్చి" },
      { id: "mangoes", nameEn: "Mangoes (Banganapalli, etc.)", nameTe: "బంగినపల్లి & ఇతర మామిడి" },
      { id: "bananas", nameEn: "Bananas (అరటిపండ్లు)", nameTe: "అరటిపండ్లు (రకరకాలు)" },
      { id: "citrus", nameEn: "Citrus & Sweet Lime (Battayi, Lemon)", nameTe: "బత్తాయి & నిమ్మకాయలు" },
      { id: "leafy_greens", nameEn: "Leafy Greens (తాజా ఆకుకూరలు)", nameTe: "తాజా ఆకుకూరలు" },
      { id: "other_produce", nameEn: "Other Vegetables & Fruits", nameTe: "ఇతర కూరగాయలు & పండ్లు" }
    ]
  },

  // 5. Livestock & Poultry
  {
    id: "livestock_poultry",
    nameEn: "Livestock & Poultry",
    nameTe: "పశువులు & పౌల్ట్రీ",
    icon: "livestock_poultry",
    color: "amber",
    bgColor: "bg-orange-50",
    subcategories: [
      { id: "cows_buffaloes", nameEn: "Cows and Buffaloes (ఆవులు, గేదెలు)", nameTe: "పాడి ఆవులు & ముర్రా గేదెలు" },
      { id: "goats_sheep", nameEn: "Goats and Sheep (మేకలు, గొర్రెలు)", nameTe: "మేకలు & నెల్లూరు జోడిపి గొర్రెలు" },
      { id: "poultry", nameEn: "Poultry (Country Chicken & Eggs)", nameTe: "నాటుకోళ్లు, ఫారం కోళ్లు & గుడ్లు" },
      { id: "others_livestock", nameEn: "Others (Ducks, Quails, Horses)", nameTe: "ఇతర పెంపుడు జీవాలు" }
    ]
  },

  // 6. Aqua & Fisheries
  {
    id: "aqua_fisheries",
    nameEn: "Aqua & Fisheries",
    nameTe: "చేపలు & రొయ్యల సాగు",
    icon: "aqua_fisheries",
    color: "sky",
    bgColor: "bg-sky-50",
    subcategories: [
      { id: "freshwater_fish", nameEn: "Freshwater Fish (రోహు, బొచ్చె, కొర్రమీను)", nameTe: "మంచినీటి చేపలు (రోహు, బొచ్చె, కొర్రమీను)" },
      { id: "shrimp_prawn", nameEn: "Shrimp & Prawns (వనామి రొయ్యలు)", nameTe: "వనామి & టైగర్ రొయ్యలు" },
      { id: "fish_seed", nameEn: "Fish & Shrimp Seeds (చేప & రొయ్య పిల్లలు)", nameTe: "చేప & రొయ్య సీడ్" },
      { id: "aqua_feed", nameEn: "Aqua Feed & Supplements (ఆక్వా మేత)", nameTe: "చేపల & రొయ్యల మేత" },
      { id: "aerators_nets", nameEn: "Aerators, Pumps & Fishing Nets", nameTe: "ఏరియేటర్లు & చేపల వలలు" }
    ]
  },

  // 7. Agri Inputs
  {
    id: "agri_inputs",
    nameEn: "Agri Inputs",
    nameTe: "ఎరువులు & విత్తనాలు",
    icon: "agri_inputs",
    color: "emerald",
    bgColor: "bg-emerald-50",
    subcategories: [
      { id: "organic_manure", nameEn: "Organic Compost & Cow Dung Manure", nameTe: "పశువుల ఎరువు & వర్మీ కంపోస్ట్" },
      { id: "bio_fertilisers", nameEn: "Bio-fertilisers & Jeevamrutham", nameTe: "జీవామృతం & బయో ఎరువులు" },
      { id: "chemical_npk", nameEn: "Urea & Chemical NPK / DAP", nameTe: "యూరియా, డి.ఎ.పి & ఎన్.పి.కె" },
      { id: "crop_seeds", nameEn: "Crop Seeds & Coconut Saplings", nameTe: "వరి & పంట విత్తనాలు, కొబ్బరి మొక్కలు" },
      { id: "pesticides_weedicides", nameEn: "Pesticides & Weedicides", nameTe: "పురుగుమందులు & కలుపుమందులు" }
    ]
  },

  // 8. Machinery & Rentals
  {
    id: "machinery_rentals",
    nameEn: "Machinery & Rentals",
    nameTe: "వ్యవసాయ యంత్రాలు & అద్దెలు",
    icon: "machinery_rentals",
    color: "teal",
    bgColor: "bg-teal-50",
    subcategories: [
      { id: "tractors_tillers", nameEn: "Tractors and Tillers (ట్రాక్టర్లు)", nameTe: "ట్రాక్టర్లు & పవర్ టిల్లర్లు" },
      { id: "harvesters_threshers", nameEn: "Harvesters and Threshers (వరి కోత మిషన్లు)", nameTe: "వరి కోత యంత్రాలు & నూర్పిడి మిషన్లు" },
      { id: "spraying_equipment", nameEn: "Spraying Equipment (బ్యాటరీ స్ప్రేయర్లు)", nameTe: "బ్యాటరీ స్ప్రేయర్లు & హెచ్.టి.పి" },
      { id: "ploughs_cultivators", nameEn: "Ploughs, Rotavators & Cultivators", nameTe: "రోటవేటర్లు, నాగళ్లు & కల్టివేటర్లు" },
      { id: "machinery_rental", nameEn: "Tractor / Harvester Rental Services", nameTe: "యంత్రాల గంటల అద్దె సేవలు" }
    ]
  },

  // 9. Irrigation & Water Solutions
  {
    id: "irrigation_water",
    nameEn: "Irrigation & Water Solutions",
    nameTe: "నీటిపారుదల & బోర్‌వెల్స్",
    icon: "irrigation_water",
    color: "cyan",
    bgColor: "bg-cyan-50",
    subcategories: [
      { id: "drip_sprinklers", nameEn: "Drip & Sprinkler Sets (డ్రిప్ పరికరాలు)", nameTe: "డ్రిప్ & స్ప్రింక్లర్ సెట్లు" },
      { id: "submersible_motors", nameEn: "Submersible Motors & Pumps (సబ్‌మెర్సిబుల్ మోటార్లు)", nameTe: "సబ్‌మెర్సిబుల్ మోటార్లు & పంపులు" },
      { id: "pvc_pipes", nameEn: "PVC & Delivery Pipes (పైపులు)", nameTe: "పి.వి.సి & డెలివరీ పైపులు" },
      { id: "borewell_drilling", nameEn: "Borewell Drilling & Flushing", nameTe: "బోరుబావి డ్రిల్లింగ్ & సర్వీసింగ్" },
      { id: "solar_pumps", nameEn: "Solar Water Pumps (సోలార్ పంపులు)", nameTe: "సోలార్ వాటర్ పంప్ సెట్లు" }
    ]
  },

  // 10. Fodder & By-products
  {
    id: "fodder_byproducts",
    nameEn: "Fodder & By-products",
    nameTe: "పచ్చిగడ్డి & ఉప ఉత్పత్తులు",
    icon: "fodder_byproducts",
    color: "amber",
    bgColor: "bg-amber-50",
    subcategories: [
      { id: "dry_paddy_straw", nameEn: "Paddy Straw / Hay (వరి ఎండుగడ్డి)", nameTe: "వరి ఎండుగడ్డి మోపులు" },
      { id: "green_fodder_grass", nameEn: "Super Napier & Green Grass (పచ్చిగడ్డి)", nameTe: "సూపర్ నేపియర్ & పచ్చిగడ్డి" },
      { id: "silage_bales", nameEn: "Corn Silage (సైలేజ్ బేల్స్)", nameTe: "మొక్కజొన్న సైలేజ్ బేల్స్" },
      { id: "cattle_feed", nameEn: "Cotton Seed Cake & Cattle Feed", nameTe: "పత్తి చెక్క, దాణా & తవుడు" },
      { id: "coconut_byproducts", nameEn: "Coconut Husk, Shells & Coir Pith", nameTe: "కొబ్బరి పీచు & చిప్పలు" }
    ]
  },

  // 11. Land & Farm Lease
  {
    id: "land_lease",
    nameEn: "Land & Farm Lease",
    nameTe: "వ్యవసాయ భూమి & లీజు",
    icon: "land_lease",
    color: "lime",
    bgColor: "bg-lime-50",
    subcategories: [
      { id: "land_sale", nameEn: "Agricultural Land for Sale (భూమి అమ్మకం)", nameTe: "వ్యవసాయ భూమి అమ్మకం" },
      { id: "land_lease", nameEn: "Farm Land Lease / Rent (కౌలు భూమి)", nameTe: "వ్యవసాయ భూమి కౌలు / లీజు" },
      { id: "borewell_land", nameEn: "Land with Borewell & Power", nameTe: "కరెంట్ & బోరు ఉన్న వ్యవసాయ భూమి" },
      { id: "polyhouse_shed", nameEn: "Polyhouse / Cattle Shed Lease", nameTe: "పాలీహౌస్ & పశువుల షెడ్ లీజు" }
    ]
  },

  // 12. Other Rural Needs
  {
    id: "other_rural",
    nameEn: "Other Rural Needs",
    nameTe: "ఇతర గ్రామీణ అవసరాలు",
    icon: "other_rural",
    color: "orange",
    bgColor: "bg-orange-50",
    subcategories: [
      { id: "farm_labour", nameEn: "Farm Labour Groups (కూలీ జట్లు)", nameTe: "నాట్లు, కలుపు & కోత కూలీ జట్లు" },
      { id: "machine_operators", nameEn: "Harvester & Tractor Drivers", nameTe: "హార్వెస్టర్ & మిషన్ డ్రైవర్లు" },
      { id: "drone_services", nameEn: "Agri Drone Spraying Services", nameTe: "డ్రోన్ పురుగుమందు స్ప్రేయింగ్" },
      { id: "rural_transport", nameEn: "Agri Crop Transport & Trucks", nameTe: "ట్రాక్టర్ & లారీ పంట రవాణా" },
      { id: "other_services", nameEn: "Rural Artisan & General Services", nameTe: "ఇతర గ్రామీణ చేతివృత్తులు & సేవలు" }
    ]
  }
];

/**
 * Normalizes category IDs so older ads show up seamlessly
 */
export function normalizeCategoryId(id: string): string {
  const map: Record<string, string> = {
    // 1. Cereals
    cereals: "cereals_grains",
    grains_millets: "cereals_grains",
    cereals_grains: "cereals_grains",
    commercial_crops: "cereals_grains",
    
    // 2. Pulses
    pulses: "pulses",
    
    // 3. Oilseeds
    oilseeds: "oilseeds",
    
    // 4. Fruits & Vegetables
    vegetables_fruits: "fruits_vegetables",
    fruits_vegetables: "fruits_vegetables",
    fruits: "fruits_vegetables",
    vegetables: "fruits_vegetables",
    coconuts: "fruits_vegetables",
    
    // 5. Livestock & Poultry
    livestock: "livestock_poultry",
    livestock_poultry: "livestock_poultry",
    poultry: "livestock_poultry",
    
    // 6. Aqua
    aqua: "aqua_fisheries",
    aqua_fisheries: "aqua_fisheries",
    
    // 7. Inputs
    inputs: "agri_inputs",
    agri_inputs: "agri_inputs",
    fertilisers_pesticides: "agri_inputs",
    seeds_plants: "agri_inputs",
    
    // 8. Machinery
    machinery: "machinery_rentals",
    machinery_tools: "machinery_rentals",
    machinery_rentals: "machinery_rentals",
    spare_parts: "machinery_rentals",
    
    // 9. Irrigation
    irrigation: "irrigation_water",
    irrigation_water: "irrigation_water",
    
    // 10. Fodder
    fodder: "fodder_byproducts",
    fodder_byproducts: "fodder_byproducts",
    
    // 11. Land
    land: "land_lease",
    land_rent: "land_lease",
    land_lease: "land_lease",
    
    // 12. Other
    farm_labour: "other_rural",
    labour_services: "other_rural",
    other_rural: "other_rural",
    other: "other_rural"
  };
  return map[id] || id;
}

export function getCategoryById(id: string): CategoryDef | undefined {
  const normId = normalizeCategoryId(id);
  return DEFAULT_CATEGORIES.find(c => c.id === normId) || DEFAULT_CATEGORIES[0];
}
