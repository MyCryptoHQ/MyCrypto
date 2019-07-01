export interface AddressBook {
  address: string;
  label: string;
  notes: string;
  network: string;
}

export interface ExtendedAddressBook extends AddressBook {
  uuid: string;
}
