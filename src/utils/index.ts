/**
 * Utility functions used throughout the App.
 * Should only import dependencies, config, or types.
 */
export { notUndefined, isTxSigned, isTxHash } from './typeGuards';
export * from './validators';
export {
  hasWeb3Provider,
  IS_E2E,
  IS_DEV,
  IS_STAGING,
  IS_PROD,
  USE_HASH_ROUTER,
  SEGMENT_WRITE_KEY
} from './environment';
export { getFeaturedOS } from './getFeaturedOS';
export {
  generateUUID,
  generateAssetUUID,
  generateDeterministicAddressUUID,
  getUUID
} from './generateUUID';
export { isUrl } from './isUrl';
export { truncate } from './truncate';
export { useOnClickOutside } from './useOnClickOutside';
export {
  convertToFiat,
  convertToFiatFromAsset,
  weiToFloat,
  convertToBN,
  divideBNFloats,
  multiplyBNFloats,
  addBNFloats,
  subtractBNFloats,
  trimBN,
  calculateMarkup,
  withCommission
} from './convert';
export { isArrayEqual } from './isArrayEqual';
export { useInterval } from './useInterval';
export * from './useStateReducer';
export { filterObjectOfObjects } from './filterObjectOfObjects';
export { default as ScrollToTop } from './scrollToTop';
export {
  getParam,
  constructCancelTxQuery,
  constructSpeedUpTxQuery,
  createQueryParamsDefaultObject
} from './queries';
export { noOp } from './noOp';
export {
  hexToNumber,
  formatMnemonic,
  toChecksumAddressByChainId,
  buildEIP681EtherRequest,
  buildEIP681TokenRequest
} from './formatters';
export { makeBlob } from './blob';
export { default as consoleAdvertisement } from './consoleAdvertisement';
export {
  formatErrorEmail,
  formatSupportEmail,
  formatEmailMarkdown,
  formatErrorEmailMarkdown
} from './emailFormatter';
export { withHook } from './withHook';
export { withContext } from './withContext';
export { getWeb3Config, isWeb3Wallet } from './web3';
export { toArray } from './toArray';
export { objToString } from './objToString';
export { bigify, isBigish } from './bigify';
export { default as useScreenSize } from './useScreenSize';
export { sanitizeDecimalSeparator } from './sanitizeDecimalSeparator';
export { trimEllipsis } from './trimEllipsis';
export * from './encryption';
export { openLink } from './openLink';
export { isSameAddress } from './isSameAddress';
export { default as isFiatTicker } from './isFiatTicker';
export { sortByLabel, sortByTicker } from './sort';
export { isVoid } from './isVoid';
export { accountsToCSV } from './csv';
export { getRootDomain } from './getRootDomain';
export * from './wallets';
export { isTruthy } from './isTruthy';
export { filterDropdownAssets, filterValidAssets } from './filterAssets';
export * from './date';
export {
  makeExplorer,
  buildAddressUrl,
  buildTxUrl,
  buildBlockUrl,
  buildTokenUrl
} from './makeExplorer';
export { verifySignedMessage } from './signing';
export { stripHexPrefix, stripHexPrefixAndLower } from './stripHexPrefix';
export {
  Units,
  toWei,
  handleValues,
  gasPriceToBase,
  fromWei,
  toTokenBase,
  Wei,
  TokenValue,
  Address,
  baseToConvertedUnit,
  fromTokenBase,
  totalTxFeeToString,
  totalTxFeeToWei,
  gasStringsToMaxGasNumber,
  gasStringsToMaxGasBN,
  convertedToBaseUnit,
  getDecimalFromEtherUnit,
  convertTokenBase,
  calculateGasUsedPercentage
} from './units';
export { padLeftEven } from './padLeftEven';
export { normalize } from './normalize';
export {
  hexNonceToViewable,
  makeTransaction,
  inputGasPriceToHex,
  inputGasLimitToHex,
  inputValueToHex,
  hexWeiToString,
  hexToString,
  inputNonceToHex,
  bigNumGasLimitToViewable,
  bigNumGasPriceToViewableGwei,
  bigNumValueToViewableEther
} from './makeTransaction';
export { hexEncodeData, hexEncodeQuantity } from './hexEncode';
export { randomElementFromArray } from './random';
export { generateTweet } from './generateTweet';
export { arrayToObj } from './toObject';
export { default as log } from './log';
export { mapAsync, filterAsync } from './asyncFilter';
export { isValidJSON } from './isValidJSON';
export { goBack } from './navigation';
