import * as utils from 'v2/libs';
import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { Transaction, ExtendedTransaction } from './types';

export default class TransactionServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public createTransaction = (Transactions: Transaction) => {
    this.init();
    // Handle Transaction
    const uuid = utils.generateUUID();

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newTransactionCache = parsedLocalCache;
    newTransactionCache.transactions[uuid] = Transactions;

    newTransactionCache.allTransactions = [...newTransactionCache.allTransactions, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newTransactionCache));
  };

  public readTransaction = (uuid: string) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.transactions[uuid];
  };

  public updateTransaction = (uuid: string, Transactions: Transaction) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newTransactionCache = Object.assign(
      {},
      parsedLocalCache.transactions[uuid],
      Transactions
    );

    localStorage.setItem('MyCryptoCache', JSON.stringify(newTransactionCache));
  };

  public deleteTransaction = (uuid: string) => {
    this.init();
    // Handle Transaction
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    delete parsedLocalCache.transactions[uuid];
    const newallTransactions = parsedLocalCache.allTransactions.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.allTransactions = newallTransactions;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readTransactions = (): ExtendedTransaction[] => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');
    let out: ExtendedTransaction[] = [];
    if (parsedLocalCache.allTransactions && parsedLocalCache.allTransactions.length >= 1) {
      parsedLocalCache.allTransactions.map((uuid: string) => {
        out.push({ ...parsedLocalCache.transactions[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}
