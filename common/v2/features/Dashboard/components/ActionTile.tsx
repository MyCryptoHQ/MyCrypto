import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mycrypto/ui';

import { Action } from '../types';
import './ActionTile.scss';

type Props = Action;

export default function ActionTile({ icon, title, description, link }: Props) {
  return (
    <Link to={link} className="ActionTile">
      <Button basic={true} className="ActionTile-button">
        <img className="ActionTile-button-icon" src={icon} alt={title} />
        <Typography as="div" className="ActionTile-button-title">
          {title}
          <span className="ActionTile-button-title-description">{description}</span>
        </Typography>
      </Button>
    </Link>
  );
}
