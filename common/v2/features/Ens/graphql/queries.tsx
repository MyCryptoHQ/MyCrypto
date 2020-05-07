import { gql } from 'apollo-boost';

export const QUERY_GET_ENS_DOMAINS = gql`
  query getOwnerDomains($owner: String) {
    domains(where: { owner: $owner }, orderBy: labelName) {
      id
      name
      labelName
      labelhash
      isMigrated
      owner {
        id
      }
      parent {
        labelName
      }
    }
  }
`;
