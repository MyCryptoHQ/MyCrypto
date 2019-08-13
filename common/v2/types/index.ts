import { TWalletType } from './wallets';
import { Wallet, ExtendedWallet, WalletName } from './wallet';
import { TSymbol } from './symbols';
import { IRate } from './rate';
import { NodeConfig } from './node';

// Babel needs to know which types to remove when transpiling
// https://github.com/webpack/webpack/issues/7378#issuecomment-492641148
export type NodeConfig = NodeConfig;
export type Wallet = Wallet;
export type ExtendedWallet = ExtendedWallet;
export type WalletName = WalletName;
export type TSymbol = TSymbol;
export type IRate = IRate;
export type TWalletType = TWalletType;

export { DefaultWalletName, SecureWalletName, InsecureWalletName, MiscWalletName } from './wallet';
export { walletNames } from './wallet';
export { Asset, ExtendedAsset, IAsset, TAssetType } from './asset';
export { Account, ExtendedAccount, TransactionData, AssetBalanceObject } from './account';
export { AddressBook, ExtendedAddressBook } from './addressBook';
export { Contract, ExtendedContract } from './contract';
export {
  CustomNodeConfig,
  DPathFormat,
  ExtendedNetwork,
  Network,
  NetworkId,
  NodeOptions
} from './network';
export { NodeType } from './node';
export { ISettings } from './settings';
export { ScreenLockSettings } from './screenLock';
export { LocalCache } from './store';
export { GasEstimates } from './gasEstimates';
export { Notification, ExtendedNotification } from './notification';
export { IERC20 } from './erc20';
export { ABIFunc, ABIFuncParamless } from './abiFunc';
export { ITransaction, IHexStrTransaction, IHexStrWeb3Transaction } from './transaction';
export { JsonRPCResponse } from './jsonRPCResponse';
export { INode, TxObj } from './INode';
export { IAppRoute, IRoutePath, IRoutePaths } from './routes';
export { Tab } from './tab';
export { ISignedMessage } from './signing';
