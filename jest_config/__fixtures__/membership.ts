import { getUnlockTimestamps } from '@mycrypto/unlock-scan';
import { PromiseType } from 'utility-types';

import { TAddress } from '@types';
import { bigify } from '@utils';

export const accountWithMembership = '0x82d69476357a03415e92b5780c89e5e9e972ce75' as TAddress;

// @mycrypto/unlock-scan returns stringified BigNumbers
export const membershipApiResponse = ({
  '0x82d69476357a03415e92b5780c89e5e9e972ce75': {
    '0x6cA105D2AF7095B1BCEeb6A2113D168ddDCD57cf': bigify('0x5ed0d3aa'),
    '0xfe58C642A3F703e7Dc1060B3eE02ED4619046125': bigify('0x00'),
    '0x7a84f1074B5929cBB7bd08Fb450CF9Fb22bf5329': bigify('0x00'),
    '0xee2B7864d8bc731389562F820148e372F57571D8': bigify('0x00'),
    '0x098D8b363933D742476DDd594c4A5a5F1a62326a': bigify('0x5fed1480')
  },
  '0xfeac75a09662396283f4bb50f0a9249576a81866': {
    '0x6cA105D2AF7095B1BCEeb6A2113D168ddDCD57cf': bigify('0x00'),
    '0xfe58C642A3F703e7Dc1060B3eE02ED4619046125': bigify('0x00'),
    '0x7a84f1074B5929cBB7bd08Fb450CF9Fb22bf5329': bigify('0x00'),
    '0xee2B7864d8bc731389562F820148e372F57571D8': bigify('0x00'),
    '0x098D8b363933D742476DDd594c4A5a5F1a62326a': bigify('0x00')
  }
} as unknown) as PromiseType<ReturnType<typeof getUnlockTimestamps>>;
