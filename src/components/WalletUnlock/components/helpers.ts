import { DPath } from '@types';

import { TableAccountDisplay } from './DeterministicAccountTable';

export const sortAccounts = (
  accounts: TableAccountDisplay[],
  displayEmptyAddresses: boolean,
  selectedDPath: DPath
) => {
  const selectedAccounts = accounts
    .filter(({ isSelected }) => isSelected)
    .sort((a, b) => (a.balance?.isGreaterThan(b.balance!) ? -1 : 1));
  const deselectedAccounts = accounts
    .filter(
      ({ isSelected, pathItem: { baseDPath } }) =>
        !isSelected && baseDPath.value === selectedDPath.value
    )
    .sort((a, b) => (a.pathItem.index < b.pathItem.index ? -1 : 1));
  return displayEmptyAddresses ? [...selectedAccounts, ...deselectedAccounts] : selectedAccounts;
};
