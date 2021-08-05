import { Network, StoreAccount, WalletId } from '@types';

// @todo Figure out if anything else needs to be disabled?
const ENABLED_WALLETS = [WalletId.LEDGER_NANO_S, WalletId.LEDGER_NANO_S_NEW];

const featureFlagName = 'MYC_EIP1559';

// @todo DELETE THIS HACK
export const getEIP1559FeatureFlag = () => {
  const ls = localStorage.getItem(featureFlagName);
  return ls !== 'false';
};

export const setEIP1559FeatureFlag = (value: boolean) => {
  localStorage.setItem(featureFlagName, value.toString());
};

export const isEIP1559Supported = (network: Network, account: StoreAccount) => {
  return (
    getEIP1559FeatureFlag() && network.supportsEIP1559 && ENABLED_WALLETS.includes(account.wallet)
  );
};
