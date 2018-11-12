import axios from 'axios';

const URL: string = 'https://proxy.mycryptoapi.com/eo';
const LIST_ID: string = 'd4b2e9f8-c4f3-11e8-a3c9-06b79b628af2';

export default function subscribeToMailingList(email: string) {
  const url = `${URL}/${LIST_ID}`;

  return axios.post(url, {
    email_address: email,
    status: 'SUBSCRIBED'
  });
}
