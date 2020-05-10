import ApolloClient from 'apollo-boost';
import moment from 'moment';

import { StoreAccount } from 'v2/types';
import { DomainTableEntry } from 'v2/features/Ens/types';

import { ENS_GRAPH_ENDPOINT } from '../constants';
import { QUERY_GET_ENS_DOMAINS } from './queries';

let instantiated: boolean = false;

class ENSSubgraphService {
  public static instance = new ENSSubgraphService();

  private service = new ApolloClient({
    uri: ENS_GRAPH_ENDPOINT
  });

  constructor() {
    if (instantiated) {
      throw new Error(`ENSSubgraphService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  public fetchOwnershipRecords(accounts: StoreAccount[]): Promise<DomainTableEntry[]> {
    return Promise.all(
      accounts.map(({ label, address }) => {
        return this.service
          .query({
            query: QUERY_GET_ENS_DOMAINS,
            variables: { owner: address.toLowerCase() }
          })
          .then((a) => {
            return (
              (a &&
                a.data &&
                a.data.account &&
                a.data.account.registrations &&
                a.data.account.registrations.map(({ expiryDate, domain: { name } }: any) => ({
                  owner: address,
                  ownerLabel: label,
                  domainName: name,
                  expireDate: expiryDate,
                  expireSoon: expiryDate - moment().unix() <= 2.592e6
                }))) ||
              []
            );
          })
          .catch((_) => []);
      })
    ).then((a) => a.filter((b) => b.length > 0).flatMap((d) => d));
  }
}

export default ENSSubgraphService;
