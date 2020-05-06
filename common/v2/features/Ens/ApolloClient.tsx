import ApolloClient from 'apollo-boost';

const GRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens';

export const CLIENT = new ApolloClient({
  uri: GRAPH_ENDPOINT,
});