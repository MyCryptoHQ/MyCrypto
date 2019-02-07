import React from 'react';
import { Button, Typography } from '@mycrypto/ui';

import { ContentPanel } from 'v2/components';
import { PanelProps } from '../CreateWallet';
import './BackUpPhrasePanel.scss';

// Legacy
import printerIcon from 'common/assets/images/icn-printer.svg';

interface Props {
  words: string[];
}

export default function BackUpPhrasePanel({ words, onBack, onNext }: Props & PanelProps) {
  return (
    <ContentPanel
      onBack={onBack}
      stepper={{
        current: 4,
        total: 5
      }}
      heading="Back Up Phrase"
      description="Write your phrase down or print it out for safekeeping. You will be asked to verify your phrase on the next screen. "
      className="BackUpPhrasePanel"
    >
      <Typography className="BackUpPhrasePanel-words">{words.join(' ')}</Typography>
      <Button onClick={onNext} className="BackUpPhrasePanel-next">
        Next
      </Button>
      <div className="BackUpPhrasePanel-actions">
        <Button className="BackUpPhrasePanel-actions-action" secondary={true}>
          <img src={printerIcon} alt="Print" /> Print Paper Wallet
        </Button>
      </div>
    </ContentPanel>
  );
}
