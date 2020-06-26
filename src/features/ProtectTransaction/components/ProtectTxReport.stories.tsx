import React from 'react';
import { storiesOf } from '@storybook/react';
import find from 'lodash/find';

import { NetworkId, TAddress } from '@types';
import { assets } from '@database/seed/assets';
import { GetBalanceResponse, GetTxResponse } from '@services';

import { ProtectTxReport } from './ProtectTxReport';
import { ProtectTxState, ProtectTxContext } from '../ProtectTxProvider';
import { Panel } from '@mycrypto/ui';

const ropstenId: NetworkId = 'Ropsten';
const asset = find(assets, { networkId: ropstenId });

const etherscanBalanceReport: GetBalanceResponse = {
  message: 'OK',
  status: '1',
  result: '547876500000000000'
};

const etherscanLastTxReport: GetTxResponse = {
  status: '1',
  message: 'OK',
  result: []
};

const unknownProviderState: Partial<ProtectTxState> = {
  asset,
  isWeb3Wallet: false,
  receiverAddress: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88',
  etherscanBalanceReport,
  etherscanLastTxReport,
  nansenAddressReport: {
    address: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88' as TAddress,
    label: []
  }
};

const ProtectTxStep3 = () => (
  <div style={{ maxWidth: '375px', position: 'relative' }}>
    <Panel>
      <ProtectTxReport />
    </Panel>
  </div>
);

storiesOf('ProtectTransaction', module)
  .addDecorator((story) => (
    <ProtectTxContext.Provider value={{ state: unknownProviderState } as any}>
      {story()}
    </ProtectTxContext.Provider>
  ))
  .add('Step 3 - Unknown', (_) => ProtectTxStep3(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  });

const nansenReport = {
  address: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88' as TAddress,
  label: ['Scam']
};

const scamProviderState: Partial<ProtectTxState> = {
  ...unknownProviderState,
  receiverAddress: '0x820C415a17Bf165a174e6B55232D956202d9470f',
  nansenAddressReport: nansenReport
};

storiesOf('ProtectTransaction', module)
  .addDecorator((story) => (
    <ProtectTxContext.Provider value={{ state: scamProviderState } as any}>
      {story()}
    </ProtectTxContext.Provider>
  ))
  .add('Step 3 - Scam', (_) => ProtectTxStep3(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  });

const verifiedProviderState: Partial<ProtectTxState> = {
  ...unknownProviderState,
  receiverAddress: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
  nansenAddressReport: {
    address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress,
    label: ['MyCrypto: Donate']
  }
};

storiesOf('ProtectTransaction', module)
  .addDecorator((story) => (
    <ProtectTxContext.Provider value={{ state: verifiedProviderState } as any}>
      {story()}
    </ProtectTxContext.Provider>
  ))
  .add('Step 3 - Verified', (_) => ProtectTxStep3(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  });
