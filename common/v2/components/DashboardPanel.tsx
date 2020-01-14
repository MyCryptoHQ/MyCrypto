import React from 'react';
import styled from 'styled-components';
import { Heading } from '@mycrypto/ui';

import { COLORS } from 'v2/theme';

import settingsIcon from 'common/assets/images/icn-settings.svg';

import { Panel } from './Panel';
import RouterLink from './RouterLink';
import Typography from './Typography';

const Content = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`;

const DPanel = styled(Panel)`
  padding: 0;
`;

const DHeadingWrapper = styled.div`
  & span {
    color: ${COLORS.BRIGHT_SKY_BLUE};
    padding-right: 15px;
  }
  & img {
    margin-right: 0.5em;
  }
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
`;

const DFooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  background: #fafcfc;
`;

const DHeading = styled(Heading)`
  && {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
    color: #424242;
  }
`;

interface Props {
  heading: any;
  children: any;
  headingRight?: string | JSX.Element;
  footer?: JSX.Element;
  actionLink?: string;
  className?: string;
  padChildren?: boolean;
}

export const DashboardPanel = ({
  heading,
  headingRight,
  actionLink,
  footer,
  className = '',
  children,
  padChildren,
  ...rest
}: Props) => {
  return (
    <DPanel {...rest}>
      <DHeadingWrapper>
        <DHeading>{heading}</DHeading>
        {headingRight &&
          (actionLink ? (
            <RouterLink to={actionLink}>
              <img src={settingsIcon} alt={'settings'} width={32} />
              <Typography>{headingRight}</Typography>
            </RouterLink>
          ) : (
            headingRight
          ))}
      </DHeadingWrapper>
      {padChildren ? <Content>{children}</Content> : children}
      {footer && <DFooterWrapper>{footer}</DFooterWrapper>}
    </DPanel>
  );
};
