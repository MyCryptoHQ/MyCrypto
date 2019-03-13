import React, { Component, createContext } from 'react';
import TransactionHistoryServiceBase from 'v2/services/TransactionHistory/TransactionHistory';
import { TransactionHistory, ExtendedTransactionHistory } from 'v2/services/TransactionHistory';

interface ProviderState {
  TransactionHistories: ExtendedTransactionHistory[];
  createTransactionHistory(TransactionHistoryData: TransactionHistory): void;
  deleteTransactionHistory(uuid: string): void;
  updateTransactionHistory(uuid: string, TransactionHistoryData: TransactionHistory): void;
}

export const TransactionHistoryContext = createContext({} as ProviderState);

const TransactionHistory = new TransactionHistoryServiceBase();

export class TransactionHistoryProvider extends Component {
  public readonly state: ProviderState = {
    TransactionHistories: TransactionHistory.readTransactionHistories() || [],
    createTransactionHistory: (TransactionHistoryData: TransactionHistory) => {
      TransactionHistory.createTransactionHistory(TransactionHistoryData);
      this.getTransactionHistories();
    },
    deleteTransactionHistory: (uuid: string) => {
      TransactionHistory.deleteTransactionHistory(uuid);
      this.getTransactionHistories();
    },
    updateTransactionHistory: (uuid: string, TransactionHistoryData: TransactionHistory) => {
      TransactionHistory.updateTransactionHistory(uuid, TransactionHistoryData);
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
    const Transactions: ExtendedTransactionHistory[] =
      TransactionHistory.readTransactionHistories() || [];
    this.setState({ Transactions });
  };
}
