import { lazy } from "react";

/** All pages imported lazily — mandatory for code splitting */
export const LandingPage = lazy(() =>
  import("@/pages/public/LandingPage").then((m) => ({
    default: m.LandingPage,
  }))
);
export const AboutPage = lazy(() =>
  import("@/pages/public/AboutPage").then((m) => ({ default: m.AboutPage }))
);
export const SupportPage = lazy(() =>
  import("@/pages/public/SupportPage").then((m) => ({
    default: m.SupportPage,
  }))
);
export const PartnersPage = lazy(() =>
  import("@/pages/public/PartnersPage").then((m) => ({
    default: m.PartnersPage,
  }))
);
export const CandidateOnboarding = lazy(() =>
  import("@/pages/candidate/CandidateOnboarding").then((m) => ({
    default: m.CandidateOnboarding,
  }))
);
export const CandidateQuiz = lazy(() =>
  import("@/pages/candidate/CandidateQuiz").then((m) => ({
    default: m.CandidateQuiz,
  }))
);
export const CandidateProfile = lazy(() =>
  import("@/pages/candidate/CandidateProfile").then((m) => ({
    default: m.CandidateProfile,
  }))
);
export const CandidateVacancies = lazy(() =>
  import("@/pages/candidate/CandidateVacancies").then((m) => ({
    default: m.CandidateVacancies,
  }))
);
export const VacancyDetail = lazy(() =>
  import("@/pages/candidate/VacancyDetail").then((m) => ({
    default: m.VacancyDetail,
  }))
);
export const MentorSelect = lazy(() =>
  import("@/pages/candidate/MentorSelect").then((m) => ({
    default: m.MentorSelect,
  }))
);
export const CandidateAccompaniment = lazy(() =>
  import("@/pages/candidate/CandidateAccompaniment").then((m) => ({
    default: m.CandidateAccompaniment,
  }))
);
export const CandidatePostHire = lazy(() =>
  import("@/pages/candidate/CandidatePostHire").then((m) => ({
    default: m.CandidatePostHire,
  }))
);
export const SettingsPage = lazy(() =>
  import("@/pages/shared/SettingsPage").then((m) => ({
    default: m.SettingsPage,
  }))
);
export const NotFoundPage = lazy(() =>
  import("@/pages/shared/NotFoundPage").then((m) => ({
    default: m.NotFoundPage,
  }))
);
export const CompanyOrgProfile = lazy(() =>
  import("@/pages/company/CompanyOrgProfile").then((m) => ({
    default: m.CompanyOrgProfile,
  }))
);
export const CompanyPostVacancy = lazy(() =>
  import("@/pages/company/CompanyPostVacancy").then((m) => ({
    default: m.CompanyPostVacancy,
  }))
);
export const CompanyCandidates = lazy(() =>
  import("@/pages/company/CompanyCandidates").then((m) => ({
    default: m.CompanyCandidates,
  }))
);
export const CompanyCandidateDetail = lazy(() =>
  import("@/pages/company/CompanyCandidateDetail").then((m) => ({
    default: m.CompanyCandidateDetail,
  }))
);
export const CompanyPostHire = lazy(() =>
  import("@/pages/company/CompanyPostHire").then((m) => ({
    default: m.CompanyPostHire,
  }))
);
export const MentorDashboard = lazy(() =>
  import("@/pages/mentor/MentorDashboard").then((m) => ({
    default: m.MentorDashboard,
  }))
);
export const MentorCheckins = lazy(() =>
  import("@/pages/mentor/MentorCheckins").then((m) => ({
    default: m.MentorCheckins,
  }))
);
export const MentorCompanies = lazy(() =>
  import("@/pages/mentor/MentorCompanies").then((m) => ({
    default: m.MentorCompanies,
  }))
);
export const AdminDashboard = lazy(() =>
  import("@/pages/admin/AdminDashboard")
);
