import React from 'react';
import { storiesOf } from '@storybook/react';
import find from 'lodash/find';
import { Panel } from '@mycrypto/ui';

import { NETWORKS_CONFIG, NODES_CONFIG } from '@database/data';
import { Network, NetworkId, WalletId, IFormikFields } from '@types';
import { assets } from '@database/seed/assets';
import { COLORS } from '@theme';
import { noOp } from '@utils';
import { RatesContext } from '@services';

import { ProtectTxProtection } from './ProtectTxProtection';
import ProtectTxModalBackdrop from './ProtectTxModalBackdrop';
import ProtectTxProvider, {
  ProtectTxContext,
  protectTxProviderInitialState
} from '../ProtectTxProvider';

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

const wrapInProvider = (component: any, values: IFormikFields) => (
  <ProtectTxContext.Provider
    // @ts-ignore
    value={{
      state: { ...protectTxProviderInitialState, formValues: values },
      updateFormValues: noOp,
      goToInitialStepOrFetchReport: noOp,
      goToNextStep: noOp,
      setWeb3Wallet: noOp
    }}
  >
    {component}
  </ProtectTxContext.Provider>
);

const ProtectTxStep1 = () =>
  wrapInProvider(
    <div style={{ maxWidth: '375px', position: 'relative' }}>
      <Panel>
        <ProtectTxProtection handleProtectTxSubmit={noopPromise} />
      </Panel>
    </div>,
    formValues as any
  );

const ProtectTxStep1Web3 = () =>
  wrapInProvider(
    <div style={{ maxWidth: '375px', position: 'relative' }}>
      <Panel>
        <ProtectTxProtection handleProtectTxSubmit={noopPromise} />
      </Panel>
    </div>,
    formValuesWeb3 as any
  );

const ProtectTxStep1Mobile = () =>
  wrapInProvider(
    <div
      style={{
        width: '700px',
        position: 'relative',
        backgroundColor: COLORS.BLACK,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <ProtectTxModalBackdrop onBackdropClick={noOp} />
      <div style={{ maxWidth: '375px', position: 'relative' }}>
        <Panel>
          <ProtectTxProtection handleProtectTxSubmit={noopPromise} />
        </Panel>
      </div>
    </div>,
    formValuesWeb3 as any
  );

storiesOf('ProtectTransaction', module)
  .addDecorator((story) => (
    <RatesContext.Provider value={ratesContextMock as any}>{story()}</RatesContext.Provider>
  ))
  .addDecorator((story) => <ProtectTxProvider>{story()}</ProtectTxProvider>)
  .add('Step 1', (_) => ProtectTxStep1(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  })
  .add('Step 1 - Web 3', (_) => ProtectTxStep1Web3(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  })
  .add('Step 1 - Mobile', (_) => ProtectTxStep1Mobile(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  });
