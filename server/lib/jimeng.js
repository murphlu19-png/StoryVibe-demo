import crypto from 'crypto';
import fetch from 'node-fetch';

const JIMENG_HOST = 'open.volcengineapi.com';
const SERVICE = 'cv';
const REGION = 'cn-north-1';

function hmacSha256(key, message) {
  return crypto.createHmac('sha256', key).update(message).digest();
}

function getSignature(accessKeyId, secretKey, body, timestamp) {
  const date = timestamp.slice(0, 8); // YYYYMMDD
  const credentialScope = `${date}/${REGION}/${SERVICE}/request`;

  // Canonical request
  const method = 'POST';
  const uri = '/';
  const query = 'Action=CVProcess&Version=2022-08-30';
  const headers = `host:${JIMENG_HOST}\n`;
  const signedHeaders = 'host';
  const payloadHash = crypto.createHash('sha256').update(body).digest('hex');
  const canonicalRequest = `${method}\n${uri}\n${query}\n${headers}\n${signedHeaders}\n${payloadHash}`;

  // String to sign
  const algorithm = 'HMAC-SHA256';
  const canonicalRequestHash = crypto.createHash('sha256').update(canonicalRequest).digest('hex');
  const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${canonicalRequestHash}`;

  // Signing key
  const kDate = hmacSha256(secretKey, date);
  const kRegion = hmacSha256(kDate, REGION);
  const kService = hmacSha256(kRegion, SERVICE);
  const kSigning = hmacSha256(kService, 'request');

  // Signature
  const signature = hmacSha256(kSigning, stringToSign).toString('hex');

  return {
    authorization: `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    timestamp,
  };
}

export async function callJimeng(params) {
  const accessKeyId = process.env.JIMENG_ACCESS_KEY_ID;
  const secretKey = process.env.JIMENG_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretKey) {
    throw new Error('Jimeng credentials not configured. Set JIMENG_ACCESS_KEY_ID and JIMENG_SECRET_ACCESS_KEY env vars.');
  }

  const body = JSON.stringify(params);
  const timestamp = new Date().toISOString().replace(/[:\-]|\..+/g, '');

  const { authorization } = getSignature(accessKeyId, secretKey, body, timestamp);

  const url = `https://${JIMENG_HOST}/?Action=CVProcess&Version=2022-08-30`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Host': JIMENG_HOST,
      'Content-Type': 'application/json',
      'X-Date': timestamp,
      'Authorization': authorization,
    },
    body,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Jimeng API error ${response.status}: ${errText.substring(0, 200)}`);
  }

  return response.json();
}
