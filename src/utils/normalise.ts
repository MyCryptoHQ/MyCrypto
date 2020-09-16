import uts46 from 'idna-uts46';

export const normalise = (name: string): string =>
  uts46.toUnicode(name, { useStd3ASCII: true, transitional: false });
