import { toChecksumAddressByChainId } from '../../common/libs/checksum';

const VALID_NON_CHECKSUMED_ADDRESS = '0x011da0ab16577cbb73374a5b9b869d66253150e7';
const VALID_ETH_ADDRESS = '0x011da0ab16577cbB73374a5B9b869D66253150e7';
const VALID_RSK_TESTNET_ADDRESS = '0x011Da0AB16577CBB73374A5B9b869d66253150E7';
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
