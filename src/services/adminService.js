import api from "../api";

/* admin service...
provides methods to fetch platform stats and manage companies/jobs */

export const getAdminStats = () => api.get('admin/stats');
export const getAllCompanies = () => api.get('admin/companies');
export const verifyCompany = (id, isVerified) => api.patch(`admin/companies/${id}/verify`, { isVerified });
export const getAllJobsAdmin = () => api.get('admin/jobs');
