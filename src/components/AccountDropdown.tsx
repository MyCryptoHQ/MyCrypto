import React from 'react';
import { formatEther } from 'ethers/utils';
import { OptionProps } from 'react-select';

import { translateRaw } from '@translations';
import { AccountSummary, Divider, Selector } from '@components';
import { SPACING } from '@theme';
import { StoreAccount, Asset, TUuid, TSymbol } from '@types';
import { getAccountBalance, getBaseAsset } from '@services/Store';

export interface IAccountDropdownProps {
  accounts: StoreAccount[];
  name: string;
  value: StoreAccount | null;
  asset?: Asset;
  clearable?: boolean;
  onSelect(option: StoreAccount): void;
}

// Combine Account and Asset into Option to simplify prop
// passing. The form still expects `StoreAccount` as value,
// so we make sure that we only return `option.account`
export interface TAccountDropdownOption {
  account: StoreAccount;
  asset: {
    balance: string;
    assetSymbol: TSymbol;
    assetUUID: TUuid;
  };
}

const sortByLabel = (a: TAccountDropdownOption, b: TAccountDropdownOption) =>
  a.account.label.localeCompare(b.account.label);

const getOption = (account: StoreAccount | null, options: TAccountDropdownOption[]) => {
  if (!account) return null;
  return options.find((o) => o.account.uuid === account.uuid)!;
};

function AccountDropdown({ accounts, asset, name, value, onSelect }: IAccountDropdownProps) {
  const options: TAccountDropdownOption[] = accounts
    .map((a) => ({
      account: a,
      asset: {
        balance: formatEther(asset ? getAccountBalance(a, asset) : getAccountBalance(a)),
        assetUUID: asset ? asset.uuid : getBaseAsset(a)!.uuid,
        assetSymbol: (asset ? asset.ticker : getBaseAsset(a)!.ticker) as TSymbol
      }
    }))
    .sort(sortByLabel);
  const selected = getOption(value, options);
  const handleFormUpdate = (option: TAccountDropdownOption) => onSelect(option.account);

  return (
    <Selector<TAccountDropdownOption>
      name={name}
      placeholder={translateRaw('ACCOUNT_SELECTION_PLACEHOLDER')}
      searchable={true}
      options={options}
      onChange={handleFormUpdate}
      getOptionLabel={(option) => option.account.label}
      optionComponent={({ data, selectOption }: OptionProps<TAccountDropdownOption>) => {
        const { account, asset: selectedAsset } = data;
        const { address, label } = account;
        const { balance, assetUUID, assetSymbol } = selectedAsset;
        return (
          <>
            <AccountSummary
              address={address}
              balance={balance}
              uuid={assetUUID}
              assetSymbol={assetSymbol}
              label={label}
              onClick={() => selectOption(data)}
            />
            <Divider padding={SPACING.XS} />
          </>
        );
      }}
      value={selected}
      valueComponent={({ value: { account: selectedAccount, asset: selectedAsset } }) => {
        const { address, label } = selectedAccount;
        const { balance, assetSymbol, assetUUID } = selectedAsset;
        return (
          <AccountSummary
            address={address}
            balance={balance}
            label={label}
            uuid={assetUUID}
            assetSymbol={assetSymbol}
          />
        );
      }}
    />
  );
}

export default AccountDropdown;
