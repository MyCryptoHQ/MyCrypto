export interface DerivationPathOptions {
  name: string;
  derivationPath: string;
  active: boolean;
}

export interface ExtendedDerivationPathOptions extends DerivationPathOptions {
  uuid: string;
}
