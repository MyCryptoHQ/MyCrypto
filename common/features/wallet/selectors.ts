import { Wei } from 'libs/units';
import { WalletConfig } from 'libs/wallet/config';
import { IWallet } from 'libs/wallet/IWallet';
import { LedgerWallet } from 'libs/wallet/deterministic/ledger';
import { TrezorWallet } from 'libs/wallet/deterministic/trezor';
import { SafeTWallet } from 'libs/wallet/deterministic/safe-t';
import Web3Wallet from 'libs/wallet/non-deterministic/web3';
import ParitySignerWallet from 'libs/wallet/non-deterministic/parity';
import { AppState } from 'features/reducers';

export function getWalletInst(state: AppState): IWallet | null | undefined {
  return state.wallet.inst;
}

export function getWalletConfig(state: AppState): WalletConfig | null | undefined {
  return state.wallet.config;
}

export function getWalletAccessMessage(state: AppState): string {
  return state.wallet.accessMessage;
}

export function isWalletFullyUnlocked(state: AppState): boolean | null | undefined {
  return state.wallet.inst && !state.wallet.inst.isReadOnly;
}

export interface IWalletType {
  isWeb3Wallet: boolean;
  isHardwareWallet: boolean;
  isParitySignerWallet: boolean;
}

export const getWallet = (state: AppState) => state.wallet;

export const getWalletType = (state: AppState): IWalletType => {
  const wallet = getWalletInst(state);
  const isWeb3Wallet = wallet instanceof Web3Wallet;
  const isLedgerWallet = wallet instanceof LedgerWallet;
  const isTrezorWallet = wallet instanceof TrezorWallet;
  const isSafeTWallet = wallet instanceof SafeTWallet;
  const isParitySignerWallet = wallet instanceof ParitySignerWallet;
  const isHardwareWallet = isLedgerWallet || isTrezorWallet || isSafeTWallet;
  return { isWeb3Wallet, isHardwareWallet, isParitySignerWallet };
};

export const isUnlocked = (state: AppState) => !!getWalletInst(state);

export const isEtherBalancePending = (state: AppState): boolean =>
  getWallet(state).balance.isPending;

export const getEtherBalance = (state: AppState): Wei | null => getWallet(state).balance.wei;

export function getRecentAddresses(state: AppState) {
  return state.wallet.recentAddresses;
}
