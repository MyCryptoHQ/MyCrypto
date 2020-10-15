import { fNetwork as network } from './network';
import { default as txConfig } from './txConfig.json';

export { fAssets, fStoreAssets, fRopDAI } from './assets';
export { fAccount, fAccounts, fDWAccounts } from './account';
export { fContacts } from './contacts';
export { fNetwork, fNetworks } from './network';
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
  fFinishedERC20Web3TxReceipt,
  fDerivedApprovalTx,
  fDerivedRepMigrationTx
} from './transaction';
export { fSettings } from './settings';
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
export { default as fERC20NonWeb3TxConfigJSON } from './erc20NonWeb3TxConfig.json';
export {
  fERC20NonWeb3TxConfig,
  fETHNonWeb3TxConfig,
  fApproveErc20TxConfig,
  fTokenMigrationTxConfig
} from './txConfig';

// Web3 ERC20 Tx Items
export { default as fERC20Web3TxConfigJSON } from './erc20Web3TxConfig.json';

// Non-Web3 ETH Tx Items
export { default as fETHNonWeb3TxConfigJSON } from './ethNonWeb3TxConfig.json';

// Web3 ETH Tx Items
export { default as fETHWeb3TxConfigJSON } from './ethWeb3TxConfig.json';

export { fDefiReserveRates } from './defiRates';
export { fTxHistoryAPI } from './txHistory';

export {
  fAdvancedETHTxSendFormikFields,
  fAdvancedERC20TxSendFormikFields,
  fERC20TxSendFormikFields,
  fETHTxSendFormikFields
} from './sendFormFields';

export { fNotifications } from './notifications';

export { fRates } from './rates';

export { SCHEMA_BASE as fLocalStorage } from '@database/data';
export { fTokenMigrationTxs } from './tokenMigrationMultiTx';

export { default as fREPTokenMigrationTxResponse } from './repMigrationTxResponse.json';
export { default as fApproveERC20TxResponse } from './approveErc20TxResponse.json';

export { fUserActions, fActionTemplates } from './userActions';
