export interface ContractOptions {
  name: string;
  network: string;
  address: string;
  abi: string;
}

export interface ExtendedContractOptions extends ContractOptions {
  uuid: string;
}
