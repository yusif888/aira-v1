import axios from "axios";
import moment from "moment";
import "moment/locale/id";

// Set locale to Indonesian
moment.locale("id");

const API_BASE_URL =
    "https://api-ffws.dpuair.jatimprov.info/api/landing/form-a";
const API_KEY = import.meta.env.VITE_SIBB_API_KEY;

const FloodService = {
    /**
     * Fetch flood data and format it for the UI
     * @param {Object} params - Query parameters (page, limit, sort)
     * @returns {Promise<Array>} - Formatted data array
     */
    async fetchFloodData({ page = 1, limit = 5, sort = "-start_time" } = {}) {
        try {
            const response = await axios.get(API_BASE_URL, {
                headers: {
                    Accept: "application/json",
                    "Sibb-Api-Key": API_KEY,
                },
                params: {
                    page,
                    limit,
                    sort,
                },
            });

            console.log("Flood API Response:", response.data);

            if (response.data && Array.isArray(response.data.data)) {
                return response.data.data.map((item) => this.formatItem(item));
            }

            return [];
        } catch (error) {
            console.error("FloodService Error:", error);
            // Return empty array on error to prevent UI crash
            return [];
        }
    },

    /**
     * Format a single API item to match UI requirements
     * @param {Object} item - Raw API item
     * @returns {Object} - Formatted item
     */
    formatItem(item) {
        return {
            id: item.id,
            // Format: "DD MMM YYYY HH:mm"
            datetime: item.start_time
                ? moment(item.start_time).format("DD MMM YYYY HH:mm")
                : "-",
            // Use specific location name as title
            title: item.name || "-",
            // DAS (River Basin) context
            das: item.das ? `WS ${item.das}` : "",
            // Use irrigation_area as the specific location detail
            location: item.irrigation_area || item.authority || "-",
            link: `https://sibb.dpuair.jatimprov.go.id/data-bencana/detail?id=${item.id}`,
        };
    },
};

export default FloodService;
