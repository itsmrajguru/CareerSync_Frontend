import api from "../api";

//Calls the Adzuna Api Service to fetch jobs
export async function getJobs(query, page = 1, limit = 10) {
  return api.get('/external-jobs', {
    params: { q: query, page, limit }
  });
}
