import React from 'react';
import { storiesOf } from '@storybook/react';

import { Panel } from '@mycrypto/ui';
import { noOp } from '@utils';
import { unknownReport, scamReport, verifiedReport, loadingReport } from '@fixtures';

import { ProtectTxReportUI } from './ProtectTxReport';
import { PTXReport } from '../types';

const ProtectTxStep3 = (report: PTXReport) => (
  <div style={{ maxWidth: '375px', position: 'relative' }}>
    <Panel>
      <ProtectTxReportUI report={report} onHide={noOp} isWeb3={false} />
    </Panel>
  </div>
);

storiesOf('ProtectTransaction', module).add(
  'Step 3 - Unknown',
  () => ProtectTxStep3(unknownReport),
  {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  }
);

storiesOf('ProtectTransaction', module).add('Step 3 - Scam', () => ProtectTxStep3(scamReport), {
  design: {
    type: 'figma',
    url:
      'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
  }
});

storiesOf('ProtectTransaction', module).add(
  'Step 3 - Verified',
  () => ProtectTxStep3(verifiedReport),
  {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  }
);

storiesOf('ProtectTransaction', module).add(
  'Step 3 - Loading',
  () => ProtectTxStep3(loadingReport),
  {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  }
);
