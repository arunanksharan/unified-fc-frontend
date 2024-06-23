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
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('session:', session);
    const fid = session?.user?.fid;
    console.log('fid:', fid);

    const { text, languages, signer_uuid } = req.body;

    const { nonce, signature } = generateApiKeyAuth();

    console.log('BASE_URL_BACKEND:', BASE_URL_BACKEND);

    const apiResponse = await fetch(
      `${BASE_URL_BACKEND}/glotsphere/cast/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.UNIFIED_BACKEND_API_KEY || '',
          'x-nonce': nonce,
          'x-signature': signature,
        },
        body: JSON.stringify({
          fid: fid,
          castText: text,
          languages: languages,
          signer_uuid: signer_uuid,
        }),
      }
    );
    console.log('apiResponse: 42', apiResponse);
    if (apiResponse.ok !== true) {
      console.log('apiResponse:', apiResponse.status);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const createdCastResponse = await apiResponse.json();
    console.log('Created Cast Response:', createdCastResponse);
    return res.status(201).json(createdCastResponse);
  } catch (error) {
    console.log('error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
