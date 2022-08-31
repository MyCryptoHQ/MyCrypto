import { ExtendedContact } from '@types';
import { generateDeterministicAddressUUID } from '@utils/generateUUID';

import { FAUCET_NETWORKS } from './data';

const FAUCET_CONTACTS: ExtendedContact[] = FAUCET_NETWORKS.map((network) => {
  const address = '0xa500B2427458D12Ef70dd7b1E031ef99d1cc09f7';
  const uuid = generateDeterministicAddressUUID(network, address);

  return {
    uuid,
    address,
    label: 'MyCrypto Faucet',
    network,
    notes: ''
  };
});

// These contacts will resolve for an address, but not be added to the address book
export const STATIC_CONTACTS: ExtendedContact[] = [...FAUCET_CONTACTS];
