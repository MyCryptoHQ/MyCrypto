import React from 'react';
import { Panel, Typography, Button } from '@mycrypto/ui';

import './BottomActionPanel.scss';
import translate from 'translations';
import { MYCRYPTO_SUPPORT_URL } from 'v2/features/constants';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';

export default function BottomActionPanel() {
  return (
    <Panel basic={true} className="BottomActionPanel">
      <Typography className="title">{translate('HOME_BOTTOM_TITLE')}</Typography>
      <Button onClick={() => trackButtonClick('Get Started')} className="button">
        {translate('HOME_BOTTOM_GET_STARTED')}
      </Button>
      <a
        href={MYCRYPTO_SUPPORT_URL}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackButtonClick('Have Questions?')}
      >
        <Typography className="link">{translate('HOME_BOTTOM_HELP')}</Typography>
      </a>
    </Panel>
  );
}

const trackButtonClick = (button: string) => {
  AnalyticsService.instance.track(ANALYTICS_CATEGORIES.HOME, `${button} button clicked`);
};
