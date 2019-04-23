import React, { Component, createContext } from 'react';
import * as service from 'v2/services/Transaction/Transaction';
import { Transaction, ExtendedTransaction } from 'v2/services/Transaction';

export interface ProviderState {
  transactions: ExtendedTransaction[];
  createTransaction(transactionData: ExtendedTransaction): void;
  readTransaction(uuid: string): Transaction;
  deleteTransaction(uuid: string): void;
  updateTransaction(uuid: string, transactionData: ExtendedTransaction): void;
}

export const TransactionContext = createContext({} as ProviderState);

export class TransactionProvider extends Component {
  public readonly state: ProviderState = {
    transactions: service.readTransactions() || [],
    createTransaction: (transactionData: Transaction) => {
      service.createTransaction(transactionData);
      this.getTransactions();
    },
    readTransaction: (uuid: string): Transaction => {
      return service.readTransaction(uuid);
    },
    deleteTransaction: (uuid: string) => {
      service.deleteTransaction(uuid);
      this.getTransactions();
    },
    updateTransaction: (uuid: string, transactionData: Transaction) => {
      service.updateTransaction(uuid, transactionData);
      this.getTransactions();
    }
  };

  public render() {
    const { children } = this.props;
    return <TransactionContext.Provider value={this.state}>{children}</TransactionContext.Provider>;
  }

  private getTransactions = () => {
    const transactions: ExtendedTransaction[] = service.readTransactions() || [];
    this.setState({ transactions });
  };
}
