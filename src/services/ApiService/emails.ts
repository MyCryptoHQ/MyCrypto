import axios from 'axios';

const URL = 'https://proxy.mycryptoapi.com/mc';

export function subscribeToMailingList(email: string) {
  const url = `${URL}`;

  return axios.post(url, {
    email_address: email,
    status: 'subscribed',
    tags: ['app.mycrypto.com']
  });
}
