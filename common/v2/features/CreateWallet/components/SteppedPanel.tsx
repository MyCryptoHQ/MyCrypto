import React from 'react';
import classnames from 'classnames';
import { Heading, Typography } from '@mycrypto/ui';

import { ContentPanel, Stepper } from 'v2/components';
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
    <ContentPanel onBack={onBack} className={steppedPanelClassName}>
      <div className="SteppedPanel-top">
        <Stepper current={currentStep} total={totalSteps} className="SteppedPanel-top-stepper" />
        <Heading className="SteppedPanel-top-heading">{heading}</Heading>
      </div>
      <Typography>{description}</Typography>
      {children}
    </ContentPanel>
  );
}
