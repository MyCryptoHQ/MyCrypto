import uts46 from 'idna-uts46';

export function normalize(name: string): string {
  return uts46.toUnicode(name, { useStd3ASCII: true, transitional: false });
}
