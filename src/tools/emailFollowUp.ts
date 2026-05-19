type EmailFollowUpInput = {
  pharmacyName: string;
  contactEmail: string;
  rxVolume?: string;
  notes: string[];
};

export function sendEmailFollowUp(input: EmailFollowUpInput): void {
  console.log("");
  console.log("[MOCK EMAIL SENT]");
  console.log(`To: ${input.contactEmail}`);
  console.log(`Pharmacy: ${input.pharmacyName}`);
  console.log(`Rx Volume: ${input.rxVolume ?? "Not provided"}`);
  console.log(`Notes: ${input.notes.join("; ") || "General TJM Labs information requested"}`);
  console.log("");
}
