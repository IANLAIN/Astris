// ── Admin Demo Service ──
// All admin functions now use demo data.

import { ADMIN_STATS, ADMIN_USERS, ADMIN_COMPANIES, ADMIN_CANDIDATES } from "./demoData";

export async function logAdminAction(adminId: string, action: string, targetTable: string, targetId?: string, details?: any) {
  // Demo: no-op
  console.log("[ADMIN LOG]", { adminId, action, targetTable, targetId, details });
}

export async function getDashboardStats() {
  return ADMIN_STATS;
}

export async function getAdminUsers() {
  return ADMIN_USERS;
}

export async function softDeleteUser(adminId: string, userId: string, isDeleted: boolean) {
  console.log("[ADMIN] softDeleteUser:", userId, isDeleted);
}

export async function updateUserRole(adminId: string, userId: string, newRole: string) {
  console.log("[ADMIN] updateUserRole:", userId, newRole);
}

export async function getAdminCompanies() {
  return ADMIN_COMPANIES;
}

export async function getAdminCandidates() {
  return ADMIN_CANDIDATES;
}
