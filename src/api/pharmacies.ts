import type { Pharmacy, PharmacyProfile } from "../types/pharmacy.js";
import { normalizePhone } from "../utils/normalizePhone.js";

const PHARMACIES_URL = "https://67e14fb758cc6bf785254550.mockapi.io/pharmacies";

export async function fetchPharmacies(): Promise<Pharmacy[]> {
  const response = await fetch(PHARMACIES_URL);

  if (!response.ok) {
    throw new Error(`Unable to fetch pharmacies: ${response.status} ${response.statusText}`);
  }

  const payload: unknown = await response.json();

  if (!Array.isArray(payload)) {
    throw new Error("Unexpected pharmacies API response.");
  }

  return payload.filter(isPharmacy);
}

export function findPharmacyByPhone(pharmacies: Pharmacy[], callerPhone: string): Pharmacy | undefined {
  const normalizedCaller = normalizePhone(callerPhone);
  return pharmacies.find((pharmacy) => normalizePhone(pharmacy.phone) === normalizedCaller);
}

export function toPharmacyProfile(pharmacy: Pharmacy, callerPhone: string): PharmacyProfile {
  return {
    id: String(pharmacy.id),
    name: pharmacy.name,
    phoneNumber: pharmacy.phone ?? callerPhone,
    email: pharmacy.email ?? undefined,
    city: pharmacy.city,
    state: pharmacy.state,
    rxVolume: describeRxVolume(pharmacy),
    recognized: true
  };
}

function describeRxVolume(pharmacy: Pharmacy): string | undefined {
  if (typeof pharmacy.rxVolume === "number") {
    return `${pharmacy.rxVolume.toLocaleString()} prescriptions/month`;
  }

  const prescriptions = pharmacy.prescriptions ?? pharmacy.avg_monthly_prescriptions;
  const total = prescriptions?.reduce((sum, prescription) => sum + prescription.count, 0);

  if (total && total > 0) {
    return `${total.toLocaleString()} recent prescriptions in the API sample`;
  }

  return undefined;
}

function isPharmacy(value: unknown): value is Pharmacy {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<Pharmacy>;
  return typeof candidate.name === "string" && Boolean(candidate.id);
}
