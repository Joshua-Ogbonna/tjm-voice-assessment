type ScheduleCallbackInput = {
  pharmacyName: string;
  phoneNumber: string;
  preferredTime: string;
  notes: string[];
};

export function scheduleCallback(input: ScheduleCallbackInput): void {
  console.log("");
  console.log("[MOCK CALLBACK SCHEDULED]");
  console.log(`Pharmacy: ${input.pharmacyName}`);
  console.log(`Phone: ${input.phoneNumber}`);
  console.log(`Preferred time: ${input.preferredTime}`);
  console.log(`Notes: ${input.notes.join("; ") || "Requested TJM Labs follow-up"}`);
  console.log("");
}
