import { storiesOf } from '@storybook/react';

import { noOp } from '@utils';

import { ProtectTxButton } from './ProtectTxButton';

const ProtectTransactionButton = () => (
  <div style={{ maxWidth: '500px', position: 'relative' }}>
    <ProtectTxButton onClick={noOp} protectTxShow={false} stepper={() => <></>} />
  </div>
);

const ProtectTransactionButtonProtected = () => (
  <div style={{ maxWidth: '500px', position: 'relative' }}>
    <ProtectTxButton
      reviewReport={true}
      onClick={noOp}
      protectTxShow={false}
      stepper={() => <></>}
    />
  </div>
);

storiesOf('Features/ProtectTransaction/Button', module)
  .add('Protect transaction button', () => ProtectTransactionButton(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  })
  .add('Protect transaction button protected', () => ProtectTransactionButtonProtected());
