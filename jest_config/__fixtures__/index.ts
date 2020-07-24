export { fAssets } from './assets';
export { fAccount } from './account';
export { fNetwork } from './network';
export {
  fTransaction,
  fETHNonWeb3TxResponse,
  fETHNonWeb3TxReceipt,
  fETHWeb3TxResponse,
  fETHWeb3TxReceipt,
  fERC20Web3TxResponse,
  fERC20Web3TxReceipt,
  fERC20NonWeb3TxResponse,
  fERC20NonWeb3TxReceipt,
  fFinishedERC20NonWeb3TxReceipt,
  fFinishedERC20Web3TxReceipt
} from './transaction';
export { fSettings } from './settings';

import { default as txConfig } from './txConfig.json';

import { fNetwork as network } from './network';
export const fTxConfig = { ...txConfig, network };

export { default as fTxConfigs } from './txConfigs.json';
export { default as fTxReceipt } from './txReceipt.json';
export { default as fTxReceipts } from './txReceipts.json';
export { default as fTxReceiptProvider } from './txReceiptProvider.json';
export { default as fTxParcels } from './txParcels';
export { default as customNodeConfig } from './customNode';
export { fContracts } from './contracts';
export { unknownReport, scamReport, verifiedReport, loadingReport } from './ptxreport';

// Non-Web3 ERC20 Tx Items
export { default as fERC20NonWeb3TxConfig } from './erc20NonWeb3TxConfig.json';

// Web3 ERC20 Tx Items
export { default as fERC20Web3TxConfig } from './erc20Web3TxConfig.json';

// Non-Web3 ETH Tx Items
export { default as fETHNonWeb3TxConfig } from './ethNonWeb3TxConfig.json';

// Web3 ETH Tx Items
export { default as fETHWeb3TxConfig } from './ethWeb3TxConfig.json';
