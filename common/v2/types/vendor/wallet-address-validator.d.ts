declare module 'wallet-address-validator' {
  export function validate(
    address: string,
    currency?: CurrencyNames | CurrencySymbols,
    networkType?: 'prod' | 'testnet' | 'both'
  ): boolean;
  export function getAddressType(address: string): string;
}

type CurrencyNames =
  | 'bitcoin'
  | 'litecoin'
  | 'peercoin'
  | 'dogecoin'
  | 'beavercoin'
  | 'freicoin'
  | 'protoshares'
  | 'megacoin'
  | 'primecoin'
  | 'auroracoin'
  | 'namecoin'
  | 'biocoin';

type CurrencySymbols =
  | 'BTC'
  | 'LTC'
  | 'PPC'
  | 'DOGE'
  | 'BVC'
  | 'FRC'
  | 'PTS'
  | 'MEC'
  | 'XPM'
  | 'AUR'
  | 'NMC'
  | 'BIO';
