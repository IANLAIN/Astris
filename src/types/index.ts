export type Lang = "es" | "en" | "pt" | "fr";
export type ModalStep = "language" | "register" | "login" | "none";
export type Role = "candidate" | "organization" | "mentor" | "admin";
export type PaletteKey = "azul" | "tierra" | "contraste" | "verde";
export type FontKey = "inter" | "opendyslexic";
export type PublicView = "landing" | "about" | "support" | "partners";
export type QuizAnswers = Record<number, Record<number, number | number[]>>;

export interface VacancyItem {
  id: string;
  title: string;
  organization: string;
  sector: string;
  modality: string;
  type: string;
  match: number;
  socialLevel: string;
  adjustments: string[];
  desc: string;
  organizationDesc: string;
}

export interface MentorItem {
  id: string;
  name: string;
  specialty: string;
  years: number;
  modality: string;
  bio: string;
}
