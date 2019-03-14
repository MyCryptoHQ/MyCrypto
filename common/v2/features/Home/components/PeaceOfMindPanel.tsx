import React from 'react';
import { Panel, Typography, Button } from '@mycrypto/ui';

import './PeaceOfMindPanel.scss';

import vaultIcon from 'common/assets/images/icn-vault2.svg';

interface ContentItemProps {
  icon: string;
  description: string;
}

const ContentItem: React.SFC<ContentItemProps> = props => {
  const { icon, description } = props;
  return (
    <div className="PeaceOfMindPanel-content-item">
      <img src={icon} className="PeaceOfMindPanel-content-item-image" />
      <Typography className="PeaceOfMindPanel-content-item-description">{description}</Typography>
    </div>
  );
};

export default function PeaceOfMindPanel() {
  return (
    <Panel basic={true} className="PeaceOfMindPanel">
      <div className="PeaceOfMindPanel-titleArea">
        <Typography className="PeaceOfMindPanel-titleArea-title">
          Finally Enjoy Peace of Mind
        </Typography>
        <Typography className="PeaceOfMindPanel-titleArea-description">
          MyCrypto puts your safety & security first.
        </Typography>
      </div>
      <div className="PeaceOfMindPanel-content">
        <ContentItem
          icon={vaultIcon}
          description="Get your information out of other people's hands and back into yours."
        />
        <ContentItem
          icon={vaultIcon}
          description="Protect yourself from phishing attacks and malicious extensions."
        />
        <ContentItem
          icon={vaultIcon}
          description="Open-source, fully audited, and fully verifiable."
        />
      </div>
      <div className="PeaceOfMindPanel-actions">
        <Button className="PeaceOfMindPanel-actions-button">Get Started on Web</Button>
        <Button className="PeaceOfMindPanel-actions-button">Download the Desktop App </Button>
      </div>
    </Panel>
  );
}
