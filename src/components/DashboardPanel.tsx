import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import { COLORS, FONT_SIZE, SPACING } from '@theme';
import { isTruthy } from '@utils';

import { default as Box } from './Box';
import { Panel } from './Panel';
import Typography from './Typography';

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
  className?: string;
  padChildren?: boolean;
}

export const DashboardPanel = ({
  heading,
  headingRight,
  footer,
  children,
  padChildren,
  ...rest
}: Props) => {
  return (
    <DPanel {...rest}>
      {heading && (
        <Box variant="spaceBetween" padding={{ _: '16px', md: SPACING.BASE }}>
          <DHeading hasRightHeading={isTruthy(headingRight)}>{heading}</DHeading>
          {headingRight && <Typography>{headingRight}</Typography>}
        </Box>
      )}
      {padChildren ? <Content>{children}</Content> : children}
      {footer && <DFooterWrapper>{footer}</DFooterWrapper>}
    </DPanel>
  );
};
