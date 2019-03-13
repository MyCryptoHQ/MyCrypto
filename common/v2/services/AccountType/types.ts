export interface AccountType {
  name: string;
  key: string;
  secure: boolean;
  derivationPath: string;
}

export interface ExtendedAccountType extends AccountType {
  uuid: string;
}
