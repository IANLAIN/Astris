import { Role } from "@/types";

/** Search-param screen values by role */
export const CANDIDATE_SCREENS = [
  "onboarding", "quiz", "profile", "vacancies", "vacancy-detail",
  "mentor-select", "accompaniment", "post-hire", "tracking",
] as const;

export const ORGANIZATION_SCREENS = [
  "org-profile", "post-vacancy", "candidates", "candidate-detail",
  "org-post-hire", "post-hire",
] as const;

export const MENTOR_SCREENS = ["dashboard", "checkins", "organizations"] as const;

export const ADMIN_SCREENS = [
  "dashboard", "organizations", "candidates", "mentors", "mentorships", "activity",
] as const;

export type CandidateScreen = (typeof CANDIDATE_SCREENS)[number];
export type OrganizationScreen = (typeof ORGANIZATION_SCREENS)[number];
export type MentorScreen = (typeof MENTOR_SCREENS)[number];
export type AdminScreen = (typeof ADMIN_SCREENS)[number];

/** Role → initial screen after login (when user already has data) */
export const ROLE_HOME_SCREEN: Record<Role, string> = {
  candidate: "profile",
  organization: "candidates",
  mentor: "dashboard",
  admin: "dashboard",
};

/** Role → first-screen after fresh registration (quiz not completed) */
export const ROLE_REGISTER_SCREEN: Record<Role, string> = {
  candidate: "onboarding",
  organization: "org-profile",
  mentor: "dashboard",
  admin: "dashboard",
};

/** Screen → label key for NavBar */
export const NAV_ITEMS: Record<Role, Array<{ id: string; labelKey: string; icon: string }>> = {
  candidate: [
    { id: "profile", labelKey: "nav.profile", icon: "BarChart2" },
    { id: "vacancies", labelKey: "nav.vacancies", icon: "Briefcase" },
    { id: "mentor-select", labelKey: "nav.mentor", icon: "Users" },
    { id: "post-hire", labelKey: "nav.tracking", icon: "Activity" },
  ],
  organization: [
    { id: "org-profile", labelKey: "nav.org", icon: "Building2" },
    { id: "post-vacancy", labelKey: "nav.post", icon: "FileText" },
    { id: "candidates", labelKey: "nav.candidates", icon: "Users" },
    { id: "post-hire", labelKey: "nav.tracking", icon: "Activity" },
  ],
  mentor: [
    { id: "dashboard", labelKey: "nav.dashboard", icon: "BarChart2" },
    { id: "checkins", labelKey: "nav.checkins", icon: "Calendar" },
    { id: "organizations", labelKey: "nav.companies", icon: "Building2" },
  ],
  admin: [{ id: "dashboard", labelKey: "nav.dashboard", icon: "BarChart2" }],
};

export const PUBLIC_VIEWS = ["landing", "about", "support", "partners"] as const;
export type PublicViewType = (typeof PUBLIC_VIEWS)[number];
