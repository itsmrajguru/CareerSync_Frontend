import axios from "axios";

// Interview Service Endpoints
const API_URL = "http://localhost:8000/api/v1/interviews";

// Get token helper
const getToken = () => localStorage.getItem("token");

export const scheduleInterview = async (applicationId, data) => {
  try {
    const res = await axios.post(`${API_URL}/${applicationId}/schedule`, data, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to schedule interview.";
    return { success: false, message };
  }
};

export const cancelInterview = async (interviewId) => {
  try {
    const res = await axios.patch(`${API_URL}/${interviewId}/cancel`, {}, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to cancel interview.";
    return { success: false, message };
  }
};

export const getInterviewsForJob = async (jobId) => {
  try {
    const res = await axios.get(`${API_URL}/job/${jobId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch interviews.";
    return { success: false, message };
  }
};

export const getCompanyInterviews = async () => {
  try {
    const res = await axios.get(`${API_URL}/company/all`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch company interviews.";
    return { success: false, message };
  }
};

export const getMyInterviews = async () => {
  try {
    const res = await axios.get(`${API_URL}/mine`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch your interviews.";
    return { success: false, message };
  }
};
