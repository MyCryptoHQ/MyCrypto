import React from 'react';
import styled from 'styled-components';
import { Heading } from '@mycrypto/ui';

import { COLORS, FONT_SIZE, SPACING } from 'v2/theme';

import settingsIcon from 'common/assets/images/icn-settings.svg';

import { Panel } from './Panel';
import RouterLink from './RouterLink';
import Typography from './Typography';

const SRouterLink = styled(RouterLink)`
  display: flex;
  flex-direction: row;
  align-items: center;
  & span,
  p,
  div {
    color: ${COLORS.BLUE_BRIGHT};
  }
  & img {
    margin-right: 0.5em;
  }
`;

const Content = styled.div`
  padding: ${SPACING.BASE};
`;

const DPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 0 ${SPACING.BASE} 0;
  padding: 0;
`;

const DHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${SPACING.BASE};
`;

const DFooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${COLORS.BLUE_GREY_LIGHTEST};
`;

const DHeading = styled(Heading)`
  && {
    margin: 0;
    font-size: ${FONT_SIZE.XL};
    font-weight: bold;
    color: ${COLORS.BLUE_DARK_SLATE};
  }
`;

interface Props {
  heading?: any;
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
  children,
  padChildren,
  ...rest
}: Props) => {
  return (
    <DPanel {...rest}>
      {heading && (<DHeadingWrapper>
        <DHeading>{heading}</DHeading>
        {headingRight &&
          (actionLink ? (
            <SRouterLink to={actionLink}>
              <img src={settingsIcon} alt={'settings'} width={32} />
              <Typography>{headingRight}</Typography>
            </SRouterLink>
          ) : (
              headingRight
            ))}
      </DHeadingWrapper>)}
      {padChildren ? <Content>{children}</Content> : children}
      {footer && <DFooterWrapper>{footer}</DFooterWrapper>}
    </DPanel>
  );
};
