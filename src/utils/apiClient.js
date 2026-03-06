BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/**
 * Reusable API client for the Dayflow App.
 * Handles common request configurations and error processing.
 */
const apiClient = {
    /**
     * Generic request handler
     */
    async request(endpoint, options = {}) {
        const url = `${BASE_URL}${endpoint}`;

        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Return a structured error object
                throw {
                    status: response.status,
                    message: data.detail || data.message || 'An unexpected error occurred',
                    data: data
                };
            }

            return data;
        } catch (error) {
            console.error(`API Error (${options.method || 'GET'} ${endpoint}):`, error);
            // Re-throw formatted error
            if (error.status) throw error;
            throw {
                status: 500,
                message: error.message || 'Network request failed',
            };
        }
    },

    /**
     * GET request
     */
    get(endpoint, headers = {}) {
        return this.request(endpoint, { method: 'GET', headers });
    },

    /**
     * POST request
     */
    post(endpoint, body, headers = {}) {
        return this.request(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });
    },

    /**
     * PUT request
     */
    put(endpoint, body, headers = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body),
        });
    },

    /**
     * PATCH request
     */
    patch(endpoint, body, headers = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(body),
        });
    },

    /**
     * DELETE request
     */
    delete(endpoint, headers = {}) {
        return this.request(endpoint, { method: 'DELETE', headers });
    },
};

export default apiClient;
