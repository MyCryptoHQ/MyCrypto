import React from 'react';
import { storiesOf } from '@storybook/react';

import { noOp } from '@utils';

import { ProtectTxAbort } from './ProtectTxAbort';
import ProtectTxProvider from '../ProtectTxProvider';

const AbortTransaction = () => (
  <div style={{ width: '700px', position: 'relative' }}>
    <ProtectTxAbort onTxSent={noOp} />
  </div>
);

storiesOf('ProtectTransaction', module)
  .addDecorator((story) => <ProtectTxProvider>{story()}</ProtectTxProvider>)
  .add('Abort transaction', (_) => AbortTransaction(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  });
