import React, { Component, createContext } from 'react';
import AddressMetadatasServiceBase from 'v2/services/AddressMetadata/AddressMetadata';
import { AddressMetadata, ExtendedAddressMetadata } from 'v2/services/AddressMetadata';

interface ProviderState {
  AddressMetadata: ExtendedAddressMetadata[];
  createAddressMetadatas(AddressMetadatasData: AddressMetadata): void;
  deleteAddressMetadatas(uuid: string): void;
  updateAddressMetadatas(uuid: string, AddressMetadatasData: AddressMetadata): void;
}

export const AddressMetadataContext = createContext({} as ProviderState);

const AddressMetadataService = new AddressMetadatasServiceBase();

export class AddressMetadataProvider extends Component {
  public readonly state: ProviderState = {
    AddressMetadata: AddressMetadataService.readAddressMetadatas() || [],
    createAddressMetadatas: (AddressMetadatasData: AddressMetadata) => {
      AddressMetadataService.createAddressMetadata(AddressMetadatasData);
      this.getAddressMetadatas();
    },
    deleteAddressMetadatas: (uuid: string) => {
      AddressMetadataService.deleteAddressMetadata(uuid);
      this.getAddressMetadatas();
    },
    updateAddressMetadatas: (uuid: string, AddressMetadatasData: AddressMetadata) => {
      AddressMetadataService.updateAddressMetadata(uuid, AddressMetadatasData);
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
    const newAddressMetadata: ExtendedAddressMetadata[] =
      AddressMetadataService.readAddressMetadatas() || [];
    this.setState({ newAddressMetadata });
  };
}
