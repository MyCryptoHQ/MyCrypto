import React from 'react';

import styled from 'styled-components';
import 'rc-steps/assets/index.css';
//@ts-ignore No types available at the moment
import Steps, { Step } from 'rc-steps';

import Typography from './Typography';
import Button from './Button';
import { COLORS, SPACING, FONT_SIZE } from 'v2/theme';

import checkmark from 'assets/images/icn-checkmark-white.svg';
import { translateRaw } from 'v2/translations';

interface StepData {
  icon?: string;
  title: React.ReactNode | string;
  content: React.ReactNode | string;
  buttonText: string;
  loading?: boolean;
  onClick?(): void;
}

export interface Props {
  currentStep?: number;
  steps: StepData[];
}

interface StepProps {
  active: boolean;
  finished: boolean;
}

// Can't use the usual way since the Step component adds all props to an underlying div which React doesn't like
const SStep = styled(
  ({ active, finished, ...rest }: StepProps & React.ComponentProps<typeof Step>) => (
    <Step {...rest} />
  )
)`
  && .rc-steps-item-icon {
    background-color: ${props =>
      props.active || props.finished ? COLORS.BLUE_BRIGHT : COLORS.WHITE};
    border-color: ${COLORS.BLUE_BRIGHT};
  }
  && .rc-steps-icon {
    color: ${props => (props.active ? COLORS.WHITE : COLORS.BLUE_BRIGHT)};
    img {
      width: ${FONT_SIZE.SM};
    }
  }
  && .rc-steps-item-tail {
    top: -5px;
    padding-bottom: 0;
    height: 110%;
  }
  && .rc-steps-item-tail:after {
    background-color: ${COLORS.BLUE_BRIGHT};
  }
`;

function VerticalStepper({ currentStep = 0, steps }: Props) {
  const icons = {
    finish: <img src={checkmark} />
  };
  return (
    <Steps current={currentStep} direction="vertical" icons={icons}>
      {steps.map((s, index) => {
        const active = currentStep === index;
        const finished = currentStep > index;
        return (
          <SStep
            key={index}
            active={active}
            finished={finished}
            title={<StepperTitle title={s.title} icon={s.icon} finished={finished} />}
            description={
              !finished && (
                <StepperContent
                  active={active}
                  content={s.content}
                  buttonText={s.buttonText}
                  loading={s.loading}
                  onClick={s.onClick}
                />
              )
            }
          />
        );
      })}
    </Steps>
  );
}

interface TitleProps {
  icon?: string;
  title: React.ReactNode | string;
  finished: boolean;
}

const TitleWrapper = styled.div`
  display: flex;
`;

const TitleTypography = styled(Typography)<{ finished: boolean }>`
  ${props => props.finished && `color: ${COLORS.GREY_LIGHT}`};
`;

const FinishedTypography = styled(Typography)`
  margin-left: ${SPACING.SM};
  font-style: italic;
  color: ${COLORS.LIGHT_PURPLE};
`;

const Icon = styled.img`
  width: ${FONT_SIZE.XL};
  margin-right: ${SPACING.XS};
`;

function StepperTitle({ icon, title, finished }: TitleProps) {
  return (
    <TitleWrapper>
      {icon && <Icon src={icon} />}
      <TitleTypography bold={true} finished={finished}>
        {title}
      </TitleTypography>
      {finished && <FinishedTypography>{translateRaw('STEP_FINISHED')}</FinishedTypography>}
    </TitleWrapper>
  );
}

interface DescriptionProps {
  active: boolean;
  content: React.ReactNode | string;
  buttonText: string;
  loading?: boolean;
  onClick?(): void;
}

const ContentWrapper = styled.div`
  padding: ${SPACING.XS};
`;

const SButton = styled(Button)`
  margin-top: ${SPACING.SM};
`;

function StepperContent({ active, content, buttonText, loading, onClick }: DescriptionProps) {
  return (
    <ContentWrapper>
      <Typography as={'div'}>{content}</Typography>
      <SButton disabled={!active} loading={loading} onClick={onClick}>
        {buttonText}
      </SButton>
    </ContentWrapper>
  );
}

export default VerticalStepper;
