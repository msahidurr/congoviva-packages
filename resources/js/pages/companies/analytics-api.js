/**
 * API functions for analytics data
 */

/**
 * Fetch section data from the server
 * 
 * @param {string} section - The section to fetch (geographic, devices, browsers, referrers, popularPages)
 * @param {string} timeRange - The time range (1d, 7d, 30d, 90d)
 * @returns {Promise} - Promise that resolves to the section data
 */
export const fetchSectionData = async (section, timeRange) => {
  try {
    // Use the analytics route directly to ensure proper routing
    const url = `${route('analytics')}?section=${section}&range=${timeRange}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching ${section} data:`, error);
    return [];
  }
};

/**
 * Fetch realtime data
 * 
 * @returns {Promise} - Promise that resolves to the realtime data
 */
export const fetchRealtimeData = async () => {
  try {
    // Use the analytics realtime route directly to ensure proper routing
    const url = `${route('analytics.realtime')}?_=${Date.now()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.analytics?.visitor?.realtime || null;
  } catch (error) {
    console.error('Error fetching realtime data:', error);
    return null;
  }
};