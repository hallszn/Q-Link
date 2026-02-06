/**
 * Authentication Functions
 * 
 * Handles user authentication via Supabase Auth
 */

import { supabase } from './supabase';

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password (min 6 characters)
 * @param {object} metadata - Optional user metadata (displayName, etc.)
 * @returns {Promise<{user: object|null, error: object|null}>}
 */
export async function signUp(email, password, metadata = {}) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) throw error;

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Sign up error:', error.message);
    return { user: null, session: null, error };
  }
}

/**
 * Sign in an existing user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<{user: object|null, session: object|null, error: object|null}>}
 */
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Sign in error:', error.message);
    return { user: null, session: null, error };
  }
}

/**
 * Sign out the current user
 * @returns {Promise<{error: object|null}>}
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error.message);
    return { error };
  }
}

/**
 * Get the currently authenticated user
 * @returns {Promise<{user: object|null, error: object|null}>}
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Get current user error:', error.message);
    return { user: null, error };
  }
}

/**
 * Get the current session
 * @returns {Promise<{session: object|null, error: object|null}>}
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    console.error('Get session error:', error.message);
    return { session: null, error };
  }
}

/**
 * Listen for auth state changes
 * @param {function} callback - Called with (event, session) on auth changes
 * @returns {function} Unsubscribe function
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @returns {Promise<{error: object|null}>}
 */
export async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Reset password error:', error.message);
    return { error };
  }
}

/**
 * Update user password (when logged in)
 * @param {string} newPassword - New password
 * @returns {Promise<{user: object|null, error: object|null}>}
 */
export async function updatePassword(newPassword) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Update password error:', error.message);
    return { user: null, error };
  }
}
