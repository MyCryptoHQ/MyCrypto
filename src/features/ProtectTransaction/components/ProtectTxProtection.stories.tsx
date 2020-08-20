import React from 'react';
import { storiesOf } from '@storybook/react';
import { Panel } from '@mycrypto/ui';

import { COLORS } from '@theme';
import { noOp, bigify } from '@utils';
import { Fiats } from '@config';

import { ProtectTxProtectionUI, UIProps } from './ProtectTxProtection';
import ProtectTxModalBackdrop from './ProtectTxModalBackdrop';
import { ProtectTxError } from '..';

const defaultProps: UIProps = {
  error: ProtectTxError.NO_ERROR,
  fiat: Fiats.USD,
  isLoading: false,
  feeAmount: { rate: 250, amount: bigify('0.002'), fee: bigify('0.002') },
  web3Wallet: { isWeb3Wallet: true, name: 'MetaMask' },
  isMyCryptoMember: false,
  onCancel: noOp,
  onProtect: noOp
};

const ProtectTxStep1 = () => (
  <div style={{ maxWidth: '375px', position: 'relative' }}>
    <Panel>
      <ProtectTxProtectionUI {...defaultProps} web3Wallet={{ isWeb3Wallet: false, name: null }} />
    </Panel>
  </div>
);

const ProtectTxStep1Web3 = () => (
  <div style={{ maxWidth: '375px', position: 'relative' }}>
    <Panel>
      <ProtectTxProtectionUI {...defaultProps} />
    </Panel>
  </div>
);
const ProtectTxStep1Mobile = () => (
  <>
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
          <ProtectTxProtectionUI {...defaultProps} />
        </Panel>
      </div>
    </div>
  </>
);
storiesOf('ProtectTransaction', module)
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
