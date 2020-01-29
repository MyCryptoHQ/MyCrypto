import React from 'react';
import { withRouter } from 'react-router-dom';

import { DeFiZapEducation } from './components';
import { IZapConfig, ZAPS_CONFIG } from './config';
import { ZapStepper } from '.';

export const DeFiZapFlow = withRouter(({ match }) => {
  const { zapName: zapId } = match.params;
  const selectedZap: IZapConfig | undefined = zapId ? ZAPS_CONFIG[zapId] : undefined;

  console.debug('[DeFiZapFlow]: selectedZap: ', selectedZap);
  return <>{selectedZap ? <ZapStepper selectedZap={selectedZap} /> : <DeFiZapEducation />}</>;
});

export default DeFiZapFlow;
