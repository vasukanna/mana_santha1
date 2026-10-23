import { AP_DISTRICTS, DistrictInfo, MandalInfo, VillageInfo } from './apLocations';

// In-memory cache of loaded districts
let cachedDistricts: DistrictInfo[] | null = null;
let loadPromise: Promise<DistrictInfo[]> | null = null;

/**
 * Loads AP districts, mandals, and villages lazily from /data/ap-locations.json.
 * Falls back to bundled AP_DISTRICTS if offline or during instant initial render.
 */
export async function loadApLocations(): Promise<DistrictInfo[]> {
  if (cachedDistricts) return cachedDistricts;

  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        const res = await fetch('/data/ap-locations.json');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            cachedDistricts = data;
            return data;
          }
        }
      } catch (err) {
        console.warn('Lazy location fetch fallback to bundled AP_DISTRICTS:', err);
      }
      cachedDistricts = AP_DISTRICTS;
      return AP_DISTRICTS;
    })();
  }

  return loadPromise;
}

/**
 * Synchronous getter returning cached or bundled location data
 */
export function getLoadedDistricts(): DistrictInfo[] {
  return cachedDistricts || AP_DISTRICTS;
}

export const DEFAULT_DISTRICT_NAME = "Nellore (SPSR Nellore)";

/**
 * Helper to get mandals for a selected district name
 */
export function getMandalsForDistrict(districtName: string): MandalInfo[] {
  const districts = getLoadedDistricts();
  const district = districts.find(d => d.name === districtName) || districts[0];
  return district ? district.mandals : [];
}

/**
 * Helper to get villages for a given district and mandal
 * Always ensures "Other village (type name)" is available
 */
export function getVillagesForMandal(districtName: string, mandalName: string): VillageInfo[] {
  const mandals = getMandalsForDistrict(districtName);
  const mandal = mandals.find(m => m.name === mandalName);
  const villages: VillageInfo[] = mandal ? [...mandal.villages] : [];

  // Add standardized "Other village" option if not present
  const hasOther = villages.some(v => v.name.toLowerCase().includes('other'));
  if (!hasOther) {
    villages.push({
      name: "Other village",
      te: "ఇతర గ్రామం (పేరు టైప్ చేయండి)"
    });
  }

  return villages;
}
