export interface FiatCurrency {
  code: string;
  name: string;
}

export interface ExtendedFiatCurrency extends FiatCurrency {
  uuid: string;
}
