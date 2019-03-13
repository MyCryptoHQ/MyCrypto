import React, { Component, createContext } from 'react';
import TransactionHistoryServiceBase from 'v2/services/TransactionHistory/TransactionHistory';
import { TransactionHistory, ExtendedTransactionHistory } from 'v2/services/TransactionHistory';

interface ProviderState {
  transactionHistories: ExtendedTransactionHistory[];
  createTransactionHistory(transactionHistoryData: TransactionHistory): void;
  deleteTransactionHistory(uuid: string): void;
  updateTransactionHistory(uuid: string, transactionHistoryData: TransactionHistory): void;
}

export const TransactionHistoryContext = createContext({} as ProviderState);

const TransactionHistory = new TransactionHistoryServiceBase();

export class TransactionHistoryProvider extends Component {
  public readonly state: ProviderState = {
    transactionHistories: TransactionHistory.readTransactionHistories() || [],
    createTransactionHistory: (transactionHistoryData: TransactionHistory) => {
      TransactionHistory.createTransactionHistory(transactionHistoryData);
      this.getTransactionHistories();
    },
    deleteTransactionHistory: (uuid: string) => {
      TransactionHistory.deleteTransactionHistory(uuid);
      this.getTransactionHistories();
    },
    updateTransactionHistory: (uuid: string, transactionHistoryData: TransactionHistory) => {
      TransactionHistory.updateTransactionHistory(uuid, transactionHistoryData);
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
      TransactionHistory.readTransactionHistories() || [];
    this.setState({ transactionHistories });
  };
}
