import axios from 'axios';

const URL = 'https://proxy.mycryptoapi.com/mc';
const LIST_ID = '7dd574156f';

export function subscribeToMailingList(email: string) {
  const url = `${URL}/${LIST_ID}`;

  return axios.post(url, {
    email_address: email,
    status: 'subscribed',
    tags: ['app.mycrypto.com']
  });
}
