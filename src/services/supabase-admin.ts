import {
  getDashboardStats as realGetStats,
  getAdminUsers as realGetUsers,
  getAdminCompanies as realGetCompanies,
  getAdminCandidates as realGetCandidates,
  softDeleteUser as realSoftDelete,
  updateUserRole as realUpdateRole,
  logAdminAction as realLog,
} from "./supabase";

export async function logAdminAction(
  adminId: string,
  action: string,
  targetTable: string,
  targetId?: string,
  details?: any
) {
  return realLog(adminId, action, targetTable, targetId, details);
}

export async function getDashboardStats() {
  return realGetStats();
}

export async function getAdminUsers() {
  return realGetUsers();
}

export async function getAdminCompanies() {
  return realGetCompanies();
}

export async function getAdminCandidates() {
  return realGetCandidates();
}

export async function softDeleteUser(
  adminId: string,
  userId: string,
  isDeleted: boolean
) {
  return realSoftDelete(adminId, userId, isDeleted);
}

export async function updateUserRole(
  adminId: string,
  userId: string,
  newRole: string
) {
  return realUpdateRole(adminId, userId, newRole);
}
