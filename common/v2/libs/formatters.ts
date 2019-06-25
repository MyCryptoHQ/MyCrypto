import { ITLDCollection } from './ens/networkConfigs';

export function stripHexPrefix(value: string) {
  return value.replace('0x', '');
}

export function stripHexPrefixAndLower(value: string): string {
  return stripHexPrefix(value).toLowerCase();
}

export function formateENSRegex(validTLDs: ITLDCollection): string {
  const tldConcatenation = Object.keys(validTLDs).join('|.');
  return '^([\\w-])+(.[\\w-])+(.' + tldConcatenation + ')$';
}
