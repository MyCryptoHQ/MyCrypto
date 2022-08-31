import { ReactElement } from 'react';

import styled from 'styled-components';

import { BREAK_POINTS } from '@theme';

const { SCREEN_XS, SCREEN_MD } = BREAK_POINTS;

interface WrapperProps {
  alignCenterOnSmallScreen?: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;

  @media (max-width: ${SCREEN_MD}) {
    flex-direction: column;
    ${(props) => props.alignCenterOnSmallScreen && 'text-align: center;'};
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  max-width: 860px;
`;

interface LeftImageProps {
  src: string;
  width: string;
  height: string;
  transform?: string;
  hideOnMobile?: boolean;
  marginRight?: string;
}

const LeftImage = styled.img<LeftImageProps>`
  ${(props) => `width: ${props.width};`};
  ${(props) => `height: ${props.height};`};
  ${(props) => props.transform && `transform: ${props.transform};`};
  ${(props) =>
    props.hideOnMobile &&
    `@media (max-width: ${SCREEN_MD}) {
      display: none;
    }`};
  ${(props) => (props.marginRight ? `margin-right: ${props.marginRight};` : 'margin-right: 30px;')};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Tagline = styled.p`
  font-weight: bold;
  font-size: 16px;
  color: #a682ff;
  margin: 0;
  text-transform: uppercase;

  @media (max-width: ${SCREEN_XS}) {
    font-size: 12px;
  }
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
  white-space: pre-line;
  line-height: 24px;

  @media (max-width: ${SCREEN_XS}) {
    font-size: 14px;
  }

  strong {
    font-weight: 600;
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
  leftImg?: LeftImageProps;
  tagline?: ReactElement<any>;
  title: ReactElement<any> | string;
  description?: ReactElement<any>;
  additionalDescription?: ReactElement<any>;
  resources: ReactElement<any>;
  alignCenterOnSmallScreen?: boolean;
  children?: any;
}

export default function NotificationWrapper({
  leftImg,
  tagline,
  title,
  description,
  additionalDescription,
  resources,
  alignCenterOnSmallScreen,
  children
}: NotificationWrapperProps) {
  return (
    <Wrapper alignCenterOnSmallScreen={alignCenterOnSmallScreen}>
      <Info>
        {leftImg && <LeftImage {...leftImg} />}
        <Content>
          {tagline && <Tagline>{tagline}</Tagline>}
          <Title>{title}</Title>
          {description && <Description>{description}</Description>}
          {additionalDescription && <Description>{additionalDescription}</Description>}
          {children}
        </Content>
      </Info>
      <Resources>{resources}</Resources>
    </Wrapper>
  );
}
