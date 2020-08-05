import React, { useMemo } from 'react';
import { formatEther } from 'ethers/utils';
import { OptionProps } from 'react-select';

import { translateRaw } from '@translations';
import { AccountSummary, Divider, Selector } from '@components';
import { SPACING } from '@theme';
import { StoreAccount, Asset, TUuid, TTicker } from '@types';
import { sortByLabel } from '@utils';
import { compose, map } from '@vendor';
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

const getOption = (account: StoreAccount | null, options: TOption[]) => {
  if (!account) return null;
  return options.find((o) => o.account.uuid === account.uuid)!;
};

function AccountSelector({ accounts, asset, name, value, onSelect }: Props) {
  const formatOptions = compose(
    map((a: StoreAccount) => ({
      account: a,
      asset: {
        balance: formatEther(asset ? getAccountBalance(a, asset) : getAccountBalance(a)),
        assetUUID: asset ? asset.uuid : getBaseAsset(a)!.uuid,
        assetTicker: asset ? asset.ticker : getBaseAsset(a)!.ticker
      }
    })),
    sortByLabel
  );

  const options = useMemo(() => formatOptions(accounts), [accounts, asset]);

  const handleFormUpdate = (option: TOption) => {
    onSelect(option.account);
  };

  return (
    <Selector<TOption>
      name={name}
      placeholder={translateRaw('ACCOUNT_SELECTION_PLACEHOLDER')}
      value={getOption(value, options)}
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
      // value={selected || options[0]}
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
