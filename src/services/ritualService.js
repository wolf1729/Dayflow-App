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
     * @param {string} ritualId ID of the ritual
     * @param {string} timestamp ISO string representation of the completion time
     */
    async completeRitual(uid, ritualId, timestamp) {
        return apiClient.patch(`/rituals/${uid}/complete/${ritualId}`, {
            timestamp: timestamp
        });
    },
};

export default ritualService;
