# TJM Labs Pharmacy Voice Agent Simulation

This is a text-based TypeScript simulation of an inbound pharmacy sales voice agent. It identifies the caller from TJM Labs' mock pharmacy API, handles recognized and unrecognized pharmacies, stays inside a safe sales/support scope, and mocks email follow-up and callback scheduling.

## Run

```bash
npm install
npm run build
npm start
```

The app uses `MOCK_CALLER_PHONE` to simulate caller ID.

```bash
MOCK_CALLER_PHONE="+1-555-123-4567" npm start
MOCK_CALLER_PHONE="+1-555-000-0000" npm start
```

Known test caller numbers:

```txt
+1-555-123-4567 -> HealthFirst Pharmacy
+1-555-987-6543 -> QuickMeds Rx
+1-555-666-7777 -> MediCare Plus
+1-555-222-3333 -> CityPharma
+1-555-444-5555 -> Wellness Hub
+1-555-000-0000 -> Unknown pharmacy flow
```

## Test Workflows

Use these sample caller messages after starting the CLI.

### Recognized Pharmacy

```bash
MOCK_CALLER_PHONE="+1-555-123-4567" npm start
```

```txt
How do you help with high Rx volume?
Can you send me email info?
What is your exact pricing?
Can you diagnose a patient prescription issue?
Can you schedule a callback?
Tomorrow at 2pm
bye
```

This demonstrates caller identification, personalized Rx-volume messaging, mocked email follow-up, pricing guardrails, clinical safety handling, callback scheduling, and call close.

### Unknown Pharmacy

```bash
MOCK_CALLER_PHONE="+1-555-000-0000" npm start
```

```txt
BrightCare Pharmacy
Around 600 per day
Can you send information?
manager@brightcare.com
bye
```

This demonstrates the intake path for an unrecognized caller, including collecting pharmacy name, Rx volume, and follow-up email.

### Other Useful Prompts

```txt
What services do you offer?
How can TJM Labs support our pharmacy?
Can someone call me back?
What does it cost?
Can you help with a patient medication question?
What is the weather today?
```

## What It Demonstrates

- Call/session state kept separately from response generation
- Pharmacy lookup through the mock API
- Phone normalization before matching caller ID
- Recognized pharmacy greeting using name, location, and prescription volume
- Unknown pharmacy intake for name and Rx volume
- Rule-based intent handling for a constrained take-home scope
- Safe refusal for clinical, patient-specific, unrelated, and unsupported questions
- Mock follow-up tools for email and callback scheduling

## Production Evolution

With more time, this could evolve into a real voice agent using Twilio/Vapi/Retell for telephony, Deepgram or OpenAI Realtime for speech, an LLM with guarded tool calling, Postgres for state, BullMQ for async follow-up work, and CRM integrations such as HubSpot or Salesforce. I would keep deterministic rules around sensitive paths such as pricing, medical advice, and follow-up scheduling.

## If I Had 3 More Hours

I would add tests around pharmacy lookup, phone normalization, intent classification, and follow-up tool execution. I would also improve the conversation state machine so the agent can recover from missing pharmacy name, missing Rx volume, incomplete callback details, and ambiguous follow-up requests. Finally, I would add an optional LLM layer with strict tool-calling boundaries while keeping deterministic business rules for safety-critical behavior and integrate an actual voice calling API for this process.
