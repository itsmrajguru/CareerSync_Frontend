import api from "../api";

export async function getJobs() {
  return api.get('/jobs');
}
export async function createJob(data) {
  return api.post('/jobs', data);
}
export async function getMyJobs() {
  return api.get('/jobs/mine');
}
export async function updateJob(id, data) {
  return api.put(`/jobs/${id}`, data);
}
export async function deleteJob(id) {
  return api.delete(`/jobs/${id}`);
}
export async function getJobApplicants(jobId) {
  return api.get(`/jobs/${jobId}/applicants`);
}
