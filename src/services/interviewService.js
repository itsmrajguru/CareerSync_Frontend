import api from "../api";

export const scheduleInterview = async (applicationId, data) => {
  try {
    const res = await api.post(`/interviews/${applicationId}/schedule`, data);
    return res;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to schedule interview.";
    return { success: false, message };
  }
};

export const cancelInterview = async (interviewId) => {
  try {
    const res = await api.patch(`/interviews/${interviewId}/cancel`, {});
    return res;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to cancel interview.";
    return { success: false, message };
  }
};

export const getInterviewsForJob = async (jobId) => {
  try {
    const res = await api.get(`/interviews/job/${jobId}`);
    return res;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch interviews.";
    return { success: false, message };
  }
};

export const getCompanyInterviews = async () => {
  try {
    const res = await api.get(`/interviews/company/all`);
    return res;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch company interviews.";
    return { success: false, message };
  }
};

export const getMyInterviews = async () => {
  try {
    const res = await api.get(`/interviews/mine`);
    return res;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch your interviews.";
    return { success: false, message };
  }
};

