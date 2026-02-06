/**
 * Verification Service (Mock Implementation)
 * Q-Link Backend Infrastructure
 * 
 * This is a mock implementation for development/testing.
 * Replace with actual verification provider (Twilio, etc.) in production.
 */

// Simulated verification codes storage (in-memory for mock)
const pendingVerifications = new Map();

// Mock delay to simulate network latency
const mockDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Send a verification code to a phone number
 * @param {string} phoneNumber - Phone number in E.164 format (+1234567890)
 * @returns {Promise<{success: boolean, error: object|null}>}
 */
export async function sendVerificationCode(phoneNumber) {
  try {
    await mockDelay(500);

    // Validate phone number format (basic E.164 check)
    if (!phoneNumber || !/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
      return {
        success: false,
        error: { message: 'Invalid phone number format. Use E.164 format (+1234567890)' },
      };
    }

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store with expiration (5 minutes)
    pendingVerifications.set(phoneNumber, {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
    });

    // In production, this would send an actual SMS
    console.log(`[MOCK] Verification code for ${phoneNumber}: ${code}`);

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: { message: error.message },
    };
  }
}

/**
 * Verify a code submitted by the user
 * @param {string} phoneNumber - Phone number in E.164 format
 * @param {string} code - The verification code
 * @returns {Promise<{verified: boolean, error: object|null}>}
 */
export async function verifyCode(phoneNumber, code) {
  try {
    await mockDelay(300);

    const verification = pendingVerifications.get(phoneNumber);

    if (!verification) {
      return {
        verified: false,
        error: { message: 'No pending verification for this phone number' },
      };
    }

    // Check expiration
    if (Date.now() > verification.expiresAt) {
      pendingVerifications.delete(phoneNumber);
      return {
        verified: false,
        error: { message: 'Verification code has expired' },
      };
    }

    // Check attempts (max 3)
    if (verification.attempts >= 3) {
      pendingVerifications.delete(phoneNumber);
      return {
        verified: false,
        error: { message: 'Too many failed attempts. Please request a new code.' },
      };
    }

    // Verify code
    if (verification.code !== code) {
      verification.attempts += 1;
      return {
        verified: false,
        error: { message: 'Invalid verification code' },
      };
    }

    // Success - clean up
    pendingVerifications.delete(phoneNumber);

    return { verified: true, error: null };
  } catch (error) {
    return {
      verified: false,
      error: { message: error.message },
    };
  }
}

/**
 * Send email verification link
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean, error: object|null}>}
 */
export async function sendEmailVerification(email) {
  try {
    await mockDelay(500);

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        success: false,
        error: { message: 'Invalid email address' },
      };
    }

    // In production, this would send an actual email
    console.log(`[MOCK] Email verification sent to: ${email}`);

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: { message: error.message },
    };
  }
}

/**
 * Verify identity document (mock)
 * @param {string} documentType - Type of document (passport, drivers_license, etc.)
 * @param {string} documentData - Base64 encoded document image
 * @returns {Promise<{verified: boolean, confidence: number, error: object|null}>}
 */
export async function verifyIdentityDocument(documentType, documentData) {
  try {
    await mockDelay(2000); // Simulate longer processing

    const validTypes = ['passport', 'drivers_license', 'national_id'];
    
    if (!validTypes.includes(documentType)) {
      return {
        verified: false,
        confidence: 0,
        error: { message: `Invalid document type. Supported: ${validTypes.join(', ')}` },
      };
    }

    if (!documentData) {
      return {
        verified: false,
        confidence: 0,
        error: { message: 'Document data is required' },
      };
    }

    // Mock verification - always succeeds in dev
    console.log(`[MOCK] Identity document (${documentType}) verified`);

    return {
      verified: true,
      confidence: 0.95,
      error: null,
    };
  } catch (error) {
    return {
      verified: false,
      confidence: 0,
      error: { message: error.message },
    };
  }
}

export default {
  sendVerificationCode,
  verifyCode,
  sendEmailVerification,
  verifyIdentityDocument,
};
