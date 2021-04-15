import { DPath } from '@types';
import { bigify } from '@utils';

import { TableAccountDisplay } from './HDWTable';

export const sortAccounts = (
  accounts: TableAccountDisplay[],
  displayEmptyAddresses: boolean,
  selectedDPath: DPath
) => {
  const selectedAccounts = accounts
    .filter(({ isSelected, balance }) => isSelected && balance)
    .sort((a, b) => (bigify(a.balance!).isGreaterThan(b.balance!) ? -1 : 1));
  const deselectedAccounts = accounts
    .filter(
      ({ isSelected, pathItem: { baseDPath } }) =>
        !isSelected && baseDPath.value === selectedDPath.value
    )
    .sort((a, b) => (a.pathItem.index < b.pathItem.index ? -1 : 1));
  return displayEmptyAddresses ? [...selectedAccounts, ...deselectedAccounts] : selectedAccounts;
};

export const calculateDPathOffset = (accounts: TableAccountDisplay[], selectedDPath: DPath) =>
  Math.max(
    ...accounts
      .filter((acc) => acc.pathItem.baseDPath.value === selectedDPath.value)
      .map(({ pathItem: { index } }) => index)
  ) + 1; // Start scanning from the next index
