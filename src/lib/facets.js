/**
 * Facet Management Functions
 * 
 * Handles CRUD operations for identity facets.
 * A facet represents a distinct identity context (Professional, Social, Business, Custom).
 * 
 * Uses localStorage/AsyncStorage for mock data storage.
 */

// Facet types enum
export const FacetTypes = {
  PROFESSIONAL: 'Professional',
  SOCIAL: 'Social',
  BUSINESS: 'Business',
  CUSTOM: 'Custom',
};

const STORAGE_KEY = 'qlink_facets';

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
 * Generate a unique ID for facets
 */
function generateId() {
  return `facet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Load all facets from storage
 * @returns {Promise<Array>} Array of facet objects
 */
async function loadFacets() {
  const storage = getStorage();
  const data = await storage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

/**
 * Save facets to storage
 * @param {Array} facets - Array of facet objects
 */
async function saveFacets(facets) {
  const storage = getStorage();
  await storage.setItem(STORAGE_KEY, JSON.stringify(facets));
}

/**
 * Create a new facet
 * @param {string} name - Display name for the facet
 * @param {string} type - Facet type (Professional, Social, Business, Custom)
 * @returns {Promise<{facet: object|null, error: object|null}>}
 */
export async function createFacet(name, type) {
  try {
    // Validate inputs
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('Facet name is required');
    }
    
    if (!Object.values(FacetTypes).includes(type)) {
      throw new Error(`Invalid facet type. Must be one of: ${Object.values(FacetTypes).join(', ')}`);
    }
    
    const facets = await loadFacets();
    
    // Check for duplicate names
    if (facets.some(f => f.name.toLowerCase() === name.trim().toLowerCase())) {
      throw new Error('A facet with this name already exists');
    }
    
    const newFacet = {
      id: generateId(),
      name: name.trim(),
      type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    facets.push(newFacet);
    await saveFacets(facets);
    
    return { facet: newFacet, error: null };
  } catch (error) {
    console.error('Create facet error:', error.message);
    return { facet: null, error };
  }
}

/**
 * Get all facets
 * @returns {Promise<{facets: Array, error: object|null}>}
 */
export async function getFacets() {
  try {
    const facets = await loadFacets();
    return { facets, error: null };
  } catch (error) {
    console.error('Get facets error:', error.message);
    return { facets: [], error };
  }
}

/**
 * Get a single facet by ID
 * @param {string} id - Facet ID
 * @returns {Promise<{facet: object|null, error: object|null}>}
 */
export async function getFacetById(id) {
  try {
    const facets = await loadFacets();
    const facet = facets.find(f => f.id === id);
    
    if (!facet) {
      throw new Error('Facet not found');
    }
    
    return { facet, error: null };
  } catch (error) {
    console.error('Get facet error:', error.message);
    return { facet: null, error };
  }
}

/**
 * Update an existing facet
 * @param {string} id - Facet ID to update
 * @param {object} data - Fields to update (name, type)
 * @returns {Promise<{facet: object|null, error: object|null}>}
 */
export async function updateFacet(id, data) {
  try {
    if (!id) {
      throw new Error('Facet ID is required');
    }
    
    const facets = await loadFacets();
    const index = facets.findIndex(f => f.id === id);
    
    if (index === -1) {
      throw new Error('Facet not found');
    }
    
    // Validate type if provided
    if (data.type && !Object.values(FacetTypes).includes(data.type)) {
      throw new Error(`Invalid facet type. Must be one of: ${Object.values(FacetTypes).join(', ')}`);
    }
    
    // Check for duplicate names if name is being changed
    if (data.name && data.name.trim().toLowerCase() !== facets[index].name.toLowerCase()) {
      if (facets.some(f => f.id !== id && f.name.toLowerCase() === data.name.trim().toLowerCase())) {
        throw new Error('A facet with this name already exists');
      }
    }
    
    // Update facet
    facets[index] = {
      ...facets[index],
      ...data,
      name: data.name ? data.name.trim() : facets[index].name,
      updatedAt: new Date().toISOString(),
    };
    
    await saveFacets(facets);
    
    return { facet: facets[index], error: null };
  } catch (error) {
    console.error('Update facet error:', error.message);
    return { facet: null, error };
  }
}

/**
 * Delete a facet
 * @param {string} id - Facet ID to delete
 * @returns {Promise<{success: boolean, error: object|null}>}
 */
export async function deleteFacet(id) {
  try {
    if (!id) {
      throw new Error('Facet ID is required');
    }
    
    const facets = await loadFacets();
    const index = facets.findIndex(f => f.id === id);
    
    if (index === -1) {
      throw new Error('Facet not found');
    }
    
    facets.splice(index, 1);
    await saveFacets(facets);
    
    // Also delete associated profile
    const { deleteProfile } = await import('./profiles.js');
    await deleteProfile(id);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Delete facet error:', error.message);
    return { success: false, error };
  }
}
