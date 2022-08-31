import { useMemo } from 'react';

import { formatUnits } from '@ethersproject/units';
import { OptionProps } from 'react-select';

import { AccountSummary, Divider, Selector } from '@components';
import { DEFAULT_ASSET_DECIMAL } from '@config';
import { getAccountBalance, getBaseAsset } from '@services/Store';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';
import { Asset, StoreAccount, TTicker, TUuid } from '@types';
import { sortByLabel } from '@utils';
import { compose, map } from '@vendor';

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
        balance: formatUnits(
          asset ? getAccountBalance(a, asset) : getAccountBalance(a),
          asset?.decimal ?? DEFAULT_ASSET_DECIMAL
        ),
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
      optionComponent={({ data, selectOption }: OptionProps<TOption, false>) => {
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
              paddingLeft="15px"
            />
            <Divider />
          </>
        );
      }}
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
            paddingLeft={SPACING.XS}
          />
        );
      }}
    />
  );
}

export default AccountSelector;
