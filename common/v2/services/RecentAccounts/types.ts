import { AddressMetadata } from '../AddressMetadata';

export interface RecentAccounts {
  name: string;
  key: string;
  secure: boolean;
  derivationPath: string;
}

export interface ExtendedRecentAccounts extends AddressMetadata {
  uuid: string;
}
