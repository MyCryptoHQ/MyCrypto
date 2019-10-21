import uts46 from 'idna-uts46';

export function normalise(name: string): string {
  try {
    return uts46.toUnicode(name, { useStd3ASCII: true, transitional: false });
  } catch (e) {
    throw e;
  }
}
