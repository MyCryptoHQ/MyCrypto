import React from 'react';

import { storiesOf } from '@storybook/react';
import { ProvidersWrapper } from 'test-utils';

import { FeatureFlagProvider } from '@services/FeatureFlagProvider';
import { DataProvider } from '@services/Store';
import { noOp } from '@utils';

import ProtectTxProvider from '../ProtectTxProvider';
import { ProtectTxAbort } from './ProtectTxAbort';

const AbortTransaction = () => (
  <ProvidersWrapper>
    <FeatureFlagProvider>
      <DataProvider>
        <ProtectTxProvider>
          <div style={{ width: '700px', position: 'relative' }}>
            <ProtectTxAbort onTxSent={noOp} />
          </div>
        </ProtectTxProvider>
      </DataProvider>
    </FeatureFlagProvider>
  </ProvidersWrapper>
);

storiesOf('Features/ProtectTransaction/Abort', module).add(
  'Abort transaction',
  () => AbortTransaction(),
  {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/%5BMyCrypto%5D-GAU-Master?node-id=5137%3A5310'
    }
  }
);
