import React from 'react';
import classnames from 'classnames';
import { Button, Heading, Panel, Typography } from '@mycrypto/ui';

import Stepper from './Stepper';
import './ContentPanel.scss';

// Legacy
import backArrowIcon from 'common/assets/images/icn-back-arrow.svg';

interface Props {
  children: any;
  className: string;
  heading: string;
  icon?: string;
  description?: string;
  stepper?: {
    current: number;
    total: number;
  };
  onBack(): void;
}

export default function ContentPanel({
  onBack,
  stepper,
  heading,
  icon,
  description,
  children,
  className = '',
  ...rest
}: Props) {
  const topClassName = classnames('ContentPanel-top', {
    'ContentPanel-stepperOnly': stepper && !onBack
  });

  return (
    <div className="ContentPanel">
      {(onBack || stepper) && (
        <div className={topClassName}>
          {onBack && (
            <Button basic={true} className="ContentPanel-top-back" onClick={onBack}>
              <img src={backArrowIcon} alt="Back arrow" /> Back
            </Button>
          )}
          {stepper && <Stepper current={stepper.current} total={stepper.total} />}
        </div>
      )}
      <Panel className={className} {...rest}>
        {heading && (
          <Heading className="ContentPanel-heading">
            {heading}
            {icon && <img src={icon} alt="Icon" className="ContentPanel-heading-icon" />}
          </Heading>
        )}
        {description && <Typography className="ContentPanel-description">{description}</Typography>}
        {children}
      </Panel>
    </div>
  );
}
