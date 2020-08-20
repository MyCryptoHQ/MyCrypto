interface DPath {
  label: string;
  value: string; // @todo determine method for more precise typing for path
  isHardened?: boolean;

  /**
   * Get the full derivation path with the address index. This can be used with hardened derivation
   * paths.
   *
   * @return {string}
   */
  getIndex?(addressIndex: number): string;
}
