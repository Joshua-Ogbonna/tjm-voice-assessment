import type { Interface } from "node:readline/promises";
import { classifyIntent } from "./intents.js";
import {
  goodbyeResponse,
  highVolumeResponse,
  outOfScopeResponse,
  pharmacyName,
  pricingResponse,
  servicesResponse,
  unknownResponse
} from "./responses.js";
import { sendEmailFollowUp } from "../tools/emailFollowUp.js";
import { scheduleCallback } from "../tools/scheduleCallback.js";
import type { SessionState } from "../types/pharmacy.js";

export async function runConversation(rl: Interface, session: SessionState): Promise<void> {
  while (session.stage !== "ended") {
    const userInput = (await rl.question("Caller: ")).trim();

    if (!userInput) {
      console.log("Agent: I am still here. How can I help with TJM Labs' pharmacy support?");
      continue;
    }

    const response = await handleUserInput(rl, session, userInput);
    if (response) {
      console.log(`Agent: ${response}`);
    }
  }
}

async function handleUserInput(rl: Interface, session: SessionState, userInput: string): Promise<string> {
  if (session.stage === "collecting_pharmacy_name") {
    session.pharmacy.name = userInput;
    session.notes.push(`Caller identified pharmacy as ${userInput}`);
    session.stage = "collecting_rx_volume";
    return `Thanks, ${userInput}. Roughly how many prescriptions do you process per day or per month?`;
  }

  if (session.stage === "collecting_rx_volume") {
    session.pharmacy.rxVolume = userInput;
    session.notes.push(`Reported Rx volume: ${userInput}`);
    session.stage = "ready";
    return `Got it. For ${pharmacyName(session)} doing ${userInput}, TJM Labs can help support high-volume pharmacy workflows. What would you like to know?`;
  }

  if (session.stage === "collecting_email") {
    session.pharmacy.email = userInput;
    sendEmailFollowUp({
      pharmacyName: pharmacyName(session),
      contactEmail: userInput,
      rxVolume: session.pharmacy.rxVolume,
      notes: session.notes
    });
    session.stage = "ready";
    return `I sent the mock email follow-up to ${userInput}. Is there anything else I can help with?`;
  }

  if (session.stage === "collecting_callback_time") {
    scheduleCallback({
      pharmacyName: pharmacyName(session),
      phoneNumber: session.pharmacy.phoneNumber,
      preferredTime: userInput,
      notes: session.notes
    });
    session.stage = "ready";
    return `I scheduled the mock callback for ${userInput}. Anything else before we wrap up?`;
  }

  const intent = classifyIntent(userInput);
  session.notes.push(`Caller said: ${userInput}`);

  switch (intent) {
    case "ASK_SERVICES":
      return servicesResponse(session);
    case "ASK_HIGH_VOLUME_SUPPORT":
      return highVolumeResponse(session);
    case "ASK_PRICING":
      return pricingResponse();
    case "REQUEST_EMAIL":
      return requestEmail(session);
    case "REQUEST_CALLBACK":
      session.stage = "collecting_callback_time";
      return "Sure. What day and time works best for a TJM Labs callback?";
    case "OUT_OF_SCOPE":
      return outOfScopeResponse();
    case "END_CALL":
      session.stage = "ended";
      return goodbyeResponse(session);
    case "UNKNOWN":
      return unknownResponse(session);
  }
}

function requestEmail(session: SessionState): string {
  if (session.pharmacy.email) {
    sendEmailFollowUp({
      pharmacyName: pharmacyName(session),
      contactEmail: session.pharmacy.email,
      rxVolume: session.pharmacy.rxVolume,
      notes: session.notes
    });
    return `I sent the mock email follow-up to ${session.pharmacy.email}.`;
  }

  session.stage = "collecting_email";
  return `I can send that over. What email should I use for ${pharmacyName(session)}?`;
}
