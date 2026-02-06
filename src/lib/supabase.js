/**
 * Supabase Client Configuration
 * 
 * TODO: Replace placeholder values with real Supabase credentials
 * - SUPABASE_URL: Your Supabase project URL (from Project Settings > API)
 * - SUPABASE_ANON_KEY: Your anon/public key (from Project Settings > API)
 */

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// PLACEHOLDER - Replace with real values from your Supabase project
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

// Custom storage adapter using Expo SecureStore for sensitive data
const ExpoSecureStoreAdapter = {
  getItem: async (key) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStore getItem error:', error);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('SecureStore setItem error:', error);
    }
  },
  removeItem: async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStore removeItem error:', error);
    }
  },
};

// Create Supabase client with secure storage
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Required for React Native
  },
});

export default supabase;
