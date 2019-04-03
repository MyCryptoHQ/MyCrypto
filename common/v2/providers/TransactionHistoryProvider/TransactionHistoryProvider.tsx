import React, { Component, createContext } from 'react';
import * as service from 'v2/services/TransactionHistory/TransactionHistory';
import { TransactionHistory, ExtendedTransactionHistory } from 'v2/services/TransactionHistory';

export interface ProviderState {
  transactionHistories: ExtendedTransactionHistory[];
  createTransactionHistory(transactionHistoryData: TransactionHistory): void;
  readTransactionHistory(uuid: string): TransactionHistory;
  deleteTransactionHistory(uuid: string): void;
  updateTransactionHistory(uuid: string, transactionHistoryData: TransactionHistory): void;
}

export const TransactionHistoryContext = createContext({} as ProviderState);

export class TransactionHistoryProvider extends Component {
  public readonly state: ProviderState = {
    transactionHistories: service.readTransactionHistories() || [],
    createTransactionHistory: (transactionHistoryData: TransactionHistory) => {
      service.createTransactionHistory(transactionHistoryData);
      this.getTransactionHistories();
    },
    readTransactionHistory: (uuid: string): TransactionHistory => {
      return service.readTransactionHistory(uuid);
    },
    deleteTransactionHistory: (uuid: string) => {
      service.deleteTransactionHistory(uuid);
      this.getTransactionHistories();
    },
    updateTransactionHistory: (uuid: string, transactionHistoryData: TransactionHistory) => {
      service.updateTransactionHistory(uuid, transactionHistoryData);
      this.getTransactionHistories();
    }
  };

  public render() {
    const { children } = this.props;
    return (
      <TransactionHistoryContext.Provider value={this.state}>
        {children}
      </TransactionHistoryContext.Provider>
    );
  }

  private getTransactionHistories = () => {
    const transactionHistories: ExtendedTransactionHistory[] =
      service.readTransactionHistories() || [];
    this.setState({ transactionHistories });
  };
}
