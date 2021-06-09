import { DPath } from '@types';
/**
 * Get the full derivation path with address index.
 *
 * @param {DPath} derivationPath The derivation path to get the full path for.
 * @param {number} addrIndex The address index or account index.
 */
export const getFullPath = (derivationPath: DPath, addrIndex: number): string => {
  if (derivationPath.isHardened) {
    return parseHardenedPath(derivationPath, addrIndex);
  }
  return `${derivationPath.value}/${addrIndex}`;
};

export const parseHardenedPath = (derivationPath: DPath, addrIndex: number): string =>
  derivationPath.isHardened
    ? derivationPath.value.replace('addrIndex', addrIndex.toString())
    : derivationPath.value;
