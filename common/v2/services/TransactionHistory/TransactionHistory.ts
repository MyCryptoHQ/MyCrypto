import * as utils from 'v2/libs';
import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { TransactionHistory, ExtendedTransactionHistory } from './types';

export default class TransactionHistoryServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public createTransactionHistory = (TransactionHistories: TransactionHistory) => {
    this.init();
    // Handle TransactionHistory
    const uuid = utils.generateUUID();

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newTransactionHistoryCache = parsedLocalCache;
    newTransactionHistoryCache.transactionHistories[uuid] = TransactionHistories;

    newTransactionHistoryCache.allTransactionHistories = [
      ...newTransactionHistoryCache.allTransactionHistories,
      uuid
    ];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newTransactionHistoryCache));
  };

  public readTransactionHistory = (uuid: string) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.transactionHistories[uuid];
  };

  public updateTransactionHistory = (uuid: string, TransactionHistories: TransactionHistory) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newTransactionHistoryCache = Object.assign(
      {},
      parsedLocalCache.transactionHistories[uuid],
      TransactionHistories
    );

    localStorage.setItem('MyCryptoCache', JSON.stringify(newTransactionHistoryCache));
  };

  public deleteTransactionHistory = (uuid: string) => {
    this.init();
    // Handle TransactionHistory
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    delete parsedLocalCache.transactionHistories[uuid];
    const newallTransactionHistories = parsedLocalCache.allTransactionHistories.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.allTransactionHistories = newallTransactionHistories;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readTransactionHistories = (): ExtendedTransactionHistory[] => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');
    let out: ExtendedTransactionHistory[] = [];
    if (
      parsedLocalCache.allTransactionHistories &&
      parsedLocalCache.allTransactionHistories.length >= 1
    ) {
      parsedLocalCache.allTransactionHistories.map((uuid: string) => {
        out.push({ ...parsedLocalCache.transactionHistories[uuid], uuid });
      });
    } else {
      out = [];
    }
    return out;
  };
}
