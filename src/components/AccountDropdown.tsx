import React from 'react';
import { formatEther } from 'ethers/utils';
import { OptionProps } from 'react-select';
import isEmpty from 'lodash/isEmpty';

import { translateRaw } from '@translations';
import { AccountSummary, Divider, Selector } from '@components';
import { SPACING } from '@theme';
import { StoreAccount, Asset, TUuid, TTicker } from '@types';
import { getAccountBalance, getBaseAsset } from '@services/Store';
import { useEffectOnce } from '@vendor';

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
    assetTicker: TTicker;
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
        assetTicker: asset ? asset.ticker : getBaseAsset(a)!.ticker
      }
    }))
    .sort(sortByLabel);
  const selected = getOption(value, options);
  const handleFormUpdate = (option: TAccountDropdownOption) => onSelect(option.account);

  useEffectOnce(() => {
    if (!isEmpty(options) && isEmpty(value)) {
      onSelect(options[0].account);
    }
  });

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
        const { balance, assetUUID, assetTicker } = selectedAsset;
        return (
          <>
            <AccountSummary
              address={address}
              balance={balance}
              uuid={assetUUID}
              assetTicker={assetTicker}
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
        const { balance, assetTicker, assetUUID } = selectedAsset;
        return (
          <AccountSummary
            address={address}
            balance={balance}
            label={label}
            uuid={assetUUID}
            assetTicker={assetTicker}
          />
        );
      }}
    />
  );
}

export default AccountDropdown;
