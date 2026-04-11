import api from "../api";

export async function applyToJob(jobId, data) {
  return api.post(`applications/${jobId}`, data);
}
export async function getApplications() {
  return api.get('applications/mine');
}
export async function updateApplicationStatus(id, status) {
  return api.patch(`applications/${id}/status`, { status });
}
/* getCompanyStats — single call for the company dashboard:
   returns recentApplications (last 10) + pipeline counts (applied, shortlisted, rejected, hired) */
export async function getCompanyStats() {
  return api.get('applications/company-stats');
}
export async function getApplicationDetails(id) {
  return api.get(`applications/${id}/detail`);
}
