const IPFS_ENDPOINT = 'https://3box.mycryptoapi.com/ipfs';

export default class Profile {
  public address: string;
  private data: any;

  constructor(address: string, data: any) {
    this.address = address;
    this.data = data;
  }

  get name() {
    return this.data.name;
  }

  get image() {
    const ipfsHash = this.data.image[0].contentUrl['/'];
    return `${IPFS_ENDPOINT}/${ipfsHash}`;
  }

  get location() {
    return this.data.location;
  }
}
