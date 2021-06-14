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

export interface DomainNameRecord {
  owner: string;
  domainName: string;
  expiryDate: string;
  readableDomainName: string;
}
