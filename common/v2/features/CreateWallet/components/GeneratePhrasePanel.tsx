import React, { Component } from 'react';
import { Button, Typography } from '@mycrypto/ui';

import { ContentPanel } from 'v2/components';
import { PanelProps } from '../CreateWallet';
import './GeneratePhrasePanel.scss';

// Legacy
import reloadIcon from 'common/assets/images/icn-reload.svg';

interface Props {
  words: string[];
  generateWords(): void;
}

export default class GeneratePhrasePanel extends Component<Props & PanelProps> {
  public componentDidMount() {
    const { generateWords } = this.props;

    generateWords();
  }

  public render() {
    const { words, generateWords, onBack, onNext } = this.props;

    return (
      <ContentPanel
        onBack={onBack}
        stepper={{
          current: 3,
          total: 4
        }}
        heading="Generate Phrase"
        description="Generate a mnemonic phrase and write these words down. To keep your funds safe, do not copy them to your clipboard or save them anywhere online."
        className="GeneratePhrasePanel"
      >
        <Typography className="GeneratePhrasePanel-words">{words.join(' ')}</Typography>
        <Button onClick={onNext} className="GeneratePhrasePanel-next">
          Next
        </Button>
        <div className="GeneratePhrasePanel-actions">
          <Button
            onClick={generateWords}
            className="GeneratePhrasePanel-actions-action"
            secondary={true}
          >
            <img src={reloadIcon} alt="Reload" /> Regenerate Phrase
          </Button>
        </div>
      </ContentPanel>
    );
  }
}
