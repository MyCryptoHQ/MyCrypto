import axios from 'axios';

const URL: string = 'https://proxy.mycryptoapi.com/mc';
const LIST_ID: string = '7dd574156f';

export default function subscribeToMailingList(email: string) {
  const url = `${URL}/${LIST_ID}`;

  return axios.post(url, {
    email_address: email,
    status: 'subscribed'
  });
}
