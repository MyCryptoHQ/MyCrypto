import { GasEstimates } from 'v2/api/gas';
import { WalletName } from 'v2/config/data';
import { ExtendedAccount as IExtendedAccount, Network } from 'v2/services';
import { Asset, assetMethod } from 'v2/services/Asset/types';
import { IAsset } from 'v2/types';

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

  isGasLimitManual: boolean; // Used to indicate that user has un-clicked the user-input gas-limit checkbox.
  accountType: WalletName | undefined; // Type of wallet selected.
  network: Network | undefined;
  gasEstimates: GasEstimates;
  resolvedNSAddress: string; // Address returned when attempting to resolve an ENS/RNS address.
  isResolvingNSName: boolean; // Used to indicate recipient-address is ENS name that is currently attempting to be resolved.
}

export interface ISendState {
  step: number;
  transactionFields: ITxFields;
  recipientAddressLabel: string; //  Recipient-address label found in address book.
  asset: IAsset | Asset | undefined;
  assetType: assetMethod; // Type of asset selected. Directs how rawTransactionValues field are handled when formatting transaction
  // isFetchingAccountValue: boolean;
  // isAddressLabelValid: boolean;
  // isFetchingAssetPricing: boolean;
  // isEstimatingGasLimit: boolean;
  isAdvancedTransaction: boolean; // Used to indicate whether transaction fee slider should be displayed and if Advanced Tab fields should be displayed.
}

export interface SendState {
  step: number;
  transactionData: {
    to: string;
    gasLimit: string;
    gasPrice: string;
    nonce: string;
    data: string;
    value: string;
    chainId: undefined;
  };
  sharedConfig: {
    senderAddress: string;
    senderAddressLabel: string;
    senderWalletBalanceBase: string;
    senderWalletBalanceToken: string;
    senderAccountType: string;
    senderNetwork: string;
    assetSymbol: string;
    assetType: undefined;
    dPath: string;
    recipientAddressLabel: string;
    recipientResolvedNSAddress: string;
  };
  transactionStrings: {
    serialized: string;
    signed: string;
    txHash: string;
  };
}
