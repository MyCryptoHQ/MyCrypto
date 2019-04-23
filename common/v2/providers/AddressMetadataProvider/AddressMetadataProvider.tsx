import React, { Component, createContext } from 'react';
import * as service from 'v2/services/AddressMetadata/AddressMetadata';
import { AddressMetadata, ExtendedAddressMetadata } from 'v2/services/AddressMetadata';

interface ProviderState {
  addressMetadata: ExtendedAddressMetadata[];
  readAddressMetadata(uuid: string): AddressMetadata;
  createAddressMetadatas(addressMetadatasData: AddressMetadata): void;
  deleteAddressMetadatas(uuid: string): void;
  updateAddressMetadatas(uuid: string, addressMetadatasData: AddressMetadata): void;
}

export const AddressMetadataContext = createContext({} as ProviderState);

export class AddressMetadataProvider extends Component {
  public readonly state: ProviderState = {
    addressMetadata: service.readAddressMetadatas() || [],
    readAddressMetadata: (uuid: string) => {
      return service.readAddressMetadata(uuid);
    },
    createAddressMetadatas: (addressMetadatasData: AddressMetadata) => {
      service.createAddressMetadata(addressMetadatasData);
      this.getAddressMetadatas();
    },
    deleteAddressMetadatas: (uuid: string) => {
      service.deleteAddressMetadata(uuid);
      this.getAddressMetadatas();
    },
    updateAddressMetadatas: (uuid: string, addressMetadatasData: AddressMetadata) => {
      service.updateAddressMetadata(uuid, addressMetadatasData);
      this.getAddressMetadatas();
    }
  };

  public render() {
    const { children } = this.props;
    return (
      <AddressMetadataContext.Provider value={this.state}>
        {children}
      </AddressMetadataContext.Provider>
    );
  }

  private getAddressMetadatas = () => {
    const addressMetadata: ExtendedAddressMetadata[] = service.readAddressMetadatas() || [];
    this.setState({ addressMetadata });
  };
}
