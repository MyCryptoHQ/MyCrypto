import React from 'react';
import { storiesOf } from '@storybook/react';
import find from 'lodash/find';

import { NetworkId, TAddress } from '@types';
import { assets } from '@database/seed/assets';
import { GetBalanceResponse, GetLastTxResponse, CryptoScamDBNoInfoResponse } from '@services';

import { ProtectTxContext } from '../index';
import { ProtectTxReport } from './ProtectTxReport';
import { ProtectTxState } from '../ProtectTxProvider';
import { Panel } from '@mycrypto/ui';

const ropstenId: NetworkId = 'Ropsten';
const asset = find(assets, { networkId: ropstenId });

const etherscanBalanceReport: GetBalanceResponse = {
  message: 'OK',
  status: '1',
  result: '547876500000000000'
};

const etherscanLastTxReport: GetLastTxResponse = {
  status: '1',
  message: 'OK',
  result: []
};

const cryptoScamAddressUnknownReport: CryptoScamDBNoInfoResponse = {
  input: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88' as TAddress,
  success: false,
  message: 'Incorrect search type (must be a BTC/BCH/ETC/ETC/LTC address / ip address / URL)'
};

const unknownProviderState: Partial<ProtectTxState> = {
  asset,
  isWeb3Wallet: false,
  receiverAddress: '0x88F7B1E26c3A52CA3cD8aF4ba1b448391eb31d88',
  etherscanBalanceReport,
  etherscanLastTxReport,
  cryptoScamAddressReport: cryptoScamAddressUnknownReport
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

const cryptoScamAddressScamReport = {
  success: true,
  input: '0x820C415a17Bf165a174e6B55232D956202d9470f',
  coin: 'ETH',
  result: {
    status: 'blocked',
    type: 'address',
    coin: 'ETH',
    entries: [
      {
        id: '1a13fc',
        name: 'etherdrop.top',
        type: 'scam',
        // tslint:disable-next-line:no-http-string
        url: 'http://etherdrop.top',
        hostname: 'etherdrop.top',
        featured: 0,
        path: '/*',
        category: 'Scamming',
        subcategory: 'Trust-Trading',
        description: 'Trust trading scam site',
        reporter: 'CryptoScamDB',
        ip: null,
        severity: 1,
        statusCode: null,
        status: null,
        updated: 1585905084551
      },
      {
        id: '23c42c',
        name: 'ethdrop.in',
        type: 'scam',
        // tslint:disable-next-line:no-http-string
        url: 'http://ethdrop.in',
        hostname: 'ethdrop.in',
        featured: 0,
        path: '/*',
        category: 'Scamming',
        subcategory: 'Trust-Trading',
        description: 'Trust trading scam site',
        reporter: 'CryptoScamDB',
        ip: null,
        severity: 1,
        statusCode: null,
        status: null,
        updated: 1585905084551
      },
      {
        id: '4c0a1b',
        name: 'btcdrop.in',
        type: 'scam',
        // tslint:disable-next-line:no-http-string
        url: 'http://btcdrop.in',
        hostname: 'btcdrop.in',
        featured: 0,
        path: '/*',
        category: 'Scamming',
        subcategory: 'Trust-Trading',
        description: 'Trust trading scam site',
        reporter: 'CryptoScamDB',
        ip: null,
        severity: 1,
        statusCode: null,
        status: null,
        updated: 1585905084551
      }
    ]
  }
};

const scamProviderState: Partial<ProtectTxState> = {
  ...unknownProviderState,
  receiverAddress: '0x820C415a17Bf165a174e6B55232D956202d9470f',
  cryptoScamAddressReport: cryptoScamAddressScamReport as any
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

const cryptoScamAddressVerifiedReport = {
  success: true,
  input: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
  coin: 'ETH',
  result: {
    status: 'whitelisted',
    type: 'address',
    coin: 'ETH',
    entries: [
      {
        id: '635b2f',
        name: 'MyCrypto',
        type: 'verified',
        url: 'https://mycrypto.com',
        hostname: 'mycrypto.com',
        featured: 1,
        path: null,
        category: null,
        subcategory: null,
        description:
          'MyCrypto is a free, open-source interface for interacting with the blockchain',
        reporter: null,
        ip: null,
        severity: null,
        statusCode: null,
        status: null,
        updated: null
      }
    ]
  }
};

const verifiedProviderState: Partial<ProtectTxState> = {
  ...unknownProviderState,
  receiverAddress: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
  cryptoScamAddressReport: cryptoScamAddressVerifiedReport as any
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
