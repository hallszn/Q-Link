/**
 * Profile Management Functions
 * 
 * Handles profile data for each facet.
 * Each facet has one associated profile containing identity information.
 * 
 * Uses localStorage/AsyncStorage for mock data storage.
 */

const STORAGE_KEY = 'qlink_profiles';

/**
 * Get storage adapter (works in both web and React Native)
 */
function getStorage() {
  // Check for React Native AsyncStorage
  if (typeof global !== 'undefined' && global.AsyncStorage) {
    return {
      async getItem(key) {
        return global.AsyncStorage.getItem(key);
      },
      async setItem(key, value) {
        return global.AsyncStorage.setItem(key, value);
      },
    };
  }
  
  // Fall back to localStorage for web
  if (typeof localStorage !== 'undefined') {
    return {
      async getItem(key) {
        return localStorage.getItem(key);
      },
      async setItem(key, value) {
        localStorage.setItem(key, value);
      },
    };
  }
  
  // In-memory fallback for testing
  const memoryStore = {};
  return {
    async getItem(key) {
      return memoryStore[key] || null;
    },
    async setItem(key, value) {
      memoryStore[key] = value;
    },
  };
}

/**
 * Load all profiles from storage
 * @returns {Promise<Object>} Map of facetId -> profile
 */
async function loadProfiles() {
  const storage = getStorage();
  const data = await storage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

/**
 * Save profiles to storage
 * @param {Object} profiles - Map of facetId -> profile
 */
async function saveProfiles(profiles) {
  const storage = getStorage();
  await storage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

/**
 * Default profile template
 * @param {string} facetId - Associated facet ID
 */
function createDefaultProfile(facetId) {
  return {
    facetId,
    displayName: '',
    bio: '',
    avatar: null,
    contactInfo: {
      email: '',
      phone: '',
      website: '',
    },
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
      instagram: '',
    },
    customFields: {},
    visibility: {
      email: 'private',
      phone: 'private',
      website: 'public',
      socialLinks: 'public',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Get profile for a facet
 * @param {string} facetId - Facet ID
 * @returns {Promise<{profile: object|null, error: object|null}>}
 */
export async function getProfile(facetId) {
  try {
    if (!facetId) {
      throw new Error('Facet ID is required');
    }
    
    const profiles = await loadProfiles();
    
    // Return existing profile or create default
    if (profiles[facetId]) {
      return { profile: profiles[facetId], error: null };
    }
    
    // Return a default profile (but don't save it yet)
    const defaultProfile = createDefaultProfile(facetId);
    return { profile: defaultProfile, error: null };
  } catch (error) {
    console.error('Get profile error:', error.message);
    return { profile: null, error };
  }
}

/**
 * Update profile for a facet
 * @param {string} facetId - Facet ID
 * @param {object} profileData - Profile fields to update
 * @returns {Promise<{profile: object|null, error: object|null}>}
 */
export async function updateProfile(facetId, profileData) {
  try {
    if (!facetId) {
      throw new Error('Facet ID is required');
    }
    
    if (!profileData || typeof profileData !== 'object') {
      throw new Error('Profile data must be an object');
    }
    
    const profiles = await loadProfiles();
    
    // Get existing profile or create default
    const existingProfile = profiles[facetId] || createDefaultProfile(facetId);
    
    // Deep merge profile data
    const updatedProfile = {
      ...existingProfile,
      ...profileData,
      facetId, // Ensure facetId can't be changed
      contactInfo: {
        ...existingProfile.contactInfo,
        ...(profileData.contactInfo || {}),
      },
      socialLinks: {
        ...existingProfile.socialLinks,
        ...(profileData.socialLinks || {}),
      },
      customFields: {
        ...existingProfile.customFields,
        ...(profileData.customFields || {}),
      },
      visibility: {
        ...existingProfile.visibility,
        ...(profileData.visibility || {}),
      },
      updatedAt: new Date().toISOString(),
    };
    
    profiles[facetId] = updatedProfile;
    await saveProfiles(profiles);
    
    return { profile: updatedProfile, error: null };
  } catch (error) {
    console.error('Update profile error:', error.message);
    return { profile: null, error };
  }
}

/**
 * Delete profile for a facet (internal use, called when facet is deleted)
 * @param {string} facetId - Facet ID
 * @returns {Promise<{success: boolean, error: object|null}>}
 */
export async function deleteProfile(facetId) {
  try {
    if (!facetId) {
      throw new Error('Facet ID is required');
    }
    
    const profiles = await loadProfiles();
    
    if (profiles[facetId]) {
      delete profiles[facetId];
      await saveProfiles(profiles);
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Delete profile error:', error.message);
    return { success: false, error };
  }
}

/**
 * Add a custom field to a profile
 * @param {string} facetId - Facet ID
 * @param {string} fieldName - Custom field name
 * @param {any} fieldValue - Custom field value
 * @returns {Promise<{profile: object|null, error: object|null}>}
 */
export async function addCustomField(facetId, fieldName, fieldValue) {
  try {
    if (!fieldName || typeof fieldName !== 'string') {
      throw new Error('Field name is required');
    }
    
    const { profile } = await getProfile(facetId);
    
    return updateProfile(facetId, {
      customFields: {
        ...profile.customFields,
        [fieldName]: fieldValue,
      },
    });
  } catch (error) {
    console.error('Add custom field error:', error.message);
    return { profile: null, error };
  }
}

/**
 * Remove a custom field from a profile
 * @param {string} facetId - Facet ID
 * @param {string} fieldName - Custom field name to remove
 * @returns {Promise<{profile: object|null, error: object|null}>}
 */
export async function removeCustomField(facetId, fieldName) {
  try {
    if (!fieldName || typeof fieldName !== 'string') {
      throw new Error('Field name is required');
    }
    
    const { profile } = await getProfile(facetId);
    const { [fieldName]: removed, ...remainingFields } = profile.customFields;
    
    return updateProfile(facetId, {
      customFields: remainingFields,
    });
  } catch (error) {
    console.error('Remove custom field error:', error.message);
    return { profile: null, error };
  }
}

/**
 * Update visibility settings for profile fields
 * @param {string} facetId - Facet ID
 * @param {object} visibilitySettings - Map of field -> visibility ('public', 'private', 'connections')
 * @returns {Promise<{profile: object|null, error: object|null}>}
 */
export async function updateVisibility(facetId, visibilitySettings) {
  try {
    const validVisibilities = ['public', 'private', 'connections'];
    
    for (const [field, visibility] of Object.entries(visibilitySettings)) {
      if (!validVisibilities.includes(visibility)) {
        throw new Error(`Invalid visibility "${visibility}" for field "${field}". Must be one of: ${validVisibilities.join(', ')}`);
      }
    }
    
    return updateProfile(facetId, {
      visibility: visibilitySettings,
    });
  } catch (error) {
    console.error('Update visibility error:', error.message);
    return { profile: null, error };
  }
}
