import React, { useContext } from 'react';
import styled from 'styled-components';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as R from 'ramda';

import { StoreContext } from 'v2/services';
import { DashboardPanel, Typography, Button, Link } from 'v2/components';
import { FONT_SIZE, COLORS, SPACING } from 'v2/theme';
import { translateRaw } from 'v2/translations';
import { ROUTE_PATHS } from 'v2/config';
import defaultIcon from 'common/assets/images/membership/membership-none.svg';
import { MEMBERSHIP_CONFIG } from 'v2/features/PurchaseMembership/config';

const SDashboardPanel = styled(DashboardPanel)<{ isMyCryptoMember: boolean }>`
  display: flex;
  ${props => !props.isMyCryptoMember && `background-color: ${COLORS.BLUE_LIGHTEST};`}
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
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
  width: 100%;
  justify-content: space-between;
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

const Icon = styled.img<{ isMyCryptoMember: boolean }>`
  ${props => !props.isMyCryptoMember && 'opacity: 0.25;'}
`;

type Props = RouteComponentProps<{}>;
function MembershipPanel({ history }: Props) {
  const { isMyCryptoMember, memberships, membershipExpiration } = useContext(StoreContext);

  const allMemberships = R.uniq(R.flatten(Object.values(memberships)));
  const membership =
    allMemberships.length > 0 ? allMemberships[allMemberships.length - 1] : undefined;

  const icon = membership ? MEMBERSHIP_CONFIG[membership].icon : defaultIcon;

  return (
    <SDashboardPanel isMyCryptoMember={isMyCryptoMember} padChildren={true}>
      <Wrapper>
        <ImageWrapper>
          <Icon isMyCryptoMember={isMyCryptoMember} src={icon} />
        </ImageWrapper>
        <TextWrapper isMyCryptoMember={isMyCryptoMember}>
          <Header as="div">{translateRaw('MEMBERSHIP')}</Header>
          {isMyCryptoMember && (
            <>
              <ExpiryWrapper>
                <Typography as="div">{translateRaw('EXPIRES_ON')}</Typography>
                <Typography as="div">
                  {new Date(Math.max(...membershipExpiration) * 1000).toLocaleDateString()}
                </Typography>
              </ExpiryWrapper>
              <SLink onClick={() => history.push(ROUTE_PATHS.MYC_MEMBERSHIP.path)}>
                {translateRaw('MANAGE_MEMBERSHIP')}
              </SLink>
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
