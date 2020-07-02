import { DWAccountDisplay, ExtendedDPath } from './types';

export const processFinishedAccounts = (
  finishedAccounts: DWAccountDisplay[],
  customDPaths: ExtendedDPath[],
  desiredGap: number
) => {
  console.debug(
    '[processFinishedAccounts] input: ',
    JSON.stringify(finishedAccounts),
    JSON.stringify(customDPaths),
    desiredGap
  );
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
    .map((indexItem) => {
      if (indexItem.lastIndex - indexItem.lastInhabitedIndex >= desiredGap) return undefined; // gap is satisfied, do nothing;
      return {
        ...indexItem.dpath,
        offset: indexItem.lastIndex,
        numOfAddresses: desiredGap - (indexItem.lastIndex - indexItem.lastInhabitedIndex) + 1
      } as ExtendedDPath;
    })
    .filter((e) => e !== undefined) as ExtendedDPath[];

  const customDPathsDetected = customDPaths.filter(
    (customDPath) => relevantIndexes[customDPath.value] === undefined
  );
  const z = { newGapItems: addNewItems, customDPathItems: customDPathsDetected };
  console.debug('[processFinishedAccounts] output: ', JSON.stringify(z));
  return z;
};
