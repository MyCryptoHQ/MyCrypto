export interface Contract {
  name: string;
  networkId: string;
  address: string;
  abi: string;
}

export interface ExtendedContract extends Contract {
  uuid: string;
}
