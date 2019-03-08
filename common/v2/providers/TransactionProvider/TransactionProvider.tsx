import React, { Component, createContext } from 'react';
import TransactionServiceBase from 'v2/services/Transaction/Transaction';
import { Transaction, ExtendedTransaction } from 'v2/services/Transaction';

interface ProviderState {
  Transactions: ExtendedTransaction[];
  createTransaction(TransactionData: Transaction): void;
  deleteTransaction(uuid: string): void;
  updateTransaction(uuid: string, TransactionData: Transaction): void;
}

export const TransactionContext = createContext({} as ProviderState);

const Transaction = new TransactionServiceBase();

export class TransactionProvider extends Component {
  public readonly state: ProviderState = {
    Transactions: Transaction.readTransactions() || [],
    createTransaction: (TransactionData: Transaction) => {
      Transaction.createTransaction(TransactionData);
      this.getTransactions();
    },
    deleteTransaction: (uuid: string) => {
      Transaction.deleteTransaction(uuid);
      this.getTransactions();
    },
    updateTransaction: (uuid: string, TransactionData: Transaction) => {
      Transaction.updateTransaction(uuid, TransactionData);
      this.getTransactions();
    }
  };

  public render() {
    const { children } = this.props;
    return <TransactionContext.Provider value={this.state}>{children}</TransactionContext.Provider>;
  }

  private getTransactions = () => {
    const Transactions: ExtendedTransaction[] = Transaction.readTransactions() || [];
    this.setState({ Transactions });
  };
}
