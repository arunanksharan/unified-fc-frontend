import { createHmac } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import {
  UNIFIED_BACKEND_API_KEY,
  UNIFIED_BACKEND_API_KEY_SECRET,
} from './loadEnv';

export const generateApiKeyAuth = (): {
  nonce: string;
  signature: string;
  apiKey: string;
} => {
  const apiSecret = UNIFIED_BACKEND_API_KEY_SECRET;
  const nonce = uuidv4().replace(/-/g, '');
  const signature = createHmac('sha256', apiSecret)
    .update(JSON.stringify(nonce))
    .digest('hex');
  console.log('computedSignature', signature);
  const apiKey = UNIFIED_BACKEND_API_KEY;
  return { apiKey, nonce, signature };
};
