import api from "../api";

/* these functions are used to call the backend server application controllers */
export async function applyToJob(jobId, data) {
  return api.post(`/applications/${jobId}`, data);
}
export async function getApplications() {
  return api.get('/applications/mine');
}
export async function updateApplicationStatus(id, status) {
  return api.patch(`/applications/${id}/status`, { status });
}
