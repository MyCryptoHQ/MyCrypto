import {
  SelectMethodPanel,
  SelectNetworkPanel,
  ConnectMetaMaskPanel,
  ConnectLedgerPanel,
  ConnectTrezorPanel,
  ConnectParitySignerPanel,
  ConnectSafeTMiniPanel
} from './components';

export enum ImportAddAccountStages {
  SelectMethod,
  SelectNetwork,
  ConnectMetaMask,
  ConnectLedger,
  ConnectTrezor,
  ConnectParitySigner,
  ConnectSafeTMini
}

export const importAddAccountStageToComponentHash = {
  [ImportAddAccountStages.SelectMethod]: SelectMethodPanel,
  [ImportAddAccountStages.SelectNetwork]: SelectNetworkPanel,
  [ImportAddAccountStages.ConnectMetaMask]: ConnectMetaMaskPanel,
  [ImportAddAccountStages.ConnectLedger]: ConnectLedgerPanel,
  [ImportAddAccountStages.ConnectTrezor]: ConnectTrezorPanel,
  [ImportAddAccountStages.ConnectParitySigner]: ConnectParitySignerPanel,
  [ImportAddAccountStages.ConnectSafeTMini]: ConnectSafeTMiniPanel
};
