import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { BASE_URL, BASE_URL_BACKEND } from '@/lib/services/loadEnv';

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
    if (req.method !== 'GET') {
      // Only GET method is supported
      res.status(405).end(); // End response for non-GET methods
      return;
    }

    const fid = session.user?.fid;

    const apiResponse = await fetch(
      `${BASE_URL_BACKEND}/showcast/getRoom/?fid=${fid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.UNIFIED_BACKEND_API_KEY || '',
        },
      }
    );
    // console.log('apiResponse line 35 assignedRoom:', apiResponse); // {roomId: 'roomId'}

    const roomId = await apiResponse.json();
    console.log('roomId:', roomId);
    return res.status(200).json(roomId);
  } catch (error) {
    console.log('error:', error);
    return res.status(500).json({ error: 'internal server error' });
  }
}
