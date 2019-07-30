// import { bufferToHex } from 'ethereumjs-util';
// import BN from 'bn.js';

import { IFormikFields } from 'v2/features/SendAssets/types';
import {
  // Asset,
  // Network,
  IHexStrWeb3Transaction
  // IHexStrTransaction
} from 'v2/types';

// import {
//   Address,
//   TokenValue,
//   toWei,
//   toTokenBase,
//   encodeTransfer,
//   hexEncodeQuantity
// } from 'v2/services/EthService';

export const processFormDataToWeb3Tx = (
  formData: IFormikFields
): IHexStrWeb3Transaction | undefined => {
  const symbol = formData.asset.symbol;
  return symbol;
  //   const asset: Asset | undefined = getAssetByTicker(symbol);
  //
  //   const txFields = formData;
  //
  //   if (!asset || !asset.networkId) {
  //     return undefined;
  //   }
  //
  //   const network: Network | undefined = getNetworkById(asset.networkId);
  //
  //   if (!network) {
  //     return undefined;
  //   }
  //
  //   let rawTransaction;
  //   if (asset.type === 'base') {
  //     if (!asset.decimal) {
  //       return undefined;
  //     }
  //     rawTransaction: IHexStrWeb3Transaction = {
  //       from: txFields.account.address,
  //       to: txFields.recipientAddress,
  //       value: txFields.amount
  //         ? hexEncodeQuantity(toTokenBase(txFields.amount, asset.decimal))
  //         : '0x0',
  //       data: txFields.data ? txFields.data : '0x0',
  //       gas: txFields.isAdvancedTransaction
  //         ? txFields.isGasLimitManual
  //           ? txFields.gasLimitField
  //           : txFields.gasLimitEstimated
  //         : txFields.gasLimitEstimated,
  //       gasPrice: txFields.isAdvancedTransaction ? txFields.gasPriceField : txFields.gasPriceSlider,
  //       nonce: txFields.isAdvancedTransaction ? txFields.nonceField : txFields.nonceEstimated,
  //       chainId: network.chainId ? network.chainId : 1
  //     };
  //   } else if (asset.type === 'erc20') {
  //     if (!asset.contractAddress || !asset.decimal) {
  //       return undefined;
  //     }
  //
  //     rawTransaction: IHexStrWeb3Transaction = {
  //       from: txFields.account.address,
  //       to: asset.contractAddress,
  //       value: '0x0',
  //       data: bufferToHex(
  //         encodeTransfer(
  //           Address(txFields.recipientAddress),
  //           txFields.amount !== '' ? toWei(txFields.amount, asset.decimal) : TokenValue(new BN(0))
  //         )
  //       ),
  //       gas: txFields.isAdvancedTransaction
  //         ? txFields.isGasLimitManual
  //           ? txFields.gasLimitField
  //           : txFields.gasLimitEstimated
  //         : txFields.gasLimitEstimated,
  //       gasPrice: txFields.isAdvancedTransaction ? txFields.gasPriceField : txFields.gasPriceSlider,
  //       nonce: txFields.isAdvancedTransaction ? txFields.nonceField : txFields.nonceEstimated,
  //       chainId: network.chainId ? network.chainId : 1
  //     };
  //   } else {
  //     rawTransaction = undefined;
  //   }
  //   return rawTransaction;
  // };
  //
  // export const processFormDataToTx = (
  //   formData: DeepPartial<SendState>
  // ): IHexStrTransaction | undefined => {
  //   if (
  //     formData.sharedConfig &&
  //     formData.sharedConfig.assetType &&
  //     formData.sharedConfig.assetSymbol
  //   ) {
  //     const symbol = formData.sharedConfig.assetSymbol;
  //     const asset: Asset | undefined = getAssetByTicker(symbol);
  //
  //     const txFields = formData;
  //
  //     if (!asset || !asset.networkId) {
  //       return undefined;
  //     }
  //
  //     const network: Network | undefined = getNetworkById(asset.networkId);
  //
  //     if (!network) {
  //       return undefined;
  //     }
  //
  //     if (asset.type === 'base') {
  //       if (!asset.decimal) {
  //         return undefined;
  //       }
  //       if (txFields.transactionData) {
  //         const rawTransaction: IHexStrTransaction = {
  //           to: txFields.transactionData.to,
  //           value: txFields.transactionData.value
  //             ? hexEncodeQuantity(toTokenBase(txFields.transactionData.value, asset.decimal))
  //             : '0x0',
  //           data: txFields.data ? txFields.data : '0x0',
  //           gasLimit:
  //             txFields.isAdvancedTransaction && txFields.isGasLimitManual
  //               ? txFields.gasLimitField
  //               : txFields.gasLimitEstimated,
  //           gasPrice: txFields.isAdvancedTransaction
  //             ? txFields.gasPriceField
  //             : txFields.gasPriceSlider,
  //           nonce: txFields.isAdvancedTransaction ? txFields.nonceField : txFields.nonceEstimated,
  //           chainId: network.chainId ? network.chainId : 1
  //         };
  //         return rawTransaction;
  //       } else if (asset.type === 'erc20') {
  //         if (!asset.contractAddress || !asset.decimal) {
  //           return undefined;
  //         }
  //       }
  //
  //       const rawTransaction: IHexStrTransaction = {
  //         to: asset.contractAddress,
  //         value: '0x0',
  //         data: bufferToHex(
  //           encodeTransfer(
  //             Address(txFields.transactionData!.to),
  //             txFields.amount !== '' ? toWei(txFields.amount, asset.decimal) : TokenValue(new BN(0))
  //           )
  //         ),
  //         gasLimit:
  //           txFields.isAdvancedTransaction && txFields.isGasLimitManual
  //             ? txFields.gasLimitField
  //             : txFields.gasLimitEstimated,
  //         gasPrice: txFields.isAdvancedTransaction ? txFields.gasPriceField : txFields.gasPriceSlider,
  //         nonce: txFields.isAdvancedTransaction ? txFields.nonceField : txFields.nonceEstimated,
  //         chainId: network.chainId ? network.chainId : 1
  //       };
  //       return rawTransaction;
  //     }
  //   }
};
