import React, { useContext } from 'react';

import flatten from 'ramda/src/flatten';
import uniq from 'ramda/src/uniq';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import expiredIcon from '@assets/images/membership/membership-expired.svg';
import defaultIcon from '@assets/images/membership/membership-none.svg';
import { Button, DashboardPanel, Link, Typography } from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE, ROUTE_PATHS } from '@config';
import { MEMBERSHIP_CONFIG, MembershipState } from '@features/PurchaseMembership/config';
import { StoreContext } from '@services';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';

const SDashboardPanel = styled(DashboardPanel)<{ isMemberOrExpired: boolean }>`
  display: flex;
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

const SLink = styled(Link)`
  color: ${COLORS.BLUE_BRIGHT};
  margin-top: ${SPACING.SM};
`;

const SButton = styled(Button)`
  margin-top: ${SPACING.SM};
`;

const Icon = styled.img<{ isMemberOrExpired: boolean }>`
  ${(props) => !props.isMemberOrExpired && 'opacity: 0.25;'}
`;

type Props = RouteComponentProps<{}>;
function MembershipPanel({ history }: Props) {
  const { membershipState, memberships, membershipExpirations } = useContext(StoreContext);

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
                <Typography as="div">
                  {new Date(
                    Math.max(...membershipExpirations.map((e) => e.toNumber())) * 1000
                  ).toLocaleDateString()}
                </Typography>
              </ExpiryWrapper>
              <SLink onClick={() => history.push(ROUTE_PATHS.MYC_MEMBERSHIP.path)}>
                {translateRaw('MANAGE_MEMBERSHIP')}
              </SLink>
              <Link href={getKBHelpArticle(KB_HELP_ARTICLE.MEMBERSHIP_INFO)} rel="noreferrer">
                <SButton inverted={true}>{translateRaw('REQUEST_REWARDS')}</SButton>
              </Link>
            </>
          )}
          {membershipState === MembershipState.NOTMEMBER && (
            <>
              <Typography as="div">{translateRaw('MEMBERSHIP_NOTMEMBER')}</Typography>
              <SButton onClick={() => history.push(ROUTE_PATHS.MYC_MEMBERSHIP.path)}>
                {translateRaw('BECOME_MEMBER')}
              </SButton>
            </>
          )}
          {membershipState === MembershipState.EXPIRED && (
            <>
              <ExpiryWrapper>
                <ExpiredOnWrapper as="div">{translateRaw('EXPIRED_ON')}</ExpiredOnWrapper>
                <Typography as="div">
                  {new Date(
                    Math.max(...membershipExpirations.map((e) => e.toNumber())) * 1000
                  ).toLocaleDateString()}
                </Typography>
              </ExpiryWrapper>
              <SButton onClick={() => history.push(ROUTE_PATHS.MYC_MEMBERSHIP.path)}>
                {translateRaw('RENEW_MEMBERSHIP')}
              </SButton>
            </>
          )}
          {membershipState === MembershipState.ERROR && (
            <>
              <Typography as="div">{translate('MEMBERSHIP_ERROR')}</Typography>
              <SButton onClick={() => history.push(ROUTE_PATHS.MYC_MEMBERSHIP.path)}>
                {translateRaw('BUY_MEMBERSHIP')}
              </SButton>
            </>
          )}
        </TextWrapper>
      </Wrapper>
    </SDashboardPanel>
  );
}

export default withRouter(MembershipPanel);
