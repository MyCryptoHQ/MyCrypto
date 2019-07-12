import React, { Component, createContext } from 'react';
import * as service from 'v2/services/AddressBook/AddressBook';
import { AddressBook, ExtendedAddressBook } from 'v2/services/AddressBook';

interface ProviderState {
  addressBook: ExtendedAddressBook[];
  readAddressBook(uuid: string): AddressBook;
  createAddressBooks(addressBooksData: AddressBook): void;
  deleteAddressBooks(uuid: string): void;
  updateAddressBooks(uuid: string, addressBooksData: AddressBook): void;
  getContactByAddress(address: string): ExtendedAddressBook | undefined;
}

export const AddressBookContext = createContext({} as ProviderState);

export class AddressBookProvider extends Component {
  public readonly state: ProviderState = {
    addressBook: service.readAddressBooks() || [],
    readAddressBook: (uuid: string) => {
      return service.readAddressBook(uuid);
    },
    createAddressBooks: (addressBooksData: AddressBook) => {
      service.createAddressBook(addressBooksData);
      this.getAddressBooks();
    },
    deleteAddressBooks: (uuid: string) => {
      service.deleteAddressBook(uuid);
      this.getAddressBooks();
    },
    updateAddressBooks: (uuid: string, addressBooksData: AddressBook) => {
      service.updateAddressBook(uuid, addressBooksData);
      this.getAddressBooks();
    },
    getContactByAddress: address => {
      const { addressBook } = this.state;
      return addressBook.find(contact => contact.address.toLowerCase() === address.toLowerCase());
    }
  };

  public render() {
    const { children } = this.props;
    return <AddressBookContext.Provider value={this.state}>{children}</AddressBookContext.Provider>;
  }

  private getAddressBooks = () => {
    const addressBook: ExtendedAddressBook[] = service.readAddressBooks() || [];
    this.setState({ addressBook });
  };
}
