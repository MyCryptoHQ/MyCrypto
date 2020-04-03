import React, { useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import noop from 'lodash/noop';
import { ProtectTxAbort } from './ProtectTxAbort';

const AbortTransactionButton = () => {
  const [protectTxCounter, setProtectTxCounter] = React.useState(20);
  useEffect(() => {
    let protectTxTimer: ReturnType<typeof setTimeout> | null = null;
    if (protectTxCounter > 0) {
      protectTxTimer = setTimeout(() => setProtectTxCounter(prevCount => prevCount - 1), 1000);
    }
    return () => {
      if (protectTxTimer) {
        clearTimeout(protectTxTimer);
      }
    };
  }, [protectTxCounter]);

  return (
    <div style={{ width: '700px', position: 'relative' }}>
      <ProtectTxAbort
        countdown={protectTxCounter}
        onAbortTransaction={noop}
        onSendTransaction={noop}
      />
    </div>
  );
};

storiesOf('ProtectTransaction', module).add('Abort transaction', _ => AbortTransactionButton(), {
  design: {
    type: 'figma',
    url:
      'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
  }
});
