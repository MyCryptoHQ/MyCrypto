export interface LocalSetting {
  fiatCurrency: string;
  favorite: boolean;
}

export interface ExtendedLocalSetting extends LocalSetting {
  uuid: string;
}
