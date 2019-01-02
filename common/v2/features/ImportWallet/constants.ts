import {
  SelectMethodPanel,
  SelectNetworkAndNodePanel,
  ConnectMetaMaskPanel,
  ConnectLedgerPanel,
  ConnectTrezorPanel,
  ConnectParitySignerPanel,
  ConnectSafeTMiniPanel
} from './components';

export enum ImportWalletStages {
  SelectMethod,
  SelectNetworkAndNode,
  ConnectMetaMask,
  ConnectLedger,
  ConnectTrezor,
  ConnectParitySigner,
  ConnectSafeTMini
}

export const importWalletStageToComponentHash = {
  [ImportWalletStages.SelectMethod]: SelectMethodPanel,
  [ImportWalletStages.SelectNetworkAndNode]: SelectNetworkAndNodePanel,
  [ImportWalletStages.ConnectMetaMask]: ConnectMetaMaskPanel,
  [ImportWalletStages.ConnectLedger]: ConnectLedgerPanel,
  [ImportWalletStages.ConnectTrezor]: ConnectTrezorPanel,
  [ImportWalletStages.ConnectParitySigner]: ConnectParitySignerPanel,
  [ImportWalletStages.ConnectSafeTMini]: ConnectSafeTMiniPanel
};
