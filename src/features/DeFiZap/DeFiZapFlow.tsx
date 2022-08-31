import { withRouter } from 'react-router-dom';

import ZapEducation from './components/ZapSelection';
import { IZapConfig, IZapId, ZAPS_CONFIG } from './config';
import ZapStepper from './ZapStepper';

const DeFiZapFlow = withRouter(({ match }) => {
  const { zapName: zapId } = match.params;
  const selectedZap: IZapConfig | undefined = zapId ? ZAPS_CONFIG[zapId as IZapId] : undefined;

  return <>{selectedZap ? <ZapStepper selectedZap={selectedZap} /> : <ZapEducation />}</>;
});

export default DeFiZapFlow;
