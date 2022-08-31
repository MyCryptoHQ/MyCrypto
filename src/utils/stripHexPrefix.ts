export function stripHexPrefix(value: string) {
  return value.replace('0x', '');
}

export function stripHexPrefixAndLower(value: string): string {
  return stripHexPrefix(value).toLowerCase();
}
