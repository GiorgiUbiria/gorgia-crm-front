import defaultInstance from "../plugins/axios";

export const getNotifications = async () => {
    return defaultInstance.get('/api/notifications');
};