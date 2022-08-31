export const fEnsApiResponse = {
  data: {
    account: {
      __typename: 'Account',
      registrations: [
        {
          __typename: 'Registration',
          domain: {
            __typename: 'Domain',
            isMigrated: true,
            labelName: 'mycrypto',
            labelhash: '0x9a781ca0d227debc3ee76d547c960b0803a6c9f58c6d3b4722f12ede7e6ef7c9',
            name: 'mycrypto.eth',
            parent: { __typename: 'Domain', name: 'eth' }
          },
          expiryDate: '1754111315'
        }
      ]
    }
  }
};

export const fEnsRecords = [
  {
    domainName: 'mycrypto.eth',
    expiryDate: '1754111315',
    owner: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
    readableDomainName: 'mycrypto.eth'
  }
];
