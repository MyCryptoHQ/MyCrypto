import React, { useContext } from 'react';
import { ENSSubgraphService } from 'v2/services/ApiService/TheGraph';
import { StoreContext } from 'v2/services';
import { ApolloProvider } from '@apollo/react-hooks';
import MyDomains from './MyDomains';

export default function EnsDashboard() {
  const { currentAccounts } = useContext(StoreContext);

  return (
    <>
      <ApolloProvider client={ENSSubgraphService}>
        <MyDomains accounts={currentAccounts} />
      </ApolloProvider>
    </>
  );
}
