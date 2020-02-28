import React from 'react';

import { fAccount } from '@fixtures';
import { noOp, bnify } from 'v2/utils';
import { TSymbol } from 'v2/types';
import { default as ConfirmSwap } from './ConfirmSwap';

const props = {
  fromAsset: {
    name: 'DAI (DAI)',
    symbol: 'DAI' as TSymbol,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f'
  },
  toAsset: {
    name: 'Streamr (DATA)',
    symbol: 'DATA' as TSymbol,
    address: '0x0Cf0Ee63788A0849fE5297F3407f701E122cC023'
  },
  toAmount: bnify('0.2848588479727003'),
  fromAmount: bnify('0.004'),
  exchangeRate: bnify('73.04073024941033'),
  account: fAccount
};

export default { title: 'ConfirmSwap' };

export const confirmSwapMultiTx = () => (
  <div className="sb-container" style={{ maxWidth: '580px' }}>
    <ConfirmSwap
      fromAsset={props.fromAsset}
      toAsset={props.toAsset}
      fromAmount={props.fromAmount}
      toAmount={props.toAmount}
      account={props.account}
      exchangeRate={props.exchangeRate}
      isSubmitting={false}
      isMultiStep={true}
      onSuccess={noOp}
    />
  </div>
);

export const confirmSwapSingleTx = () => (
  <div className="sb-container" style={{ maxWidth: '580px' }}>
    <ConfirmSwap
      fromAsset={props.fromAsset}
      toAsset={props.toAsset}
      fromAmount={props.fromAmount}
      toAmount={props.toAmount}
      account={props.account}
      exchangeRate={props.exchangeRate}
      isSubmitting={false}
      isMultiStep={false}
      onSuccess={noOp}
    />
  </div>
);

(confirmSwapSingleTx as any).story = {
  name: 'ConfirmSwap - single',
  parameters: {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/MyCrypto-GAU-Master?node-id=325%3A79384'
    }
  }
};

(confirmSwapMultiTx as any).story = {
  name: 'ConfirmSwap - multi',
  parameters: {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/MyCrypto-GAU-Master?node-id=325%3A79384'
    }
  }
};
