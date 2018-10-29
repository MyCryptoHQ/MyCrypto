import axios from 'axios';
import queryString from 'query-string';

export const SHAPESHIFT_API_URL = 'https://auth.shapeshift.io/oauth/authorize';
export const SHAPESHIFT_CLIENT_ID = 'fcbbb372-4221-4436-b345-024d91384652';
export const SHAPESHIFT_CLIENT_SECRET = '2pQu4eqU8YreBYQebby4pxNjCCnJN5YL6norqCPEewj3';
export const SHAPESHIFT_REDIRECT_URI = 'https://mycrypto.com/swap';

export const sendUserToAuthorize = () => {
  const query = queryString.stringify({
    client_id: SHAPESHIFT_CLIENT_ID,
    scope: 'users:read',
    response_type: 'code',
    redirect_uri: SHAPESHIFT_REDIRECT_URI
  });
  const url = `${SHAPESHIFT_API_URL}?${query}`;

  window.location.href = url;
};

export const requestAccessToken = async code => {
  const authorization = new Buffer(SHAPESHIFT_CLIENT_ID + ':' + SHAPESHIFT_CLIENT_SECRET).toString(
    'base64'
  );
  const response = await axios.post(
    'https://auth.shapeshift.io/oauth/token',
    {
      code,
      grant_type: 'authorization_code'
    },
    {
      headers: {
        'content-type': 'application/json',
        Authorization: `Basic ${authorization}`
      }
    }
  );

  return response.data.access_token;
};
