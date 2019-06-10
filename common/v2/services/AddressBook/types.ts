export interface AddressBook {
  address: string;
  label: string;
  notes: string;
}

export interface ExtendedAddressBook extends AddressBook {
  uuid: string;
}
