import AddressValidator from 'wallet-address-validator';

import { SHAPESHIFT_TOKEN_WHITELIST } from 'v2/services';

interface ValidatorHash {
  [asset: string]: (address: string) => boolean;
}

export const isValidEthereumAddress = (address: string): boolean =>
  (AddressValidator as any).validate(address, 'ETH');

export const isValidBitcoinAddress = (address: string): boolean =>
  (AddressValidator as any).validate(address, 'BTC');

export const addressValidatorHash: ValidatorHash = {
  ETH: isValidEthereumAddress,
  BTC: isValidBitcoinAddress,
  ...[
    'OMG',
    'REP',
    'SNT',
    'SNGLS',
    'ZRX',
    'SWT',
    'ANT',
    'BAT',
    'BNT',
    'CVC',
    'DNT',
    '1ST',
    'GNO',
    'GNT',
    'EDG',
    'FUN',
    'RLC',
    'TRST',
    'GUP'
  ].reduce((prev: ValidatorHash, next) => {
    prev[next] = isValidEthereumAddress;
    return prev;
  }, {})
};
