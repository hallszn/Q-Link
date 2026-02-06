/**
 * Authentication Service
 * Q-Link Backend Infrastructure
 */

import { supabase } from './supabase';

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {object} metadata - Optional user metadata (name, etc.)
 * @returns {Promise<{user: object|null, session: object|null, error: object|null}>}
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

    if (error) {
      return { user: null, session: null, error };
    }

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      session: null,
      error: { message: error.message },
    };
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

    if (error) {
      return { user: null, session: null, error };
    }

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      session: null,
      error: { message: error.message },
    };
  }
}

/**
 * Sign out the current user
 * @returns {Promise<{error: object|null}>}
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error: { message: error.message } };
  }
}

/**
 * Get the currently authenticated user
 * @returns {Promise<{user: object|null, session: object|null, error: object|null}>}
 */
export async function getCurrentUser() {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return { user: null, session: null, error: sessionError };
    }

    if (!session) {
      return { user: null, session: null, error: null };
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      return { user: null, session: null, error: userError };
    }

    return { user, session, error: null };
  } catch (error) {
    return {
      user: null,
      session: null,
      error: { message: error.message },
    };
  }
}

/**
 * Listen for auth state changes
 * @param {function} callback - Callback function receiving (event, session)
 * @returns {object} Subscription object with unsubscribe method
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return subscription;
}

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @returns {Promise<{error: object|null}>}
 */
export async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  } catch (error) {
    return { error: { message: error.message } };
  }
}

export default {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  onAuthStateChange,
  resetPassword,
};
