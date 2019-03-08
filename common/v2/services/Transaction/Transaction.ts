import * as utils from 'v2/libs';
import { initializeCache } from 'v2/services/LocalCache';
import { Transaction, ExtendedTransaction } from './types';

export default class TransactionServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public createTransaction = (Transaction: Transaction) => {
    this.init();
    // Handle Transaction
    const uuid = utils.generateUUID();

    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch (e) {
      parsedLocalCache = localCache;
    }
    const newTransactionCache = parsedLocalCache;
    newTransactionCache.Transactions[uuid] = Transaction;

    newTransactionCache.allTransactions = [...newTransactionCache.allTransactions, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newTransactionCache));
  };

  public readTransaction = (uuid: string) => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    return parsedLocalCache.Transactions[uuid];
  };

  public updateTransaction = (uuid: string, Transaction: Transaction) => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    const newTransactionCache = Object.assign({}, parsedLocalCache.Transactions[uuid], Transaction);

    localStorage.setItem('MyCryptoCache', JSON.stringify(newTransactionCache));
  };

  public deleteTransaction = (uuid: string) => {
    this.init();
    // Handle Transaction
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    delete parsedLocalCache.Transactions[uuid];
    const newallTransactions = parsedLocalCache.allTransactions.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.allTransactions = newallTransactions;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readTransactions = (): ExtendedTransaction[] => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '[]';
    let parsedLocalCache: any;
    let out: ExtendedTransaction[] = [];
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch (e) {
      parsedLocalCache = localCache;
    }
    if (parsedLocalCache.allTransactions && parsedLocalCache.allTransactions.length >= 1) {
      parsedLocalCache.allTransactions.map((uuid: string) => {
        out.push({ ...parsedLocalCache.Transactions[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}
