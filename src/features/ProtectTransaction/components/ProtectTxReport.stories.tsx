import { Panel } from '@mycrypto/ui';
import { storiesOf } from '@storybook/react';

import { loadingReport, scamReport, unknownReport, verifiedReport } from '@fixtures';
import { noOp } from '@utils';

import { PTXReport } from '../types';
import { ProtectTxReportUI } from './ProtectTxReport';

const ProtectTxStep3 = (report: PTXReport) => (
  <div style={{ maxWidth: '375px', position: 'relative' }}>
    <Panel>
      <ProtectTxReportUI report={report} onHide={noOp} isWeb3={false} />
    </Panel>
  </div>
);

storiesOf('Features/ProtectTransaction/Report', module)
  .add('Step 3 - Unknown', () => ProtectTxStep3(unknownReport), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  })
  .add('Step 3 - Scam', () => ProtectTxStep3(scamReport), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  })
  .add('Step 3 - Verified', () => ProtectTxStep3(verifiedReport), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  })
  .add('Step 3 - Loading', () => ProtectTxStep3(loadingReport), {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  });
