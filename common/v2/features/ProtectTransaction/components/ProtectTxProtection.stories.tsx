import React from 'react';
import { storiesOf } from '@storybook/react';
import find from 'lodash/find';
import noop from 'lodash/noop';

import { NETWORKS_CONFIG, NODES_CONFIG } from 'v2/database/data';
import { Network, NetworkId, WalletId } from 'v2/types';
import { assets } from 'v2/database/seed/assets';

import { ProtectTxProvider } from '../index';
import { ProtectTxProtection } from './ProtectTxProtection';
import { RatesContext } from '../../../services';
import { Panel } from '@mycrypto/ui';
import ProtectTxModalBackdrop from './ProtectTxModalBackdrop';
import { COLORS } from 'v2/theme';

const noopPromise = () => Promise.resolve();

const ratesContextMock = {
  getAssetRate: () => 100
};

const ropstenId: NetworkId = 'Ropsten';
const network: Network[] = ([
  {
    ...NETWORKS_CONFIG[ropstenId],
    nodes: NODES_CONFIG[ropstenId]
  }
] as unknown) as Network[];

const formValues = {
  address: {
    display: 'Test account 1',
    value: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88'
  },
  amount: '0.01',
  account: {
    address: '0x8fe684ae26557DfFF70ceE9a4Ff5ee7251a31AD5',
    networkId: 'Ropsten',
    wallet: WalletId.MNEMONIC_PHRASE
  },
  network,
  asset: find(assets, { networkId: ropstenId }),
  gasPriceSlider: 10,
  gasEstimates: { safeLow: 5 },
  advancedTransaction: false,
  nonceField: '49'
};

const formValuesWeb3 = {
  ...formValues,
  account: {
    ...formValues.account,
    wallet: WalletId.METAMASK
  }
};

const ProtectTxStep1 = () => (
  <div style={{ maxWidth: '375px', position: 'relative' }}>
    <Panel>
      <ProtectTxProtection
        sendAssetsValues={formValues as any}
        handleProtectTxSubmit={noopPromise}
      />
    </Panel>
  </div>
);

const ProtectTxStep1Web3 = () => (
  <div style={{ maxWidth: '375px', position: 'relative' }}>
    <Panel>
      <ProtectTxProtection
        sendAssetsValues={formValuesWeb3 as any}
        handleProtectTxSubmit={noopPromise}
      />
    </Panel>
  </div>
);

const ProtectTxStep1Mobile = () => (
  <div
    style={{
      width: '700px',
      position: 'relative',
      backgroundColor: COLORS.BLACK,
      display: 'flex',
      justifyContent: 'center'
    }}
  >
    <ProtectTxModalBackdrop onBackdropClick={noop} />
    <div style={{ maxWidth: '375px', position: 'relative' }}>
      <Panel>
        <ProtectTxProtection
          sendAssetsValues={formValuesWeb3 as any}
          handleProtectTxSubmit={noopPromise}
        />
      </Panel>
    </div>
  </div>
);

storiesOf('ProtectTransaction', module)
  .addDecorator(story => (
    <RatesContext.Provider value={ratesContextMock as any}>{story()}</RatesContext.Provider>
  ))
  .addDecorator(story => <ProtectTxProvider>{story()}</ProtectTxProvider>)
  .add('Step 1', _ => ProtectTxStep1(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  })
  .add('Step 1 - Web 3', _ => ProtectTxStep1Web3(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  })
  .add('Step 1 - Mobile', _ => ProtectTxStep1Mobile(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  });
