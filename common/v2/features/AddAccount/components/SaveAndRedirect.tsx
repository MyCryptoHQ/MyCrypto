import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router';
import { FormData } from 'v2/features/AddAccount/types';
import { AccountContext } from 'v2/providers';
import { getNetworkByName } from 'v2/libs';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';
import { Account } from 'v2/services/Account/types';

/*
  Create a new account in localStorage and redirect to dashboard.
*/
function SaveAndRedirect(payload: { formData: FormData }) {
  const { createAccount } = useContext(AccountContext);
  useEffect(() => {
    const network: NetworkOptions | undefined = getNetworkByName(payload.formData.network);
    const account: Account = {
      address: payload.formData.account,
      network: payload.formData.network,
      accountType: payload.formData.accountType,
      derivationPath: payload.formData.derivationPath,
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
