import React from 'react';
import { Button, Panel } from '@mycrypto/ui';
import styled from 'styled-components';
import Stepper from './Stepper';

// Legacy
import backArrowIcon from 'common/assets/images/icn-back-arrow.svg';

interface ContentPanelWrapperProps {
  centered: boolean | undefined;
}

const ContentPanelWrapper = styled.div`
  text-align: ${(props: ContentPanelWrapperProps) => (props.centered ? 'center' : 'left')};
  @media (min-width: 700px) {
    max-width: 560px;
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

interface ContentPanelHeadingProps {
  centered: boolean | undefined;
}

const ContentPanelHeading =
  styled.p <
  ContentPanelHeadingProps >
  `
  font-size: 36px;
  width: 100%;
  display: flex;
  justify-content: ${props => (props.centered ? 'center' : 'space-between')};
  font-weight: bold;
  line-height: normal;
  margin-top: 0;
  margin-bottom: 15px;
  color: ${props => props.theme.headline};

  @media (max-width: 700px) {
    padding: 0 8px;
  }
`;

const ContentPanelHeadingIcon = styled.img`
  width: 45px;
  height: 45px;
`;

const ContentPanelDescription = styled.p`
  font-size: 18px;
  line-height: 1.5;
  font-weight: normal;

  color: ${props => props.theme.text};
  white-space: pre-line;

  strong {
    font-weight: 900;
  }
  @media (max-w
 idth: 700px) {
    padding: 0 8px;
  }
`;

const ImgIcon = styled.img`
  width: 125px;
  height: auto;
  margin-bottom: 28px;
`;

interface ContentPanelTopProps {
  stepperOnly: boolean;
}

const ContentPanelTop =
  styled.div <
  ContentPanelTopProps >
  `
  display: flex;
  align-items: center;
  justify-content: ${props => (props.stepperOnly ? 'flex-end' : 'space-between')};
  margin-bottom: 10px;
  padding: 0 30px;

  @media (min-width: 700px) {
    padding: 0;
  }
`;

const StyledPanel = styled(Panel)`
  padding: 42px 70px 42px 70px;

  @media (max-width: 700px) {
    padding-left: 15px;
    padding-right: 15px;
  }
`;

interface Props {
  children: any;
  className?: string;
  heading?: string;
  icon?: string;
  image?: string;
  showImageOnTop?: boolean;
  description?: string | JSX.Element;
  stepper?: {
    current: number;
    total: number;
  };
  centered?: boolean;
  onBack?(): void;
}

export default function ExtendedContentPanel({
  onBack,
  stepper,
  heading,
  icon,
  image,
  showImageOnTop,
  description,
  centered,
  children,
  className = '',
  ...rest
}: Props) {
  return (
    <ContentPanelWrapper centered={centered}>
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
      <StyledPanel className={className} {...rest}>
        {image && showImageOnTop && <ImgIcon src={image} alt="Image" />}
        {heading && (
          <ContentPanelHeading centered={centered}>
            {heading}
            {icon && <ContentPanelHeadingIcon src={icon} alt="Icon" />}
          </ContentPanelHeading>
        )}
        {description && <ContentPanelDescription>{description}</ContentPanelDescription>}
        {image && !showImageOnTop && <ImgIcon src={image} alt="Image" />}
        {children}
      </StyledPanel>
    </ContentPanelWrapper>
  );
}
