import axios from 'axios';
import Profile from './Profile';

const API_ENDPOINT = 'https://3box.mycryptoapi.com/3box';

export const get3BoxProfile = async (address: string): Promise<Profile | false> => {
  const result = await axios({
    method: 'GET',
    url: `${API_ENDPOINT}?address=${address}`,
    validateStatus: () => true
  });

  if (result.status === 200) {
    const { data } = result;
    return new Profile(address, data);
  } else {
    return false;
  }
};
