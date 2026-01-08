
import React from 'react';
import { Activity, Droplets, Thermometer, ShieldCheck } from 'lucide-react';

export const APP_NAME = "ArogyaSahay";
// The latest high-tech logo provided by the user (A-leaf/gear/shield with branding)
export const LOGO_URL = "https://raw.githubusercontent.com/DattaSai03/ArogyaSahay/main/WhatsApp%20Image%202026-01-08%20at%208.05.22%20PM.jpeg";
  //"https://storage.googleapis.com/static.replit.com/content-creation/1740212450893-6m2r8o.pn"; 

export const CHRONIC_DISEASES = [
  { id: 'BP', label: 'Hypertension', icon: <Activity className="w-8 h-8" />, color: 'text-red-400' },
  { id: 'Diabetes', label: 'Diabetes', icon: <Droplets className="w-8 h-8" />, color: 'text-blue-400' },
  { id: 'Thyroid', label: 'Thyroid', icon: <Thermometer className="w-8 h-8" />, color: 'text-purple-400' },
  { id: 'None', label: 'No Chronic Disease', icon: <ShieldCheck className="w-8 h-8" />, color: 'text-green-400' },
];

export const SYSTEM_INSTRUCTION = `You are AarogyaSahay AI, a healthcare assistant.
Your goal is to support users with medication adherence and chronic disease awareness.

System Context:
- Users receive medicine reminders from the app.
- Each medicine has a scheduled time with a ±30 minute tolerance window.
- Users manually confirm intake using a "Taken" button.
- If not confirmed within the window, the system marks the dose as "Missed".
- Missed doses disable the "Taken" button and deduct 0.5 coins.
- Non-chronic medications have explicit Start and End dates.

Important AI Rules:
- Do NOT diagnose or prescribe.
- Advise immediate medical help for emergencies like chest pain or severe dizziness.
- Maintain a calm, supportive tone.
- Support English, Telugu, and Hindi.
`;
