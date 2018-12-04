import AddressValidator from 'wallet-address-validator';

// import { SHAPESHIFT_TOKEN_WHITELIST } from 'v2/services';

interface ValidatorHash {
  [asset: string]: (address: string) => boolean;
}

export const isValidAddress = (address: string, ticker: string) =>
  (AddressValidator as any).validate(address, ticker);

export const isValidEthereumAddress = (address: string): boolean => isValidAddress(address, 'ETH');

export const isValidBitcoinAddress = (address: string): boolean => isValidAddress(address, 'BTC');

export const isValidMoneroAddress = (address: string): boolean => isValidAddress(address, 'XMR');

export const addressValidatorHash: ValidatorHash = {
  ETH: isValidEthereumAddress,
  BTC: isValidBitcoinAddress,
  XMR: isValidMoneroAddress,
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
