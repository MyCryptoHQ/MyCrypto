import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button, Typography } from '@mycrypto/ui';

import SteppedPanel from './SteppedPanel';
import './GeneratePhrasePanel.scss';

// Legacy
import reloadIcon from 'common/assets/images/icn-reload.svg';

export function GeneratePhrasePanel({ history }: RouteComponentProps<{}>) {
  return (
    <SteppedPanel
      heading="Generate Phrase"
      description="Generate a mnemonic phrase and write these words down. To keep your funds safe, do not copy them to your clipboard or save them anywhere online."
      currentStep={3}
      totalSteps={4}
      onBack={history.goBack}
      className="GeneratePhrasePanel"
    >
      <Typography className="GeneratePhrasePanel-words">Derp derp derp</Typography>
      <Button className="GeneratePhrasePanel-next">Next</Button>
      <div className="GeneratePhrasePanel-actions">
        <Button className="GeneratePhrasePanel-actions-action" secondary={true}>
          <img src={reloadIcon} alt="Reload" /> Regenerate Phrase
        </Button>
      </div>
    </SteppedPanel>
  );
}

export default withRouter(GeneratePhrasePanel);
