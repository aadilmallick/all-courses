import { randomBytes, createHash } from 'node:crypto';

const verifier = randomBytes(32).toString('base64url');
const state = randomBytes(32).toString('base64url');
const challenge = createHash('sha256').update(verifier).digest('base64url');

const request = new URL('https://identity.example/authorize');
request.searchParams.set('response_type', 'code');
request.searchParams.set('client_id', 'public-desktop-client');
request.searchParams.set('redirect_uri', 'http://127.0.0.1:43123/callback');
request.searchParams.set('code_challenge_method', 'S256');
request.searchParams.set('code_challenge', challenge);
request.searchParams.set('state', state);

console.log('Verifier length:', verifier.length);
console.log('Challenge length:', challenge.length);
console.log('Sample request:', request.href);
