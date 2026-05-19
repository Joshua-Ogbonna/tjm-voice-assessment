import type { SessionState } from "../types/pharmacy.js";

export function greeting(session: SessionState): string {
  const profile = session.pharmacy;

  if (!profile.recognized) {
    return [
      "Thanks for calling TJM Labs.",
      "I do not have your pharmacy pulled up from caller ID yet.",
      "What is the name of your pharmacy?"
    ].join(" ");
  }

  const location = [profile.city, profile.state].filter(Boolean).join(", ");
  const details = [
    location ? `in ${location}` : undefined,
    profile.rxVolume ? `with ${profile.rxVolume}` : undefined
  ]
    .filter(Boolean)
    .join(" ");

  return [
    `Thanks for calling TJM Labs. Am I speaking with someone from ${profile.name}?`,
    details ? `I see ${profile.name} is ${details}.` : undefined,
    "I can walk you through how TJM Labs supports high-volume pharmacy operations."
  ]
    .filter(Boolean)
    .join(" ");
}

export function servicesResponse(session: SessionState): string {
  return [
    `For ${pharmacyName(session)}, TJM Labs can help pharmacy teams manage high Rx workflows with operational support, clearer follow-up processes, and sales support from our team.`,
    "I can also collect a few details and have the right person send more specific information."
  ].join(" ");
}

export function highVolumeResponse(session: SessionState): string {
  const volume = session.pharmacy.rxVolume ? ` at ${session.pharmacy.rxVolume}` : "";
  return [
    `For a pharmacy like ${pharmacyName(session)}${volume}, the main value is helping the team stay organized as prescription volume grows.`,
    "TJM Labs can discuss workflow support, outreach, and next steps for pharmacies handling heavier daily or monthly Rx demand."
  ].join(" ");
}

export function pricingResponse(): string {
  return "I do not want to guess pricing incorrectly. I can collect your details and have the TJM Labs team send accurate follow-up information based on your pharmacy's volume and needs.";
}

export function outOfScopeResponse(): string {
  return "I cannot provide clinical, patient-specific, or unrelated advice. I can help explain TJM Labs' pharmacy operations support or arrange a follow-up with the team.";
}

export function unknownResponse(session: SessionState): string {
  return `I can help with TJM Labs' pharmacy sales and operations support for ${pharmacyName(session)}. You can ask about high Rx volume support, pricing follow-up, email information, or scheduling a callback.`;
}

export function goodbyeResponse(session: SessionState): string {
  return `Thanks for calling TJM Labs. I have noted the conversation for ${pharmacyName(session)}. Have a great day.`;
}

export function pharmacyName(session: SessionState): string {
  return session.pharmacy.name ?? "your pharmacy";
}
