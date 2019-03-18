import React from 'react';
import { Panel, Typography, Button } from '@mycrypto/ui';

import './BottomActionPanel.scss';
import translate from 'translations';

export default function BottomActionPanel() {
  return (
    <Panel basic={true} className="BottomActionPanel">
      <Typography className="BottomActionPanel-title">{translate('HOME_BOTTOM_TITLE')}</Typography>
      <Button className="BottomActionPanel-button">{translate('HOME_BOTTOM_GET_STARTED')}</Button>
      <Typography className="BottomActionPanel-link">{translate('HOME_BOTTOM_HELP')}</Typography>
    </Panel>
  );
}
