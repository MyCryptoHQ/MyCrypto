import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mycrypto/ui';

import { Action } from '../types';
import './ActionTile.scss';

type Props = Action;

export default function ActionTile({ icon, title, link }: Props) {
  return (
    <Link to={link} className="ActionTile">
      <Button basic={true} className="ActionTile-button">
        <img className="ActionTile-button-icon" src={icon} alt={title} />
        <Typography className="ActionTile-button-title">{title}</Typography>
      </Button>
    </Link>
  );
}
