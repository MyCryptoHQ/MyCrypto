import { gql } from 'apollo-boost';

export const QUERY_GET_ENS_DOMAINS = gql`
  {
    domains(where: { owner: "0x11b6a5fe2906f3354145613db0d99ceb51f604c9" }) {
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
