import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Heading } from '@mycrypto/ui';

import { Panel } from 'v2/components';

const Content = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`;

const DPanel = styled(Panel)`
  padding: 0 0 15px 0;
`;

const DHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
`;

const DHeading = styled(Heading)`
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #424242;
`;

const DButton = styled(Button)`
  padding: 9px 16px;
  font-size: 18px;
`;

interface Props {
  heading: any;
  children: any;
  headingRight?: string | JSX.Element;
  footerAction?: string | JSX.Element;
  actionLink?: string;
  footerActionLink?: string;
  className?: string;
  padChildren?: boolean;
}

export const DashboardPanel = ({
  heading,
  headingRight,
  footerAction,
  actionLink,
  footerActionLink,
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
            <Link to={actionLink}>
              <DButton>{headingRight}</DButton>
            </Link>
          ) : (
            headingRight
          ))}
      </DHeadingWrapper>
      {padChildren ? <Content>{children}</Content> : children}
      {footerAction && (
        <DHeadingWrapper>
          {footerActionLink ? (
            <Link to={footerActionLink}>
              <DButton basic={true}>{footerAction}</DButton>
            </Link>
          ) : (
            footerAction
          )}
        </DHeadingWrapper>
      )}
    </DPanel>
  );
};
