import React, { useContext } from 'react';
import styled from 'styled-components';

import { StoreContext } from 'v2/services';
import { DashboardPanel, Typography, Button, Link } from 'v2/components';
import { translateRaw } from 'v2';
import { FONT_SIZE } from 'v2/theme';

const SDashboardPanel = styled(DashboardPanel)`
  display: flex;
`;

const Wrapper = styled.div`
  display: flex;
`;

const Header = styled(Typography)`
  font-weight: bold;
  font-size: ${FONT_SIZE.LG};
`
const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function MembershipPanel() {
  const { isMyCryptoMember } = useContext(StoreContext);

  return (
    <SDashboardPanel
      padChildren={true}>
      <Wrapper>
        <div>
          <img src="https://via.placeholder.com/100x100" />
        </div>
        <TextWrapper>
          <Header as="div">
            {translateRaw("MEMBERSHIP")}
          </Header>
          {isMyCryptoMember && (
            <>
              <div>{translateRaw("EXPIRES_ON")}</div>
              <Link>{translateRaw("MANAGE_MEMBERSHIP")}</Link>
              <Button>{translateRaw("REQUEST_REWARDS")}</Button>
            </>
          )}
          {!isMyCryptoMember && (
            <>
              <Typography as="div">
                {translateRaw("MEMBERSHIP_NOTMEMBER")}
              </Typography>
              <Button>{translateRaw("BECOME_MEMBER")}</Button>
            </>
          )}
        </TextWrapper>
      </Wrapper>
    </SDashboardPanel>
  );
}
