import ApolloClient from 'apollo-boost';
import { ENS_GRAPH_ENDPOINT } from '../constants';

export const ENSSubgraphService = new ApolloClient({
  uri: ENS_GRAPH_ENDPOINT,
});