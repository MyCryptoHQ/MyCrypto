import React from 'react';

import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import expiredIcon from '@assets/images/membership/membership-expired.svg';
import defaultIcon from '@assets/images/membership/membership-none.svg';
import { Button, DashboardPanel, LinkApp, Typography } from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE, ROUTE_PATHS } from '@config';
import { MEMBERSHIP_CONFIG, MembershipState } from '@features/PurchaseMembership/config';
import { AppState, getMemberships, getMembershipState, membershipExpiryDate } from '@store';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { flatten, uniq } from '@vendor';

const SDashboardPanel = styled(DashboardPanel)<{ isMemberOrExpired: boolean }>`
  display: flex;
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    height: 171px;
  }
  ${(props) => !props.isMemberOrExpired && `background-color: ${COLORS.BLUE_LIGHTEST};`}
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
  min-width: ${SPACING.XL};
`;

const TextWrapper = styled.div<{ isMember: boolean }>`
  display: flex;
  flex-direction: column;
  ${(props) => props.isMember && `align-items: center;`}
`;

const ExpiryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const ExpiredOnWrapper = styled(Typography)`
  font-style: italic;
`;

const SButton = styled(Button)`
  width: 100%;
  margin-top: ${SPACING.SM};
`;

const Icon = styled.img<{ isMemberOrExpired: boolean }>`
  ${(props) => !props.isMemberOrExpired && 'opacity: 0.25;'}
`;

function MembershipPanel({ memberships, membershipState, expiryDate }: Props) {
  const isMember = membershipState === MembershipState.MEMBER;
  const isExpired = membershipState === MembershipState.EXPIRED;
  const allMemberships = memberships ? uniq(flatten(memberships.map((m) => m.memberships))) : [];
  const membership =
    allMemberships.length > 0 ? allMemberships[allMemberships.length - 1] : undefined;

  const icon = (() => {
    if (isExpired) {
      return expiredIcon;
    } else if (membership) {
      return MEMBERSHIP_CONFIG[membership.type].icon;
    } else {
      return defaultIcon;
    }
  })();

  return (
    <SDashboardPanel isMemberOrExpired={isMember || isExpired} padChildren={true}>
      <Wrapper>
        <ImageWrapper>
          <Icon isMemberOrExpired={isMember || isExpired} src={icon} />
        </ImageWrapper>
        <TextWrapper isMember={isMember}>
          <Header as="div">
            {membershipState === MembershipState.EXPIRED
              ? translateRaw('MEMBERSHIP_EXPIRED')
              : translateRaw('MEMBERSHIP')}
          </Header>
          {membershipState === MembershipState.MEMBER && (
            <>
              <ExpiryWrapper>
                <Typography as="div">{translateRaw('EXPIRES_ON')}</Typography>
                <Typography as="div">{new Date(expiryDate).toLocaleDateString()}</Typography>
              </ExpiryWrapper>
              <LinkApp href={ROUTE_PATHS.MYC_MEMBERSHIP.path} mt={SPACING.SM}>
                {translateRaw('MANAGE_MEMBERSHIP')}
              </LinkApp>
              <LinkApp
                href={getKBHelpArticle(KB_HELP_ARTICLE.MEMBERSHIP_REQUEST_REWARDS)}
                isExternal={true}
              >
                <SButton colorScheme={'inverted'}>{translateRaw('REQUEST_REWARDS')}</SButton>
              </LinkApp>
            </>
          )}
          {membershipState === MembershipState.NOTMEMBER && (
            <>
              <Typography as="div">{translateRaw('MEMBERSHIP_NOTMEMBER')}</Typography>
              <LinkApp href={ROUTE_PATHS.MYC_MEMBERSHIP.path}>
                <SButton>{translateRaw('BECOME_MEMBER')}</SButton>
              </LinkApp>
            </>
          )}
          {membershipState === MembershipState.EXPIRED && (
            <>
              <ExpiryWrapper>
                <ExpiredOnWrapper as="div">{translateRaw('EXPIRED_ON')}</ExpiredOnWrapper>
                <Typography as="div">{new Date(expiryDate).toLocaleDateString()}</Typography>
              </ExpiryWrapper>
              <LinkApp href={ROUTE_PATHS.MYC_MEMBERSHIP.path}>
                <SButton>{translateRaw('RENEW_MEMBERSHIP')}</SButton>
              </LinkApp>
            </>
          )}
          {membershipState === MembershipState.ERROR && (
            <>
              <Typography as="div">{translate('MEMBERSHIP_ERROR')}</Typography>
              <LinkApp href={ROUTE_PATHS.MYC_MEMBERSHIP.path}>
                <SButton>{translateRaw('BUY_MEMBERSHIP')}</SButton>
              </LinkApp>
            </>
          )}
        </TextWrapper>
      </Wrapper>
    </SDashboardPanel>
  );
}

const mapStateToProps = (state: AppState) => ({
  memberships: getMemberships(state),
  membershipState: getMembershipState(state),
  expiryDate: membershipExpiryDate(state)
});
const connector = connect(mapStateToProps);
type Props = ConnectedProps<typeof connector>;

export default connector(MembershipPanel);
