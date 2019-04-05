import {
  //SelectMethodPanel,
  SelectNetworkPanel,
  SelectAddressPanel,
  ConnectMetaMaskPanel,
  ConnectLedgerPanel,
  ConnectTrezorPanel,
  ConnectParitySignerPanel,
  ConnectSafeTMiniPanel
} from './components';

export enum ImportAddAccountStages {
  SelectMethod,
  SelectNetwork,
  SelectAddress,
  ConnectMetaMask,
  ConnectLedger,
  ConnectTrezor,
  ConnectParitySigner,
  ConnectSafeTMini
}

export const importAddAccountStageToComponentHash = {
  //[ImportAddAccountStages.SelectMethod]: SelectMethodPanel,
  [ImportAddAccountStages.SelectNetwork]: SelectNetworkPanel,
  [ImportAddAccountStages.SelectAddress]: SelectAddressPanel,
  [ImportAddAccountStages.ConnectMetaMask]: ConnectMetaMaskPanel,
  [ImportAddAccountStages.ConnectLedger]: ConnectLedgerPanel,
  [ImportAddAccountStages.ConnectTrezor]: ConnectTrezorPanel,
  [ImportAddAccountStages.ConnectParitySigner]: ConnectParitySignerPanel,
  [ImportAddAccountStages.ConnectSafeTMini]: ConnectSafeTMiniPanel
};
