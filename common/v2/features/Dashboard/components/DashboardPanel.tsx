import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Button, Heading, Panel } from '@mycrypto/ui';

import './DashboardPanel.scss';

interface Props {
  heading: any;
  children: any;
  action?: string;
  actionLink?: string;
  className?: string;
}

export default function DashboardPanel({
  heading,
  action,
  actionLink,
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <Panel className={classnames('DashboardPanel', className)} {...rest}>
      <div className="DashboardPanel-headingWrapper">
        <Heading className="DashboardPanel-headingWrapper-heading">{heading}</Heading>
        {action &&
          actionLink && (
            <Link to={actionLink}>
              <Button className="DashboardPanel-headingWrapper-button">{action}</Button>
            </Link>
          )}
      </div>
      {children}
    </Panel>
  );
}
