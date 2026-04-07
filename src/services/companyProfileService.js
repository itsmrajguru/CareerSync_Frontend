import api from "../api";

/* these functions are used to call the backend server company controllers */
export async function getCompanyProfile() {
  return api.get('/companies/me');
}
export async function updateCompanyProfile(data) {
  return api.put('/companies/me', data);
}
export async function getCompanyById(id) {
  return api.get(`/companies/${id}`);
}
