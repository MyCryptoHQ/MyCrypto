import React, { useContext } from 'react';
import { CLIENT } from './ApolloClient';
import { Heading } from '@mycrypto/ui';
import { AccountContext, StoreContext } from 'v2/services';
import { ApolloProvider } from '@apollo/react-hooks';
import MyDomains from './MyDomains';

export default function EnsDashboard() {
  const { currentAccounts } = useContext(StoreContext);
  const { accounts } = useContext(AccountContext);

  const userAddresses = currentAccounts.map((account) => {
    return account.address;
  });

  return (
    <>
      <Heading as="h2">ENS Domains</Heading>
      <p>Showing you a list of top-level domains you own</p>
      <ApolloProvider client={CLIENT}>
        {userAddresses.map((addr, index) => {
          return <MyDomains userAddress={addr} />;
        })}
      </ApolloProvider>
    </>
  );
}
