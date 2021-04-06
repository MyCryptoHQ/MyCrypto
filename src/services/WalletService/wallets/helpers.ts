import { DPath } from '@types';

/**
 * Get the full derivation path with address index.
 *
 * @param {DPath} derivationPath The derivation path to get the full path for.
 * @param {number} addrIndex The address index or account index.
 */
export const getFullPath = (derivationPath: DPath, addrIndex: number): string => {
  if (derivationPath.isHardened) {
    return derivationPath.value.replace('addrIndex', addrIndex.toString());
  }
  return `${derivationPath.value}/${addrIndex}`;
};
