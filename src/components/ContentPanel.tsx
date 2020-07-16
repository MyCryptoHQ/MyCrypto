import React from 'react';
import { Button, Panel, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { BREAK_POINTS, SPACING } from '@theme';
import { translateRaw } from '@translations';
import Stepper from './Stepper';
import backArrowIcon from '@assets/images/icn-back-arrow.svg';

interface ContentPanelProps {
  width?: number;
  mobileMaxWidth?: string;
}

const ContentPanelWrapper = styled.div<ContentPanelProps>`
  position: relative;
  width: ${({ width }) => `${width}px`};
  max-width: ${({ width }) => `${width}px`};
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: ${({ mobileMaxWidth }) => mobileMaxWidth};
    padding-left: 0;
    margin: 0 auto 1em;
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    &.has-side-panel {
      width: ${({ width }) => `${width ? width + 390 : width}px`};
      max-width: ${({ width }) => `${width ? width + 390 : width}px`};
    }
  }
`;

const BackButton = styled(Button)`
  color: #007a99;
  font-weight: bold;
  display: flex;
  align-items: center;
  font-size: 20px;
  img {
    margin-right: 13px;
  }
`;

const BackButtonExtraText = styled.span`
  display: contents;
  font-weight: normal;
`;

const ContentPanelHeading = styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #303030;
  font-size: 32px;
  font-weight: bold;
`;

const ContentPanelHeadingIcon = styled.img`
  width: 45px;
  height: 45px;
`;

const ContentPanelDescription = styled(Typography)`
  margin: 0;
  margin-bottom: 15px;
`;

interface ContentPanelTopProps {
  stepperOnly: boolean;
}

const ContentPanelTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props: ContentPanelTopProps) =>
    props.stepperOnly ? 'flex-end' : 'space-between'};
  margin: 0 0 ${SPACING.SM} 0;
  padding: 0;
`;

interface Props {
  children: any;
  className?: string;
  heading?: string;
  icon?: string;
  description?: string;
  stepper?: {
    current: number;
    total: number;
  };
  width?: number;
  mobileMaxWidth?: string;
  backBtnText?: string;
  basic?: boolean;
  onBack?(): void | null;
}

export default function ContentPanel({
  onBack,
  backBtnText,
  stepper,
  heading,
  icon,
  description,
  children,
  className = '',
  width = 650,
  mobileMaxWidth = '100%',
  basic,
  ...rest
}: Props) {
  return (
    <ContentPanelWrapper className={className} width={width} mobileMaxWidth={mobileMaxWidth}>
      {(onBack || stepper) && (
        <ContentPanelTop stepperOnly={stepper !== undefined && !onBack}>
          {onBack && (
            <BackButton basic={true} onClick={onBack}>
              <img src={backArrowIcon} alt="Back arrow" />
              {translateRaw('BACK')}
              {backBtnText && `: `}
              {backBtnText && <BackButtonExtraText>{backBtnText}</BackButtonExtraText>}
            </BackButton>
          )}
          {stepper && <Stepper current={stepper.current} total={stepper.total} />}
        </ContentPanelTop>
      )}
      <Panel basic={basic} {...rest}>
        {heading && !basic && (
          <ContentPanelHeading>
            {heading}
            {icon && <ContentPanelHeadingIcon src={icon} alt="Icon" />}
          </ContentPanelHeading>
        )}
        {description && <ContentPanelDescription>{description}</ContentPanelDescription>}
        {children}
      </Panel>
    </ContentPanelWrapper>
  );
}
