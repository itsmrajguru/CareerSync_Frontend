//creating integrationService

import api from "../api";

/* triggerAIInterview service */
export const triggerAIInterview = async (applicationId, options = {}) => {
    const { data } = await api.post(`/integration/trigger/${applicationId}`, options)
    return data
}
