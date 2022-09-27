import { storiesOf } from '@storybook/react';

import { noOp } from '@utils';

import { translateRaw } from '../translations/translateRaw';
import { UndoDeleteOverlay } from './index';

const address = '0xe25690fe5ee6a64996cdd8f2fff4bfa9b3a4585b';

const undoDeleteOverlayMobile = () => (
  <div style={{ maxWidth: '450px' }}>
    <UndoDeleteOverlay
      address={address}
      restoreAccount={noOp}
      overlayText={translateRaw('ACCOUNT_LIST_UNDO_REMOVE_OVERLAY_TEXT', {
        $label: 'Sample address 1',
        $walletId: 'MetaMask'
      })}
    />
  </div>
);

const undoDeleteOverlayDesktop = () => (
  <div style={{ maxWidth: '1000px' }}>
    <UndoDeleteOverlay
      address={address}
      restoreAccount={noOp}
      overlayText={translateRaw('ACCOUNT_LIST_UNDO_REMOVE_OVERLAY_TEXT', {
        $label: 'Sample address 1',
        $walletId: 'MetaMask'
      })}
    />
  </div>
);

storiesOf('Molecules/UndoDeleteOverlay', module)
  .add('Mobile', () => undoDeleteOverlayMobile(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/MyCrypto-GAU-Master?node-id=4494%3A135'
    }
  })
  .add('Desktop', () => undoDeleteOverlayDesktop(), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/MyCrypto-GAU-Master?node-id=4494%3A135'
    }
  });
