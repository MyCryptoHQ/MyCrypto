import React from 'react';

import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import settingsIcon from '@assets/images/icn-settings.svg';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import { isTruthy } from '@utils';

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
    margin-right: ${(p: { imageFirst?: boolean }) => (p.imageFirst ? '0.5em' : '0')};
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
  min-height: 0;
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

const DHeading = styled(Heading)<{ hasRightHeading: boolean }>`
  && {
    margin: 0;
    font-size: ${FONT_SIZE.XL};
    font-weight: bold;
    color: ${COLORS.BLUE_DARK_SLATE};
    ${({ hasRightHeading }) => !hasRightHeading && `width: 100%;`}
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
  const getRightHeading = () => {
    if (headingRight && actionLink) {
      return (
        <SRouterLink to={actionLink} imageFirst={true}>
          <img src={settingsIcon} alt={'settings'} width={30} />
          <Typography>{headingRight}</Typography>
        </SRouterLink>
      );
    } else if (headingRight && !actionLink) {
      return <Typography>{headingRight}</Typography>;
    } else if (!headingRight && actionLink) {
      return (
        <SRouterLink to={actionLink}>
          <img src={settingsIcon} alt={'settings'} width={30} />
        </SRouterLink>
      );
    } else {
      return false;
    }
  };

  const rightHeadingComponent = (headingRight || actionLink) && getRightHeading();

  return (
    <DPanel {...rest}>
      {heading && (
        <DHeadingWrapper>
          <DHeading hasRightHeading={isTruthy(rightHeadingComponent)}>{heading}</DHeading>
          {rightHeadingComponent}
        </DHeadingWrapper>
      )}
      {padChildren ? <Content>{children}</Content> : children}
      {footer && <DFooterWrapper>{footer}</DFooterWrapper>}
    </DPanel>
  );
};
