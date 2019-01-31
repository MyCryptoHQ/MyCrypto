import React from 'react';
import { Button, Typography } from '@mycrypto/ui';

import './DrawerAction.scss';

interface Props {
  icon: string;
  title: string;
  onClick(): void;
}

export default function DrawerAction({ icon, title, onClick }: Props) {
  return (
    <Button className="DrawerAction" basic={true} onClick={onClick}>
      <img src={icon} alt={title} className="DrawerAction-icon" />
      <Typography className="DrawerAction-text">{title}</Typography>
    </Button>
  );
}
