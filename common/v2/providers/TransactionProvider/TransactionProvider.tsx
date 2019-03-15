import React, { Component, createContext } from 'react';
import TransactionServiceBase from 'v2/services/Transaction/Transaction';
import { Transaction, ExtendedTransaction } from 'v2/services/Transaction';

export interface ProviderState {
  transactions: ExtendedTransaction[];
  createTransaction(transactionData: ExtendedTransaction): void;
  deleteTransaction(uuid: string): void;
  updateTransaction(uuid: string, transactionData: ExtendedTransaction): void;
}

export const TransactionContext = createContext({} as ProviderState);

const Transaction = new TransactionServiceBase();

export class TransactionProvider extends Component {
  public readonly state: ProviderState = {
    transactions: Transaction.readTransactions() || [],
    createTransaction: (transactionData: Transaction) => {
      Transaction.createTransaction(transactionData);
      this.getTransactions();
    },

    deleteTransaction: (uuid: string) => {
      Transaction.deleteTransaction(uuid);
      this.getTransactions();
    },
    updateTransaction: (uuid: string, transactionData: Transaction) => {
      Transaction.updateTransaction(uuid, transactionData);
      this.getTransactions();
    }
  };

  public render() {
    const { children } = this.props;
    return <TransactionContext.Provider value={this.state}>{children}</TransactionContext.Provider>;
  }

  private getTransactions = () => {
    const transactions: ExtendedTransaction[] = Transaction.readTransactions() || [];
    this.setState({ transactions });
  };
}
