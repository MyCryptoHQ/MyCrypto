import { IAsset } from 'v2/types';
import { Asset, assetMethod } from 'v2/services/Asset/types';
import { ExtendedAccount as IExtendedAccount } from 'v2/services';
import { WalletName } from 'v2/config/data';
import { GasEstimates } from 'v2/api/gas';

export interface ITxFields {
  asset: IAsset | undefined;
  recipientAddress: string;
  amount: string;
  account: IExtendedAccount;
  data: string;
  gasLimitEstimated: string;
  gasPriceSlider: string;
  nonceEstimated: string;
  gasLimitField: string; // Use only if advanced tab is open AND isGasLimitManual is true
  gasPriceField: string; // Use only if advanced tab is open AND user has input gas price
  nonceField: string; // Use only if user has input a manual nonce value.
  isAdvancedTransaction: boolean; // Used to indicate whether transaction fee slider should be displayed and if Advanced Tab fields should be displayed.
  isGasLimitManual: boolean; // Used to indicate that user has un-clicked the user-input gas-limit checkbox.
  accountType: WalletName | undefined; // Type of wallet selected.
  gasEstimates: GasEstimates;
}

export interface ISendState {
  step: number;
  transactionFields: ITxFields;
  isFetchingAccountValue: boolean; // Used to indicate looking up user's balance of currently-selected asset.
  isResolvingNSName: boolean; // Used to indicate recipient-address is ENS name that is currently attempting to be resolved.
  isAddressLabelValid: boolean; // Used to indicate if recipient-address is found in the address book.
  isFetchingAssetPricing: boolean; // Used to indicate fetching CC rates for currently-selected asset.
  isEstimatingGasLimit: boolean; // Used to indicate that gas limit is being estimated using `eth_estimateGas` jsonrpc call.
  resolvedNSAddress: string; // Address returned when attempting to resolve an ENS/RNS address.
  recipientAddressLabel: string; //  Recipient-address label found in address book.
  asset: IAsset | Asset | undefined;
  network: string;
  assetType: assetMethod; // Type of asset selected. Directs how rawTransactionValues field are handled when formatting transaction
}
