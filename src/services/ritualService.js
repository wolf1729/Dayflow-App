import apiClient from '../utils/apiClient';

/**
 * Service for ritual-related API calls.
 */
const ritualService = {
    /**
     * Get all rituals for a user.
     * @param {string} uid User ID
     */
    async getRituals(uid) {
        return apiClient.get(`/rituals/${uid}`);
    },

    /**
     * Create a new ritual for a user.
     * @param {string} uid User ID
     * @param {object} ritualData Ritual data
     */
    async createRitual(uid, ritualData) {
        return apiClient.post(`/rituals/${uid}`, {
            group: ritualData.group,
            name: ritualData.title, // Mapping title to name
            createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            isCounter: !!ritualData.isCounter,
            unit: ritualData.unit || null,
        });
    },

    /**
     * Archive a ritual.
     * @param {string} uid User ID
     * @param {string} ritualName Name of the ritual to archive
     */
    async archiveRitual(uid, ritualName) {
        return apiClient.patch(`/rituals/${uid}/archive/${ritualName}`, {});
    },

    /**
     * Delete a ritual (move to deletedRitual).
     * @param {string} uid User ID
     * @param {string} ritualName Name of the ritual to delete
     */
    async deleteRitual(uid, ritualName) {
        return apiClient.patch(`/rituals/${uid}/delete/${ritualName}`, {});
    },
};

export default ritualService;
