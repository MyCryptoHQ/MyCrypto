export class DeterministicWallet {
  protected address: string;
  protected dPath: string;
  protected index: number;

  constructor(address: string, dPath: string, index: number) {
    this.address = address;
    this.dPath = dPath;
    this.index = index;
  }

  public getAddressString(): Promise<string> {
    return Promise.resolve(this.address);
  }

  public getPath(): string {
    return `${this.dPath}/${this.index}`;
  }
}
