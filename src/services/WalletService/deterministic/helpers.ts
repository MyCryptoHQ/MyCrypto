import { DPath } from '@types';

import { DWAccountDisplay, ExtendedDPath } from './types';

export const processFinishedAccounts = (
  finishedAccounts: DWAccountDisplay[],
  customDPaths: ExtendedDPath[],
  desiredGap: number
) => {
  const pathItems = finishedAccounts.map((acc) => ({
    ...acc.pathItem,
    balance: acc.balance
  }));
  const relevantIndexes = pathItems.reduce((acc, item) => {
    const idx = item.baseDPath.value;
    const curLastIndex = acc[idx]?.lastIndex;
    const curLastInhabitedIndex = acc[idx]?.lastInhabitedIndex || 0;
    const newLastInhabitedIndex =
      curLastInhabitedIndex < item.index && item.balance && !item.balance.isZero()
        ? item.index
        : curLastInhabitedIndex;
    acc[idx] = {
      lastIndex: curLastIndex > item.index ? curLastIndex : item.index,
      lastInhabitedIndex: newLastInhabitedIndex,
      dpath: item.baseDPath
    };
    return acc;
  }, {} as { [key: string]: { lastIndex: number; lastInhabitedIndex: number; dpath: DPath } });
  const addNewItems = Object.values(relevantIndexes)
    .filter((idxItem) => idxItem.lastIndex - idxItem.lastInhabitedIndex < desiredGap)
    .map(
      (indexItem) =>
        ({
          ...indexItem.dpath,
          offset: indexItem.lastIndex,
          numOfAddresses: desiredGap - (indexItem.lastIndex - indexItem.lastInhabitedIndex) + 1
        } as ExtendedDPath)
    );

  const customDPathsDetected = customDPaths.filter(
    (customDPath) => !relevantIndexes[customDPath.value]
  );

  return { newGapItems: addNewItems, customDPathItems: customDPathsDetected };
};

export const sortAccountDisplayItems = (accounts: DWAccountDisplay[]): DWAccountDisplay[] =>
  accounts.sort((a, b) => a.pathItem.index - b.pathItem.index);
