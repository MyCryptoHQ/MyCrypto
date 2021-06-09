const ApolloClient = jest.fn().mockImplementation(() => ({
  query: jest.fn().mockImplementation(() => Promise.resolve({ data: [] }))
}));

export { gql } from 'apollo-boost';

export default ApolloClient;
