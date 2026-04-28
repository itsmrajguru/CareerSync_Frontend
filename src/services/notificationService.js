import api from "../api";

export async function getNotifications() {
    return api.get('notifications');
}

export async function markNotificationRead(id) {
    return api.patch(`notifications/${id}/read`);
}

export async function markAllNotificationsRead() {
    return api.patch('notifications/all/read');
}

export async function logEmailCommunication(data) {
    return api.post('notifications/log-email', data);
}
