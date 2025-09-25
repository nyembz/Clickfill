// Run this file once with `node generateKey.js`
import crypto from 'crypto';
const key = crypto.randomBytes(32).toString('hex');
console.log('ENCRYPTION_KEY=' + key);