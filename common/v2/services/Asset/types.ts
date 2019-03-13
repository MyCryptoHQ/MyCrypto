export interface Asset {
  option: string;
  amount: string;
}

export interface ExtendedAsset extends Asset {
  uuid: string;
}
