import React from 'react';
import styled from 'styled-components';

import { COLORS } from 'v2/theme';
import { ROUTE_PATHS } from 'v2/config';
import { translateRaw } from 'v2/translations';
import { RouterLink, Typography } from 'v2/components';

const AccountListFooterWrapper = styled.div`
  & * {
    color: ${COLORS.BRIGHT_SKY_BLUE};
  }
  & img {
    height: 1.1em;
    margin-right: 0.5em;
  }s
`;

export default function AccountListFooter() {
  return (
    <AccountListFooterWrapper>
      <RouterLink to={ROUTE_PATHS.ADD_ACCOUNT.path}>
        <Typography>{`+ ${translateRaw('ACCOUNT_LIST_TABLE_ADD_ACCOUNT')}`}</Typography>
      </RouterLink>
    </AccountListFooterWrapper>
  );
}
