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

    const fid = session.user?.fid;

    const { nonce, signature } = generateApiKeyAuth();

    const apiResponse = await fetch(
      `${BASE_URL_BACKEND}/glotsphere/user/get?fid=${fid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.UNIFIED_BACKEND_API_KEY || '',
          'x-nonce': nonce,
          'x-signature': signature,
        },
      }
    );
    if (apiResponse.status !== 200) {
      console.log('apiResponse:', apiResponse);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const farcasterUser = await apiResponse.json();
    console.log('FarcasterUserSigner:', farcasterUser);
    return res.status(200).json(farcasterUser);
  } catch (error) {
    console.log('error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
