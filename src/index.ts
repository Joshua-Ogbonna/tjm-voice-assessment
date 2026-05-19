import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { findPharmacyByPhone, fetchPharmacies, toPharmacyProfile } from "./api/pharmacies.js";
import { runConversation } from "./agent/conversation.js";
import { greeting } from "./agent/responses.js";
import type { SessionState } from "./types/pharmacy.js";

const DEFAULT_MOCK_CALLER_PHONE = "+1-555-123-4567";

async function main(): Promise<void> {
  const callerPhone = process.env.MOCK_CALLER_PHONE ?? DEFAULT_MOCK_CALLER_PHONE;
  const pharmacies = await fetchPharmacies();
  const matchedPharmacy = findPharmacyByPhone(pharmacies, callerPhone);

  const session: SessionState = {
    callerPhone,
    pharmacy: matchedPharmacy
      ? toPharmacyProfile(matchedPharmacy, callerPhone)
      : {
          phoneNumber: callerPhone,
          recognized: false
        },
    stage: matchedPharmacy ? "ready" : "collecting_pharmacy_name",
    notes: [`Inbound call from ${callerPhone}`]
  };

  const rl = createInterface({ input, output });

  console.log("TJM Labs Inbound Pharmacy Sales Agent");
  console.log(`Mock caller phone: ${callerPhone}`);
  console.log("");
  console.log(`Agent: ${greeting(session)}`);

  try {
    await runConversation(rl, session);
  } finally {
    rl.close();
  }
}

main().catch((error: unknown) => {
  console.error("Agent failed to start.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
