import React from 'react';
import { translateRaw } from 'translations';

// import { getNetworkByName } from 'v2/services/Store';
import { AccountSummary, AccountOption, Dropdown } from 'v2/components';
import { ExtendedAccount, Network } from 'v2/types';
import { Asset } from 'v2/config/tokens';
import { getNetworkByName } from 'v2/services/Store/Network';

// Option item displayed in Dropdown menu. Props are passed by react-select Select.
// To know: Select needs to receive a class in order to attach refs https://github.com/JedWatson/react-select/issues/2459
// Since Account summary is using Address which still has the 'copy', we must handle hover ourself.

interface IAccountDropdownProps {
  accounts: ExtendedAccount[];
  name: string;
  value: ExtendedAccount;
  asset?: Asset;
  network?: Network;
  onSelect(option: ExtendedAccount): void;
}

function AccountDropdown({
  accounts,
  name,
  value,
  asset,
  network,
  onSelect
}: IAccountDropdownProps) {
  let relevantAccounts: ExtendedAccount[] = accounts;
  if (asset && network) {
    relevantAccounts = accounts.filter((account: ExtendedAccount): boolean => {
      const accountNetwork: Network | undefined = getNetworkByName(account.network);
      return !accountNetwork ? false : accountNetwork.name === network.name;
    });
  }
  return (
    <Dropdown
      name={name}
      placeholder={translateRaw('SEND_ASSETS_ACCOUNT_SELECTION_PLACEHOLDER')}
      options={relevantAccounts}
      onChange={option => onSelect(option)}
      optionComponent={AccountOption}
      value={value && value.address ? value : undefined} // Allow the value to be undefined at the start in order to display the placeholder
      valueComponent={({ value: { label, address, balance } }) => (
        <AccountSummary address={address} balance={balance} label={label} selectable={false} />
      )}
    />
  );
}

export default AccountDropdown;
