import { DomainNameRecord } from '@types';

export interface MyDomainsTableProps {
  domainName: string;
  owner: string;
  expireDate: number;
}

export interface MyDomainsProps {
  domainOwnershipRecords: DomainNameRecord[];
}
