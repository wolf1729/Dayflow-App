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
            createdAt: new Date().toISOString(), // Full ISO string for datetime
            isCounter: !!ritualData.isCounter,
            unit: ritualData.unit || null,
        });
    },

    /**
     * Archive a ritual.
     * @param {string} uid User ID
     * @param {string} ritualId ID of the ritual to archive
     */
    async archiveRitual(uid, ritualId) {
        return apiClient.patch(`/rituals/${uid}/archive/${ritualId}`, {});
    },

    /**
     * Delete a ritual (move to deletedRitual).
     * @param {string} uid User ID
     * @param {string} ritualId ID of the ritual to delete
     */
    async deleteRitual(uid, ritualId) {
        return apiClient.patch(`/rituals/${uid}/delete/${ritualId}`, {});
    },

    /**
     * Delete all rituals in a specific group.
     * @param {string} uid User ID
     * @param {string} groupName Name of the group to delete
     */
    async deleteGroupRituals(uid, groupName) {
        return apiClient.post('/rituals/delete-group', {
            uid: uid,
            group_name: groupName
        });
    },

    /**
     * Mark a ritual as complete for the day.
     * @param {string} uid User ID
     * @param {string} ritualId ID of the ritual to complete
     * @param {string} timestamp ISO timestamp of completion
     */
    async completeRitual(uid, ritualId, timestamp) {
        return apiClient.patch(`/rituals/${uid}/complete/${ritualId}`, { timestamp });
    },

    /**
     * Log a count for a specific date for counter rituals.
     * @param {string} uid User ID
     * @param {string} ritualId ID of the ritual to update
     * @param {string} date YYYY-MM-DD date string
     * @param {number} count The new total count for that date
     */
    async logRitualCount(uid, ritualId, date, count) {
        return apiClient.patch(`/rituals/${uid}/log-count/${ritualId}`, { date, count });
    }
};

export default ritualService;
