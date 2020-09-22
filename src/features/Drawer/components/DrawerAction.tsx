import React from 'react';

import { Button, Typography } from '@mycrypto/ui';
import { Link } from 'react-router-dom';

import './DrawerAction.scss';

interface Props {
  icon: string;
  title: string;
  link?: string;
  onClick?(): void;
}

export default function DrawerAction({ icon, title, link, onClick }: Props) {
  const sharedProps = {
    className: 'DrawerAction',
    children: (
      <>
        <img src={icon} alt={title} className="DrawerAction-icon" />
        <Typography className="DrawerAction-text">{title}</Typography>
      </>
    )
  };

  return link ? (
    <Link to={link} {...sharedProps} />
  ) : (
    <Button basic={true} onClick={onClick} {...sharedProps} />
  );
}
