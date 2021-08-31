import 'rc-steps/assets/index.css';
import { ComponentProps, ReactNode } from 'react';

import Steps, { Step } from 'rc-steps';
import styled from 'styled-components';

import checkmark from '@assets/images/icn-checkmark-white.svg';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { formatSupportEmail } from '@utils';

import Button from './Button';
import { InlineMessage } from './InlineMessage';
import Typography from './Typography';

export interface StepData {
  icon?: string;
  title: ReactNode | string;
  content: ReactNode | string;
  buttonText?: string;
  loading?: boolean;
  onClick?(): void;
}

export interface Props {
  currentStep?: number;
  size?: 'sm' | 'lg';
  color?: string;
  steps: StepData[];
  error?: boolean;
}

interface StepProps {
  active: boolean;
  finished: boolean;
  size?: 'sm' | 'lg';
  color?: string;
}

// Can't use the usual way since the Step component adds all props to an underlying div which React doesn't like
const SStep = styled(
  ({ active, finished, size, color, ...rest }: StepProps & ComponentProps<typeof Step>) => (
    <Step {...rest} />
  )
)`
  && .rc-steps-item-icon {
    background-color: ${({ active, finished, color }) =>
      active || finished ? color : COLORS.WHITE};
    border-color: ${({ color }) => color};
    ${({ size }) =>
      size === 'lg' &&
      `
      height: 50px;
      width: 50px;
      line-height: 50px;
      border-radius: 50px;
      font-size: ${FONT_SIZE.BASE};
      line-height: 48px;
      margin-right: 11px;
      border-width: 2px;
    `}
  }
  && .rc-steps-icon {
    color: ${({ active, color }) => (active ? COLORS.WHITE : color)};
    img {
      width: ${FONT_SIZE.SM};
    }

    ${({ size }) =>
      size === 'lg' &&
      `
      font-weight: 700;
    `}
  }
  && .rc-steps-item-tail {
    top: -5px;
    padding-bottom: 0;
    height: 110%;

    ${({ size }) =>
      size === 'lg' &&
      `
      width: 2px;
      top: 19px;
      left: 24px;
      line-height: 50px;
      border-radius: 50px;
      font-size: ${FONT_SIZE.BASE};
      line-height: 44px;

      &:after {
        width: 2px;
      }
    `}
  }
  && .rc-steps-item-tail:after {
    background-color: ${({ color }) => color};
  }
`;

function VerticalStepper({
  currentStep = 0,
  steps,
  size = 'sm',
  color = COLORS.BLUE_BRIGHT,
  error
}: Props) {
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
            size={size}
            title={<StepperTitle title={s.title} icon={s.icon} finished={finished} size={size} />}
            color={color}
            description={
              !finished && (
                <StepperContent
                  active={active}
                  content={s.content}
                  buttonText={s.buttonText}
                  loading={s.loading}
                  size={size}
                  error={error}
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
  title: ReactNode | string;
  finished: boolean;
  size?: 'sm' | 'lg';
}

const TitleWrapper = styled.div<{ size: 'sm' | 'lg' | undefined }>`
  display: flex;

  ${({ size }) =>
    size === 'lg' &&
    `
    margin-top: 8px;
    margin-bottom: 0;
  `}
`;

const TitleTypography = styled(Typography)<{ finished: boolean }>`
  ${(props) => props.finished && `color: ${COLORS.GREY_LIGHT}`};
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

function StepperTitle({ icon, title, finished, size }: TitleProps) {
  return (
    <TitleWrapper size={size}>
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
  content: ReactNode | string;
  buttonText?: string;
  loading?: boolean;
  error?: boolean;
  size?: 'sm' | 'lg';
  onClick?(): void;
}

const ContentWrapper = styled.div<{ size: 'sm' | 'lg' | undefined }>`
  ${({ size }) =>
    size !== 'lg' &&
    `
    padding: ${SPACING.XS};
  `}
`;

const SButton = styled(Button)`
  margin-top: ${SPACING.SM};
`;

function StepperContent({
  active,
  content,
  buttonText,
  loading,
  error,
  size,
  onClick
}: DescriptionProps) {
  return (
    <ContentWrapper size={size}>
      <Typography as={'div'}>{content}</Typography>
      {buttonText && (
        <SButton disabled={!active || error} loading={loading} onClick={onClick}>
          {buttonText}
        </SButton>
      )}
      {active && error && (
        <InlineMessage>
          {translate('MTX_GENERIC_ERROR', { $link: formatSupportEmail('Multi TX Error') })}
        </InlineMessage>
      )}
    </ContentWrapper>
  );
}

export default VerticalStepper;
