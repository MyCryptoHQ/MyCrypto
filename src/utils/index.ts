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
  SEGMENT_WRITE_KEY,
  ANALYTICS_API_URL,
  COMMIT_HASH
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
  withCommission
} from './convert';
export { isArrayEqual } from './isArrayEqual';
export { useInterval } from './useInterval';
export * from './useStateReducer';
export { filterObjectOfObjects } from './filterObjectOfObjects';
export { default as ScrollToTop } from './scrollToTop';
export * from './queries';
export { noOp } from './noOp';
export {
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
export { bigify, hasBalance, isBigish } from './bigify';
export { default as useScreenSize } from './useScreenSize';
export { sanitizeDecimalSeparator } from './sanitizeDecimalSeparator';
export { trimEllipsis } from './trimEllipsis';
export { openLink } from './openLink';
export { isSameAddress } from './isSameAddress';
export { default as isFiatTicker } from './isFiatTicker';
export { sortByLabel, sortByTicker } from './sort';
export { isVoid } from './isVoid';
export { accountsToCSV } from './csv';
export { getRootDomain } from './getRootDomain';
export * from './wallets';
export { isTruthy } from './isTruthy';
export { filterValidAssets } from './filterAssets';
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
export * from './units';
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
export { hexEncodeQuantity } from './hexEncode';
export { randomElementFromArray } from './random';
export { generateTweet } from './generateTweet';
export { arrayToObj } from './toObject';
export { mapAsync, filterAsync } from './asyncFilter';
export { goBack } from './navigation';
export { addHexPrefix } from './addHexPrefix';
export * from './typedTx';
