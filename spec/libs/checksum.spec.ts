import { toChecksumAddressByChainId } from '../../common/libs/checksum';

const VALID_NON_CHECKSUMED_ADDRESS = '0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed';
const VALID_ETH_ADDRESS = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';
const VALID_RSK_TESTNET_ADDRESS = '0x5aAeb6053F3e94c9b9A09F33669435E7EF1BEaEd';
const RSK_TESTNET_CHAIN_ID = 31;
const ETH_CHAIN_ID = 1;

describe('Checksum', () => {
  it('should validate correct ETH checksumed address as true', () => {
    expect(toChecksumAddressByChainId(VALID_NON_CHECKSUMED_ADDRESS, ETH_CHAIN_ID)).toEqual(
      VALID_ETH_ADDRESS
    );
  });
  it('should validate correct RSK checksumed testnet address as true', () => {
    expect(toChecksumAddressByChainId(VALID_NON_CHECKSUMED_ADDRESS, RSK_TESTNET_CHAIN_ID)).toEqual(
      VALID_RSK_TESTNET_ADDRESS
    );
  });
});
