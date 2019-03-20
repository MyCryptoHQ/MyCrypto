export interface AccountType {
  name: string;
  key: string;
  secure: boolean;
  derivationPath: string;
  web3: boolean;
  hardware: boolean;
}

export interface ExtendedAccountType extends AccountType {
  uuid: string;
}
