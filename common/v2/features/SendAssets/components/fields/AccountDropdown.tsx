import React from 'react';
import { OptionComponentProps } from 'react-select';
import { translateRaw } from 'translations';
// import { getNetworkByName } from 'v2/services/Store';
import { AccountSummary, Divider, Dropdown } from 'v2/components';
import { ExtendedAccount } from 'v2/types';

// Option item displayed in Dropdown menu. Props are passed by react-select Select.
// To know: Select needs to receive a class in order to attach refs https://github.com/JedWatson/react-select/issues/2459
// Since Account summary is using Address which still has the 'copy', we must handle hover ourself.
class AccountOption extends React.PureComponent<OptionComponentProps> {
  public render() {
    const { option, onSelect } = this.props;

    return (
      <>
        <AccountSummary
          address={option.address}
          balance={'1000.809300'}
          label={option.label}
          onClick={() => onSelect!(option, null)} // Since it's a custom Dropdown we know onSelect is defined
        />
        <Divider padding={'14px'} />
      </>
    );
  }
}

interface IAccountDropdownProps {
  accounts: ExtendedAccount[];
  name: string;
  value: ExtendedAccount;
  onSelect(option: ExtendedAccount): void;
}

function AccountDropdown({ accounts, name, value, onSelect }: IAccountDropdownProps) {
  const relevantAccounts: ExtendedAccount[] = accounts;
  // if (values.sharedConfig.asset && values.sharedConfig.assetNetwork) {
  //   relevantAccounts = accounts.filter((account: ExtendedAccount): boolean => {
  //     const accountNetwork: Network | undefined = getNetworkByName(account.network);
  //     const assetNetwork: Network | undefined =
  //       values.sharedConfig.asset && values.sharedConfig.assetNetwork
  //         ? getNetworkByName(values.sharedConfig.assetNetwork.name)
  //         : undefined;
  //     return !accountNetwork || !assetNetwork ? false : accountNetwork.name === assetNetwork.name;
  //   });
  // }

  return (
    <Dropdown
      name={name}
      placeholder={translateRaw('SEND_ASSETS_ACCOUNT_SELECTION_PLACEHOLDER')}
      options={relevantAccounts}
      onChange={option => onSelect(option)}
      optionComponent={AccountOption}
      value={value && value.address ? value : undefined} // Allow the value to be undefined at the start in order to display the placeholder
      valueComponent={({ value: { label, address } }) => (
        <AccountSummary
          address={address}
          balance={'1000.809300'}
          label={label}
          selectable={false}
        />
      )}
    />
  );
}

export default AccountDropdown;
