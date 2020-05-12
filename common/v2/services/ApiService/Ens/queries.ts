import { gql } from 'apollo-boost';

export const QUERY_GET_ENS_DOMAINS = gql`
  query getAccountRegistrations($owner: String) {
    account(id: $owner) {
      registrations(orderBy: expiryDate) {
        expiryDate
        domain {
          labelName
          labelhash
          name
          isMigrated
          parent {
            name
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;
