import React from 'react';
import noop from 'lodash/noop';
import { storiesOf } from '@storybook/react';

import { UndoDeleteOverlay } from './index';
import { translateRaw } from '../translations';

const address = '0xe25690fe5ee6a64996cdd8f2fff4bfa9b3a4585b';
const restoreAccount = noop;

const undoDeleteOverlayMobile = () => (
  <div style={{ maxWidth: '450px' }}>
    <UndoDeleteOverlay
      address={address}
      restoreAccount={restoreAccount}
      overlayText={translateRaw('ACCOUNT_LIST_UNDO_DELETE_OVERLAY_TEXT', {
        $label: 'Sample address 1',
        $walletId: 'Metamask'
      })}
    />
  </div>
);

const undoDeleteOverlayDesktop = () => (
  <div style={{ maxWidth: '1000px' }}>
    <UndoDeleteOverlay
      address={address}
      restoreAccount={restoreAccount}
      overlayText={translateRaw('ACCOUNT_LIST_UNDO_DELETE_OVERLAY_TEXT', {
        $label: 'Sample address 1',
        $walletId: 'Metamask'
      })}
    />
  </div>
);

storiesOf('UndoDeleteOverlay', module)
  .add('Mobile', (_) => undoDeleteOverlayMobile(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/MyCrypto-GAU-Master?node-id=4494%3A135'
    }
  })
  .add('Desktop', (_) => undoDeleteOverlayDesktop(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/MyCrypto-GAU-Master?node-id=4494%3A135'
    }
  });
