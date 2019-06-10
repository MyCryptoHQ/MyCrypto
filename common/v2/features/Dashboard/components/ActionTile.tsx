import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mycrypto/ui';

import { Action } from '../types';
import './ActionTile.scss';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';

type Props = Action;

const trackAction = (analyticsMessage: string) => {
  AnalyticsService.instance.track(ANALYTICS_CATEGORIES.DASHBOARD, analyticsMessage);
};

const ActionTile = React.memo(function ActionTileButton({
  icon,
  title,
  description,
  path,
  url,
  tracking
}: Props) {
  const [randomWallet, setRandomWallet] = useState();
  if (Array.isArray(url)) {
    const walletOptions = 2;
    if (randomWallet === undefined) {
      setRandomWallet(Math.floor(Math.random() * Math.floor(walletOptions)));
    }
    return (
      <a
        href={url[randomWallet]}
        target="_blank"
        className="ActionTile"
        onClick={() => trackAction(tracking[randomWallet])}
        rel="noreferrer"
      >
        <Button basic={true} className="ActionTile-button">
          <img
            className="ActionTile-button-icon wallet-icon"
            src={icon[randomWallet]}
            alt={title}
          />
          <Typography as="div" className="ActionTile-button-title">
            {title}
            <span className="ActionTile-button-title-description">{description[randomWallet]}</span>
          </Typography>
        </Button>
      </a>
    );
  }

  if (url && !Array.isArray(tracking) && !Array.isArray(icon)) {
    return (
      <a
        href={url}
        target="_blank"
        className="ActionTile"
        onClick={() => trackAction(tracking)}
        rel="noreferrer"
      >
        <Button basic={true} className="ActionTile-button">
          <img className="ActionTile-button-icon" src={icon} alt={title} />
          <Typography as="div" className="ActionTile-button-title">
            {title}
            <span className="ActionTile-button-title-description">{description}</span>
          </Typography>
        </Button>
      </a>
    );
  }
  return (
    <Link to={String(path)} className="ActionTile" onClick={() => trackAction(String(tracking))}>
      <Button basic={true} className="ActionTile-button">
        <img className="ActionTile-button-icon" src={String(icon)} alt={title} />
        <Typography as="div" className="ActionTile-button-title">
          {title}
          <span className="ActionTile-button-title-description">{description}</span>
        </Typography>
      </Button>
    </Link>
  );
});

export default ActionTile;
