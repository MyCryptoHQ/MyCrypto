import React from 'react';
import styled from 'styled-components';

import { BREAK_POINTS } from 'v2/features/constants';

const { SCREEN_XS, SCREEN_MD } = BREAK_POINTS;

interface WrapperProps {
  alignCenterOnSmallScreen?: boolean;
}

const Wrapper =
  styled.div <
  WrapperProps >
  `
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;

  @media (max-width: ${SCREEN_MD}) {
    flex-direction: column;
    ${props => props.alignCenterOnSmallScreen && 'text-align: center;'};
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  max-width: 700px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  font-weight: bold;
  font-size: 24px;

  @media (max-width: ${SCREEN_XS}) {
    font-size: 20px;
  }
`;

const Description = styled.p`
  font-weight: normal;
  word-break: break-word;
  font-size: 16px;

  @media (max-width: ${SCREEN_XS}) {
    font-size: 14px;
  }
`;

const Resources = styled.div`
  display: flex;
  align-items: baseline;

  @media (max-width: ${SCREEN_MD}) {
    margin-top: 20px;
  }
`;

interface NotificationWrapperProps {
  leftImg: React.ReactElement<any>;
  title: string;
  description: string;
  additionalDescription?: string;
  resources: React.ReactElement<any>;
  alignCenterOnSmallScreen?: boolean;
}

export default function NotificationWrapper({
  leftImg,
  title,
  description,
  additionalDescription,
  resources,
  alignCenterOnSmallScreen
}: NotificationWrapperProps) {
  return (
    <Wrapper alignCenterOnSmallScreen={alignCenterOnSmallScreen}>
      <Info>
        {leftImg}
        <Content>
          <Title>{title}</Title>
          <Description>{description}</Description>
          {additionalDescription && <Description>{additionalDescription}</Description>}
        </Content>
      </Info>
      <Resources>{resources}</Resources>
    </Wrapper>
  );
}
