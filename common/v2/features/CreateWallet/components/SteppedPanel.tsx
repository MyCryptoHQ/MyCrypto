import React from 'react';
import classnames from 'classnames';
import { Heading, Typography } from '@mycrypto/ui';

import { ContentPanel } from 'v2/components';
import './SteppedPanel.scss';

interface Props {
  children: any;
  currentStep: number;
  description: string;
  heading: string;
  totalSteps: number;
  className?: string;
  onBack(): void;
}

export default function SteppedPanel({
  heading,
  description,
  currentStep,
  totalSteps,
  onBack,
  className = '',
  children
}: Props) {
  const steppedPanelClassName = classnames('SteppedPanel', className);

  return (
    <ContentPanel
      onBack={onBack}
      stepper={{
        current: currentStep,
        total: totalSteps
      }}
      className={steppedPanelClassName}
    >
      <Heading className="SteppedPanel-heading">{heading}</Heading>
      <Typography>{description}</Typography>
      {children}
    </ContentPanel>
  );
}
