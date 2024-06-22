import { BASE_URL, DOMAIN_EXAMPLE, NEXTAUTH_URL } from './loadEnv';

console.log(BASE_URL);
console.log("🚀 ~ process.env['NEXTAUTH_URL']:", NEXTAUTH_URL);

export const FARCASTER_AUTH_CONFIG = {
  // For a production app, replace this with an Optimism Mainnet
  // RPC URL from a provider like Alchemy or Infura.
  relay: 'https://relay.farcaster.xyz',
  // rpcUrl: 'https://mainnet.optimism.io',
  rpcUrl:
    'https://opt-mainnet.g.alchemy.com/v2/TcSIWI9vCZw_u6ztvDp0DC2UFl5pgxap',
  domain: DOMAIN_EXAMPLE,
  siweUri: `https://${DOMAIN_EXAMPLE}/login`,
  // domain: 'http://localhost:3000',
  // siweUri: 'http://localhost:3000/login',
};

console.log('FARCASTER_AUTH_CONFIG::', FARCASTER_AUTH_CONFIG);
