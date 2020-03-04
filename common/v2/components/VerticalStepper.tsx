import React from 'react';

import styled, { css } from 'styled-components';
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import Steps, { Step } from 'rc-steps';

import Spinner from './Spinner';
import Typography from './Typography';
import Button from './Button';
import { COLORS, SPACING, FONT_SIZE } from 'v2/theme';

import checkmark from 'assets/images/icn-checkmark-white.svg';

interface StepData {
  icon: string;
  title: React.ReactNode | string;
  description: React.ReactNode | string;
}

interface Props {
  currentStep?: number;
  steps: StepData[];
}

interface StepProps {
  active: boolean;
}

const SSteps = styled(Steps)``;

const SStep = styled(Step)<StepProps>`
  && .rc-steps-item-icon {
    background-color: ${props => (props.active ? COLORS.WHITE : COLORS.BLUE_BRIGHT)};
    border-color: ${COLORS.BLUE_BRIGHT};
  }
  && .rc-steps-icon {
    color: ${props => (props.active ? COLORS.BLUE_BRIGHT : COLORS.WHITE)};
  }
`;

const Icon = styled.img`
  width: ${FONT_SIZE.XL};
`;

function VerticalStepper({ currentStep = 0, steps }: Props) {
  const icons = {
    finish: <img src={checkmark} />
  };
  return (
    <SSteps current={currentStep} direction="vertical" icons={icons}>
      {steps.map((s, index) => (
        <SStep
          active={currentStep === index}
          title={<StepperTitle title={s.title} icon={s.icon} />}
          description={
            <StepperDescription active={currentStep === index} description={s.description} />
          }
        />
      ))}
    </SSteps>
  );
}

function StepperTitle({ icon, title }) {
  return (
    <>
      <Icon src={icon} />
      {title}
    </>
  );
}

function StepperDescription({ active, description }) {
  return (
    <>
      <div>{description}</div>
      <Button disabled={!active}>Activate</Button>
    </>
  );
}

export default VerticalStepper;
