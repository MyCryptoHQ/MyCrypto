export interface Wallet {
  name: string;
  key: string;
  secure: boolean;
  web3: boolean;
  hardware: boolean;
  desktopOnly: boolean;
}

export interface ExtendedWallet extends Wallet {
  uuid: string;
}
