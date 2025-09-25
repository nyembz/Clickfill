const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For GCM, the IV is typically 12 or 16 bytes.
const AUTH_TAG_LENGTH = 16;

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  throw new Error('A 32-byte (64 hex characters) ENCRYPTION_KEY is required.');
}

/**
 * Encrypts a piece of text.
 * @param {string} text - The text to encrypt.
 * @returns {string} - A string containing the iv, auth tag, and encrypted content, separated by ':'.
 */
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Combine iv, authTag, and encrypted content into a single string for storage
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts a piece of text.
 * @param {string} encryptedText - The encrypted string from the database.
 * @returns {string} - The original, decrypted text.
 */
function decrypt(encryptedText) {
  try {
    const [ivHex, authTagHex, encryptedContent] = encryptedText.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedContent, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    // Return null or a placeholder to indicate a decryption error
    return null; 
  }
}

module.exports = { encrypt, decrypt };