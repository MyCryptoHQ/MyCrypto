import React from 'react';
import { Button, Panel, Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import { BREAK_POINTS } from 'v2/theme';
import Stepper from './Stepper';
import backArrowIcon from 'common/assets/images/icn-back-arrow.svg';

interface ContentPanelProps {
  width?: string;
  mobileMaxWidth?: string;
}

const ContentPanelWrapper = styled.div`
  width: ${(props: ContentPanelProps) => props.width};
  max-width: ${(props: ContentPanelProps) => props.width};
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: ${(props: ContentPanelProps) => props.mobileMaxWidth};
    padding-left: 0px;
    margin-bottom: 1em;
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

const ContentPanelHeading = styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #303030;
  font-family: Lato;
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
  margin-bottom: 10px;
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
  width?: string;
  mobileMaxWidth?: string;
  onBack?(): void | null;
}

export default function ContentPanel({
  onBack,
  stepper,
  heading,
  icon,
  description,
  children,
  className = '',
  width = '650px',
  mobileMaxWidth = '100%',
  ...rest
}: Props) {
  return (
    <ContentPanelWrapper width={width} mobileMaxWidth={mobileMaxWidth}>
      {(onBack || stepper) && (
        <ContentPanelTop stepperOnly={stepper !== undefined && !onBack}>
          {onBack && (
            <BackButton basic={true} onClick={onBack}>
              <img src={backArrowIcon} alt="Back arrow" /> Back
            </BackButton>
          )}
          {stepper && <Stepper current={stepper.current} total={stepper.total} />}
        </ContentPanelTop>
      )}
      <Panel className={className} {...rest}>
        {heading && (
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
