import React from 'react';
import { storiesOf } from '@storybook/react';
import { Panel } from '@mycrypto/ui';

import { NETWORKS_CONFIG, NODES_CONFIG } from '@database/data';
import { Network, NetworkId, WalletId } from '@types';
import { noOp } from '@utils';

import { ProtectTxSign } from './ProtectTxSign';
import ProtectTxProvider from '../ProtectTxProvider';

const ropstenId: NetworkId = 'Ropsten';
const network: Network = {
  ...NETWORKS_CONFIG[ropstenId],
  nodes: NODES_CONFIG[ropstenId]
} as any;

const account = {
  address: '0x8fe684ae26557DfFF70ceE9a4Ff5ee7251a31AD5',
  networkId: 'Ropsten',
  wallet: WalletId.MNEMONIC_PHRASE
};

const sampleTxConfig = {
  to: '0xe9c593dc6FaDC38401896C21987E2976f0AF6914',
  value: '0x2386f26fc10000',
  data: '0x',
  gasLimit: '0x6270',
  gasPrice: '0xee6b2800',
  nonce: '0x31',
  chainId: 3
};

const ProtectTxStep2 = () => (
  <div style={{ maxWidth: '375px', position: 'relative' }}>
    <Panel>
      <ProtectTxSign
        handleProtectTxConfirmAndSend={noOp}
        txConfig={sampleTxConfig as any}
        network={network}
        account={account as any}
      />
    </Panel>
  </div>
);

storiesOf('ProtectTransaction', module)
  .addDecorator((story) => <ProtectTxProvider>{story()}</ProtectTxProvider>)
  .add('Step 2', (_) => ProtectTxStep2(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  });
