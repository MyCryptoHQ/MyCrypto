import React, { Component, createContext } from 'react';
import AddressMetadatasServiceBase from 'v2/services/AddressMetadata/AddressMetadata';
import { AddressMetadata, ExtendedAddressMetadata } from 'v2/services/AddressMetadata';

interface ProviderState {
  addressMetadata: ExtendedAddressMetadata[];
  createAddressMetadatas(addressMetadatasData: AddressMetadata): void;
  deleteAddressMetadatas(uuid: string): void;
  updateAddressMetadatas(uuid: string, addressMetadatasData: AddressMetadata): void;
}

export const AddressMetadataContext = createContext({} as ProviderState);

const AddressMetadataService = new AddressMetadatasServiceBase();

export class AddressMetadataProvider extends Component {
  public readonly state: ProviderState = {
    addressMetadata: AddressMetadataService.readAddressMetadatas() || [],
    createAddressMetadatas: (addressMetadatasData: AddressMetadata) => {
      AddressMetadataService.createAddressMetadata(addressMetadatasData);
      this.getAddressMetadatas();
    },
    deleteAddressMetadatas: (uuid: string) => {
      AddressMetadataService.deleteAddressMetadata(uuid);
      this.getAddressMetadatas();
    },
    updateAddressMetadatas: (uuid: string, addressMetadatasData: AddressMetadata) => {
      AddressMetadataService.updateAddressMetadata(uuid, addressMetadatasData);
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
    const addressMetadata: ExtendedAddressMetadata[] =
      AddressMetadataService.readAddressMetadatas() || [];
    this.setState({ addressMetadata });
  };
}
