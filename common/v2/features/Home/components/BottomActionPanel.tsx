import React from 'react';
import { Panel, Typography, Button } from '@mycrypto/ui';

import './BottomActionPanel.scss';
import translate from 'translations';
import { MYCRYPTO_SUPPORT_URL } from 'v2/features/constants';

export default function BottomActionPanel() {
  return (
    <Panel basic={true} className="BottomActionPanel">
      <Typography className="title">{translate('HOME_BOTTOM_TITLE')}</Typography>
      <Button className="button">{translate('HOME_BOTTOM_GET_STARTED')}</Button>
      <a href={MYCRYPTO_SUPPORT_URL} target="_blank">
        <Typography className="link">{translate('HOME_BOTTOM_HELP')}</Typography>
      </a>
    </Panel>
  );
}
