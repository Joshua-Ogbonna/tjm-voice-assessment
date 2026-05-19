export type Prescription = {
  drug: string;
  count: number;
};

export type Pharmacy = {
  id: string | number;
  name: string;
  phone?: string | null;
  email?: string | null;
  city?: string;
  state?: string;
  address?: string;
  contactPerson?: string;
  prescriptions?: Prescription[];
  avg_monthly_prescriptions?: Prescription[];
  rxVolume?: number;
};

export type PharmacyProfile = {
  id?: string;
  name?: string;
  phoneNumber: string;
  email?: string;
  city?: string;
  state?: string;
  rxVolume?: string;
  recognized: boolean;
};

export type ConversationStage =
  | "identified"
  | "collecting_pharmacy_name"
  | "collecting_rx_volume"
  | "ready"
  | "collecting_email"
  | "collecting_callback_time"
  | "ended";

export type SessionState = {
  callerPhone: string;
  pharmacy: PharmacyProfile;
  stage: ConversationStage;
  notes: string[];
};
