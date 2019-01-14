import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button, Typography } from '@mycrypto/ui';

import SteppedPanel from './SteppedPanel';
import './ConfirmPhrasePanel.scss';

export function ConfirmPhrasePanel({ history }: RouteComponentProps<{}>) {
  return (
    <SteppedPanel
      heading="Confirm Phrase"
      description="Confirm your mnemonic phrase by selecting each phrase in order to make sure it is correct. Drag and drop to arrange the word."
      currentStep={4}
      totalSteps={4}
      onBack={history.goBack}
      className="ConfirmPhrasePanel"
    >
      <div className="ConfirmPhrasePanel-activeWords">
        <span className="ConfirmPhrasePanel-activeWords-word">correct</span>
        <span className="ConfirmPhrasePanel-activeWords-word">shiver</span>
      </div>
      <div className="ConfirmPhrasePanel-selectableWords">
        <div className="ConfirmPhrasePanel-selectableWords-row">
          <div className="ConfirmPhrasePanel-selectableWords-row-entry">Derp</div>
          <div className="ConfirmPhrasePanel-selectableWords-row-entry">Derp</div>
          <div className="ConfirmPhrasePanel-selectableWords-row-entry">Derp</div>
          <div className="ConfirmPhrasePanel-selectableWords-row-entry">Derp</div>
        </div>
      </div>
      <Button className="ConfirmPhrasePanel-next">Confirm Phrase</Button>
    </SteppedPanel>
  );
}

export default withRouter(ConfirmPhrasePanel);
