import React from 'react';
import { Panel, Typography, Button } from '@mycrypto/ui';

import './BottomActionPanel.scss';

export default function BottomActionPanel() {
  return (
    <Panel basic={true} className="BottomActionPanel">
      <Typography className="BottomActionPanel-title">
        Ready to start managing your funds safely and confidently?
      </Typography>
      <Button className="BottomActionPanel-button">Get Started</Button>
      <Typography className="BottomActionPanel-link">
        Have Questions? We're Here to Help!
      </Typography>
    </Panel>
  );
}
