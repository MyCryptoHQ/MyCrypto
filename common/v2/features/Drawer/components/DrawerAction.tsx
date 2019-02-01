import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mycrypto/ui';

import './DrawerAction.scss';

interface Props {
  icon: string;
  title: string;
  link?: string;
  onClick(): void;
}

export default function DrawerAction({ icon, title, link, onClick }: Props) {
  const Render = link ? Link : Button;
  const props = link
    ? {
        to: link
      }
    : {
        basic: true,
        onClick
      };

  return (
    <Render className="DrawerAction" {...props}>
      <img src={icon} alt={title} className="DrawerAction-icon" />
      <Typography className="DrawerAction-text">{title}</Typography>
    </Render>
  );
}
