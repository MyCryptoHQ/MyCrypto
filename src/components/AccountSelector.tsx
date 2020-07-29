import React, { useState, useEffect } from 'react';
import { formatEther } from 'ethers/utils';
import { OptionProps } from 'react-select';
import isEmpty from 'lodash/isEmpty';

import { translateRaw } from '@translations';
import { AccountSummary, Divider, Selector } from '@components';
import { SPACING } from '@theme';
import { StoreAccount, Asset, TUuid, TTicker } from '@types';
import { sortByLabel } from '@utils';
import { useEffectOnce, compose, map } from '@vendor';
import { getAccountBalance, getBaseAsset } from '@services/Store';

interface Props {
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
interface TOption {
  account: StoreAccount;
  asset: {
    balance: string;
    assetTicker: TTicker;
    assetUUID: TUuid;
  };
}

// const sortByLabel = (a: TOption, b: TOption) => a.account.label.localeCompare(b.account.label);

const getOption = (account: StoreAccount | null, options: TOption[]) => {
  if (!account) return null;
  return options.find((o) => o.account.uuid === account.uuid)!;
};

function AccountSelector({ accounts, asset, name, value, onSelect }: Props) {
  const [options, setOptions] = useState<TOption[]>([]);
  useEffect(() => {
    const sortedOptions: TOption[] = compose(
      map((a: StoreAccount) => ({
        account: a,
        asset: {
          balance: formatEther(asset ? getAccountBalance(a, asset) : getAccountBalance(a)),
          assetUUID: asset ? asset.uuid : getBaseAsset(a)!.uuid,
          assetSymbol: asset ? asset.ticker : getBaseAsset(a)!.ticker
        }
      })),
      sortByLabel
    )(accounts);

    setOptions(sortedOptions);
  }, [accounts, asset]);

  useEffectOnce(() => {
    if (!isEmpty(options) && isEmpty(value)) {
      handleFormUpdate(options[0]);
    }
  });

  const selected = getOption(value, options);
  const handleFormUpdate = (option: TOption) => onSelect(option.account);

  return (
    <Selector<TOption>
      name={name}
      placeholder={translateRaw('ACCOUNT_SELECTION_PLACEHOLDER')}
      searchable={true}
      options={options}
      onChange={handleFormUpdate}
      getOptionLabel={(option) => option.account.label}
      optionComponent={({ data, selectOption }: OptionProps<TOption>) => {
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
      value={selected || options[0]}
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

export default AccountSelector;
