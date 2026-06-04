import api from "../api";

// get logged-in company profile
export async function getCompanyProfile() {
  return api.get('companies/me');
}

// update logged-in company profile
export async function updateCompanyProfile(data) {
  return api.put('companies/me', data);
}

// get single company profile by id (student/recruiter/admin)
export async function getCompanyById(id) {
  return api.get(`companies/${id}`);
}

// get all companies (discovery page with search and filters)
export async function getAllCompanies(params) {
  return api.get('companies', { params });
}

// get jobs posted by specific company
export async function getCompanyJobs(id) {
  return api.get(`companies/${id}/jobs`);
}

// follow a company
export async function followCompany(companyId) {
  return api.post('companies/follow', { companyId });
}

// unfollow a company
export async function unfollowCompany(companyId) {
  return api.post('companies/unfollow', { companyId });
}

// get followed companies list
export async function getFollowedCompanies() {
  return api.get('companies/followed');
}
