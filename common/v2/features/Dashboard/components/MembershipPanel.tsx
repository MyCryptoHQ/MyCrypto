import React, { useContext } from 'react';
import styled from 'styled-components';

import { StoreContext } from 'v2/services';
import { DashboardPanel, Typography, Button, Link } from 'v2/components';
import { translateRaw } from 'v2';
import { FONT_SIZE, COLORS, SPACING } from 'v2/theme';

const SDashboardPanel = styled(DashboardPanel)<{isMyCryptoMember: boolean}>`
  display: flex;
  ${props => !props.isMyCryptoMember && `background-color: ${COLORS.BLUE_LIGHTEST};`}
`;

const Wrapper = styled.div`
  display: flex;
`;

const Header = styled(Typography)`
  font-weight: bold;
  font-size: ${FONT_SIZE.LG};
`

const ImageWrapper = styled.div`
  margin-right: ${SPACING.BASE};
`;

const TextWrapper = styled.div<{isMyCryptoMember: boolean}>`
  display: flex;
  flex-direction: column;
  ${props => props.isMyCryptoMember && `align-items: center;`}
`;

const SLink = styled(Link)`
  margin-top: ${SPACING.SM};
`;

const SButton = styled(Button)`
  margin-top: ${SPACING.SM};
`;

export default function MembershipPanel() {
  const { isMyCryptoMember } = useContext(StoreContext);

  return (
    <SDashboardPanel
      isMyCryptoMember={isMyCryptoMember}
      padChildren={true}>
      <Wrapper>
        <ImageWrapper>
          <img src="https://via.placeholder.com/100x100" />
        </ImageWrapper>
        <TextWrapper isMyCryptoMember={isMyCryptoMember}>
          <Header as="div">
            {translateRaw("MEMBERSHIP")}
          </Header>
          {isMyCryptoMember && (
            <>
              <div>{translateRaw("EXPIRES_ON")}</div>
              <SLink>{translateRaw("MANAGE_MEMBERSHIP")}</SLink>
              <SButton>{translateRaw("REQUEST_REWARDS")}</SButton>
            </>
          )}
          {!isMyCryptoMember && (
            <>
              <Typography as="div">
                {translateRaw("MEMBERSHIP_NOTMEMBER")}
              </Typography>
              <SButton>{translateRaw("BECOME_MEMBER")}</SButton>
            </>
          )}
        </TextWrapper>
      </Wrapper>
    </SDashboardPanel>
  );
}
