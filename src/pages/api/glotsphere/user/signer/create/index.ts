import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

import { BASE_URL, BASE_URL_BACKEND } from '@/lib/services/loadEnv';
import { generateApiKeyAuth } from '@/lib/services/apiKeyAuth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      res.status(401).end(); // Make sure to end the response here
      return;
    }

    // Only POST method is supported
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('session:', session);
    const fid = session?.user?.fid;
    console.log('fid:', fid);

    const { nonce, signature } = generateApiKeyAuth();

    console.log('BASE_URL_BACKEND:', BASE_URL_BACKEND);

    const apiResponse = await fetch(
      `${BASE_URL_BACKEND}/glotsphere/user/signer/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.UNIFIED_BACKEND_API_KEY || '',
          'x-nonce': nonce,
          'x-signature': signature,
        },
        body: JSON.stringify({ fid: fid }),
      }
    );
    console.log('apiResponse: 42', apiResponse);
    if (apiResponse.ok !== true) {
      console.log('apiResponse:', apiResponse.status);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const farcasterUser = await apiResponse.json();
    console.log('FarcasterUserSigner:', farcasterUser);
    return res.status(201).json(farcasterUser);
  } catch (error) {
    console.log('error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
