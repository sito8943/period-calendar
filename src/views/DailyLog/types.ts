import type { FlowLevel, SexualProtection, SymptomKey } from "lib";

export type DailyLogFormValues = {
  date: string;
  flow: FlowLevel | "";
  symptoms: SymptomKey[];
  hadSex: boolean;
  protection: SexualProtection | "";
  mood: "" | "1" | "2" | "3" | "4" | "5";
  sleepHours: string;
  sleepQuality: "" | "1" | "2" | "3" | "4" | "5";
  notes: string;
};
