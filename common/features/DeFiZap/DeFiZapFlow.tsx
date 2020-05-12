import React from 'react';
import { withRouter } from 'react-router-dom';

import { ZapEducation } from './components';
import { IZapConfig, ZAPS_CONFIG, IZapId } from './config';
import { ZapStepper } from '.';

export const DeFiZapFlow = withRouter(({ match }) => {
  const { zapName: zapId } = match.params;
  const selectedZap: IZapConfig | undefined = zapId ? ZAPS_CONFIG[zapId as IZapId] : undefined;

  return <>{selectedZap ? <ZapStepper selectedZap={selectedZap} /> : <ZapEducation />}</>;
});

export default DeFiZapFlow;
