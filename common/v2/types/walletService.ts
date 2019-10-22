export interface WalletService {
  getChainCode(dPath: string): Promise<any>;
  init(args: any[]): any;
}
