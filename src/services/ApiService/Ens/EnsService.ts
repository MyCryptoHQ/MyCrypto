import ApolloClient from 'apollo-boost';
import path from 'ramda/src/path';
import map from 'ramda/src/map';
import filter from 'ramda/src/filter';
import isEmpty from 'ramda/src/isEmpty';
import flatten from 'ramda/src/flatten';

import { StoreAccount } from '@types';
import { translateRaw } from '@translations';
import { isENSLabelHash } from '@services/EthService/validators';
import { DomainNameRecord } from '@features/Ens/types';

import { ENS_GRAPH_ENDPOINT } from './constants';
import { QUERY_GET_ENS_DOMAINS } from './queries';

interface DomainNameObject {
  labelName: string;
  labelhash: string;
  name: string;
  isMigrated: boolean;
  parent: {
    name: string;
  };
}
interface DomainRegistration {
  expiryDate: number;
  domain: DomainNameObject;
}

interface OwnershipRecord {
  address: string;
  label: string;
  registrations: DomainRegistration[];
}

const service = new ApolloClient({ uri: ENS_GRAPH_ENDPOINT });

const recordRegistrations = path(['account', 'registrations']);

const fetchOwnershipRecords = (accounts: StoreAccount[]): Promise<DomainNameRecord[]> => {
  return Promise.all(map(fetchOwnershipRecord, accounts))
    .then(filter((r: OwnershipRecord) => !isEmpty(r.registrations)))
    .then(map(processRecord))
    .then(flatten);
};

const fetchOwnershipRecord = ({
  label,
  address
}: {
  label: string;
  address: string;
}): Promise<OwnershipRecord> => {
  return service
    .query({
      query: QUERY_GET_ENS_DOMAINS,
      variables: { owner: address.toLowerCase() }
    })
    .then((res) => res.data)
    .then((data) => ({
      address,
      label,
      registrations: recordRegistrations(data) as DomainRegistration[]
    }));
};

const processRecord = ({
  address,
  label,
  registrations = []
}: {
  address: string;
  label: string;
  registrations: DomainRegistration[];
}) => {
  return map(
    ({ expiryDate, domain: { name } }) => ({
      owner: address,
      ownerLabel: label,
      domainName: name,
      readableDomainName: !isENSLabelHash(name) ? name : translateRaw('ENS_DOMAIN_UNKNOWN_NAME'),
      expiryDate
    }),
    registrations
  );
};

export const ENSService = {
  fetchOwnershipRecords
};

export default ENSService;
