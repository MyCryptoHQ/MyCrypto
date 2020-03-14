import React, { useContext } from 'react';
import styled from 'styled-components';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { StoreContext } from 'v2/services';
import { DashboardPanel, Typography, Button, Link } from 'v2/components';
import { FONT_SIZE, COLORS, SPACING } from 'v2/theme';
import { translateRaw } from 'v2/translations';
import { ROUTE_PATHS } from 'v2/config';

const SDashboardPanel = styled(DashboardPanel)<{ isMyCryptoMember: boolean }>`
  display: flex;
  ${props => !props.isMyCryptoMember && `background-color: ${COLORS.BLUE_LIGHTEST};`}
`;

const Wrapper = styled.div`
  display: flex;
`;

const Header = styled(Typography)`
  font-weight: bold;
  font-size: ${FONT_SIZE.LG};
`;

const ImageWrapper = styled.div`
  margin-right: ${SPACING.BASE};
`;

const TextWrapper = styled.div<{ isMyCryptoMember: boolean }>`
  display: flex;
  flex-direction: column;
  ${props => props.isMyCryptoMember && `align-items: center;`}
`;

const ExpiryWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const SLink = styled(Link)`
  color: ${COLORS.BLUE_BRIGHT};
  margin-top: ${SPACING.SM};
`;

const SButton = styled(Button)`
  margin-top: ${SPACING.SM};
`;

const InvertedButton = styled(Button)`
  background: ${COLORS.WHITE};
  margin-top: ${SPACING.SM};
  border: 2px solid ${COLORS.BLUE_GREEN};
`;

type Props = RouteComponentProps<{}>;
function MembershipPanel({ history }: Props) {
  const { isMyCryptoMember } = useContext(StoreContext);

  return (
    <SDashboardPanel isMyCryptoMember={isMyCryptoMember} padChildren={true}>
      <Wrapper>
        <ImageWrapper>
          <img src="https://via.placeholder.com/100x100" />
        </ImageWrapper>
        <TextWrapper isMyCryptoMember={isMyCryptoMember}>
          <Header as="div">{translateRaw('MEMBERSHIP')}</Header>
          {isMyCryptoMember && (
            <>
              <ExpiryWrapper>
                <Typography as="div">{translateRaw('EXPIRES_ON')}</Typography>
                <Typography as="div">TODO</Typography>
              </ExpiryWrapper>
              <SLink>{translateRaw('MANAGE_MEMBERSHIP')}</SLink>
              <InvertedButton color={COLORS.BLUE_GREEN}>
                {translateRaw('REQUEST_REWARDS')}
              </InvertedButton>
            </>
          )}
          {!isMyCryptoMember && (
            <>
              <Typography as="div">{translateRaw('MEMBERSHIP_NOTMEMBER')}</Typography>
              <SButton onClick={() => history.push(ROUTE_PATHS.MYC_MEMBERSHIP.path)}>
                {translateRaw('BECOME_MEMBER')}
              </SButton>
            </>
          )}
        </TextWrapper>
      </Wrapper>
    </SDashboardPanel>
  );
}

export default withRouter(MembershipPanel);
