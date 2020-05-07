import React, { useContext } from 'react';
import { CLIENT } from './ApolloClient';
import { Heading } from '@mycrypto/ui';
import { AccountContext, StoreContext } from 'v2/services';
import { ApolloProvider } from '@apollo/react-hooks';
import MyDomains from './MyDomains';

export default function EnsDashboard() {
  const { currentAccounts } = useContext(StoreContext);
  const { accounts } = useContext(AccountContext);

  return (
    <>
      <Heading as="h2">ENS Domains</Heading>
      <ApolloProvider client={CLIENT}>
        <MyDomains />
      </ApolloProvider>
    </>
  );
}
