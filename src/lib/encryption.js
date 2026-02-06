/**
 * End-to-End Encryption Service
 * Q-Link Backend Infrastructure
 * 
 * Uses TweetNaCl for cryptographic operations:
 * - X25519 key exchange
 * - XSalsa20-Poly1305 authenticated encryption
 */

import nacl from 'tweetnacl';
import { encodeBase64, decodeBase64, encodeUTF8, decodeUTF8 } from 'tweetnacl-util';

/**
 * Generate a new key pair for asymmetric encryption
 * @returns {{publicKey: string, secretKey: string}} Base64 encoded key pair
 */
export function generateKeyPair() {
  const keyPair = nacl.box.keyPair();
  
  return {
    publicKey: encodeBase64(keyPair.publicKey),
    secretKey: encodeBase64(keyPair.secretKey),
  };
}

/**
 * Generate a random nonce for encryption
 * @returns {Uint8Array} Random nonce
 */
function generateNonce() {
  return nacl.randomBytes(nacl.box.nonceLength);
}

/**
 * Encrypt a message for a recipient using their public key
 * @param {string} message - Plain text message to encrypt
 * @param {string} recipientPublicKey - Recipient's Base64 public key
 * @param {string} senderSecretKey - Sender's Base64 secret key
 * @returns {{encrypted: string, nonce: string}|null} Encrypted message and nonce, or null on failure
 */
export function encrypt(message, recipientPublicKey, senderSecretKey) {
  try {
    const messageUint8 = decodeUTF8(message);
    const nonce = generateNonce();
    const recipientPubKeyUint8 = decodeBase64(recipientPublicKey);
    const senderSecKeyUint8 = decodeBase64(senderSecretKey);

    const encrypted = nacl.box(
      messageUint8,
      nonce,
      recipientPubKeyUint8,
      senderSecKeyUint8
    );

    if (!encrypted) {
      return null;
    }

    return {
      encrypted: encodeBase64(encrypted),
      nonce: encodeBase64(nonce),
    };
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
}

/**
 * Decrypt a message from a sender using their public key
 * @param {string} encryptedMessage - Base64 encrypted message
 * @param {string} nonce - Base64 nonce used during encryption
 * @param {string} senderPublicKey - Sender's Base64 public key
 * @param {string} recipientSecretKey - Recipient's Base64 secret key
 * @returns {string|null} Decrypted message or null on failure
 */
export function decrypt(encryptedMessage, nonce, senderPublicKey, recipientSecretKey) {
  try {
    const encryptedUint8 = decodeBase64(encryptedMessage);
    const nonceUint8 = decodeBase64(nonce);
    const senderPubKeyUint8 = decodeBase64(senderPublicKey);
    const recipientSecKeyUint8 = decodeBase64(recipientSecretKey);

    const decrypted = nacl.box.open(
      encryptedUint8,
      nonceUint8,
      senderPubKeyUint8,
      recipientSecKeyUint8
    );

    if (!decrypted) {
      return null;
    }

    return encodeUTF8(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

/**
 * Generate a shared secret key for symmetric encryption
 * @param {string} theirPublicKey - Other party's Base64 public key
 * @param {string} mySecretKey - Your Base64 secret key
 * @returns {string} Base64 encoded shared secret
 */
export function deriveSharedSecret(theirPublicKey, mySecretKey) {
  const theirPubKeyUint8 = decodeBase64(theirPublicKey);
  const mySecKeyUint8 = decodeBase64(mySecretKey);
  
  const sharedSecret = nacl.box.before(theirPubKeyUint8, mySecKeyUint8);
  return encodeBase64(sharedSecret);
}

/**
 * Encrypt with a precomputed shared secret (faster for multiple messages)
 * @param {string} message - Plain text message
 * @param {string} sharedSecret - Base64 shared secret from deriveSharedSecret
 * @returns {{encrypted: string, nonce: string}|null} Encrypted message and nonce
 */
export function encryptWithSharedSecret(message, sharedSecret) {
  try {
    const messageUint8 = decodeUTF8(message);
    const nonce = generateNonce();
    const sharedSecretUint8 = decodeBase64(sharedSecret);

    const encrypted = nacl.box.after(messageUint8, nonce, sharedSecretUint8);

    if (!encrypted) {
      return null;
    }

    return {
      encrypted: encodeBase64(encrypted),
      nonce: encodeBase64(nonce),
    };
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
}

/**
 * Decrypt with a precomputed shared secret
 * @param {string} encryptedMessage - Base64 encrypted message
 * @param {string} nonce - Base64 nonce
 * @param {string} sharedSecret - Base64 shared secret
 * @returns {string|null} Decrypted message or null on failure
 */
export function decryptWithSharedSecret(encryptedMessage, nonce, sharedSecret) {
  try {
    const encryptedUint8 = decodeBase64(encryptedMessage);
    const nonceUint8 = decodeBase64(nonce);
    const sharedSecretUint8 = decodeBase64(sharedSecret);

    const decrypted = nacl.box.open.after(encryptedUint8, nonceUint8, sharedSecretUint8);

    if (!decrypted) {
      return null;
    }

    return encodeUTF8(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

/**
 * Sign a message with a signing key
 * @param {string} message - Message to sign
 * @param {string} secretKey - Base64 signing secret key
 * @returns {string} Base64 signature
 */
export function sign(message, secretKey) {
  const signingKeyPair = nacl.sign.keyPair.fromSeed(
    decodeBase64(secretKey).slice(0, 32)
  );
  const messageUint8 = decodeUTF8(message);
  const signature = nacl.sign.detached(messageUint8, signingKeyPair.secretKey);
  return encodeBase64(signature);
}

/**
 * Verify a message signature
 * @param {string} message - Original message
 * @param {string} signature - Base64 signature
 * @param {string} publicKey - Base64 signing public key
 * @returns {boolean} True if signature is valid
 */
export function verify(message, signature, publicKey) {
  try {
    const messageUint8 = decodeUTF8(message);
    const signatureUint8 = decodeBase64(signature);
    const publicKeyUint8 = decodeBase64(publicKey);
    
    return nacl.sign.detached.verify(messageUint8, signatureUint8, publicKeyUint8);
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}

export default {
  generateKeyPair,
  encrypt,
  decrypt,
  deriveSharedSecret,
  encryptWithSharedSecret,
  decryptWithSharedSecret,
  sign,
  verify,
};
