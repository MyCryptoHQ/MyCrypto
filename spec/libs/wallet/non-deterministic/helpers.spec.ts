import { checksumKeystoreFilename } from '../../../../common/libs/wallet/non-deterministic/helpers';
import { fromPrivateKey } from 'ethereumjs-wallet';

const VALID_ETH_PK =
  '513f6a4fb8fb98b8b95f96e091f4328dbaed4f95d462dd93a5430f44afb6a368';
const pkBuffer = Buffer.from(VALID_ETH_PK, 'hex');
const wallet = fromPrivateKey(pkBuffer);
const address = wallet.getChecksumAddressString();

describe('Keystore Checksum', () => {
  const fileName = checksumKeystoreFilename(wallet);
  const dataArr = fileName.split('--');
  it('should have three parts', () => {
    expect(dataArr.length).toEqual(3);
  });

  it('should equal to checksummed public address', () => {
    const publicAddress = dataArr[2];
    expect(publicAddress).toEqual(address);
  });

  it('should have UTC prefixed', () => {
    const UTC = dataArr[0];
    expect(UTC).toEqual('UTC');
  });
});
