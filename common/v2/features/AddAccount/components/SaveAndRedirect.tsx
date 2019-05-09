import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router';

import { AccountContext } from 'v2/providers';
import { getNetworkByName } from 'v2/libs';

/*
  Create a new account in localStorage and redirect to dashboard.
*/
function SaveAndRedirect(formData) {
  const { createAccount } = useContext(AccountContext);

  useEffect(() => {
    const network: NetworkOptions | undefined = getNetworkByName(formData.network);
    const account = {
      ...formData,
      assets: network ? network.unit : 'DefaultAsset',
      value: 0,
      label: 'New Account', // @TODO: we really should have the correct label before!
      localSettings: 'default',
      transactionHistory: ''
    };
    createAccount(account);
  });

  return (
    <Route>
      <Redirect to="/dashboard" />
    </Route>
  );
}

export default SaveAndRedirect;
