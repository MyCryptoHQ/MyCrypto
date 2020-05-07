export interface MyDomainsTableProps {
  domainName: string;
  owner: string;
  expireDate: number;
}

export interface MyDomainsProps {
  userAddress: string;
}

export interface DomainEntry {
  id: string;
  isMigrated: boolean;
  labelName: string;
  labelhash: string;
  name: string;
  owner: DomainOwner;
  parent: DomainParent;
}

export interface DomainOwner {
  id: string;
  __typename: string;
}

export interface DomainParent {
  labelName: string;
  __typename: string;
}

export interface DomainEntryTable {
  owner: string;
  domainName: string;
  expireDate: string;
}
