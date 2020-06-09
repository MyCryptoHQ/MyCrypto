/**
 * Get the full derivation path with address index.
 *
 * @param {DPath} derivationPath The derivation path to get the full path for.
 * @param {number} addressIndex The address index or account index.
 */
export const getFullPath = (derivationPath: DPath, addressIndex: number): string => {
  if (derivationPath.isHardened) {
    return derivationPath.getIndex!(addressIndex);
  }
  return `${derivationPath.value}/${addressIndex}`;
};
