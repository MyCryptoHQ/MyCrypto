export interface MyDomainsTableProps {
  domainName: string;
  owner: string;
  expireDate: number;
}

export interface MyDomainsProps {
  userAddress: string;
}

export interface DomainEntry {
  expiryDate: number;
  domain: DomainChild;
}

export interface DomainChild {
  isMigrated: boolean;
  labelName: string;
  labelhash: string;
  name: string;
  parent: DomainParent;
  __typename: string;
}

export interface DomainParent {
  name: string;
  __typename: string;
}

export interface DomainEntryTable {
  owner: string;
  domainName: string;
  expireDate: string;
  expireSoon: boolean;
}