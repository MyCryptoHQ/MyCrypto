import React, { useContext } from 'react';

import { useHistory } from 'react-router-dom';

import { Box } from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE, LATEST_NEWS_URL, ROUTE_PATHS } from '@config';
import { ScreenLockContext } from '@features/ScreenLock';
import { SPACING } from '@theme';
import { openLink } from '@utils';

import { TopItem } from './components';

export const TopNav = ({ current, isMobile }: { current: string; isMobile: boolean }) => {
  const { locked, startLockCountdown } = useContext(ScreenLockContext);
  const { push } = useHistory();
  return (
    <Box
      variant="rowAlign"
      justifyContent="flex-end"
      ml={SPACING.BASE}
      mb={SPACING.BASE}
      mt={SPACING.MD}
      mr={SPACING.XS}
    >
      {isMobile && <TopItem title="NAVIGATION_MENU" icon="nav-menu" left={true} />}
      <TopItem
        title="NAVIGATION_LOCK"
        icon="nav-lock"
        onClick={() => startLockCountdown(true)}
        current={locked}
      />
      <TopItem
        title="NAVIGATION_JOIN"
        icon="nav-membership"
        onClick={() => push(ROUTE_PATHS.MYC_MEMBERSHIP.path)}
        current={current === ROUTE_PATHS.MYC_MEMBERSHIP.path}
      />
      <TopItem
        title="NAVIGATION_HELP"
        icon="nav-help"
        onClick={() => openLink(getKBHelpArticle(KB_HELP_ARTICLE.HOME))}
      />
      {!isMobile && (
        <TopItem title="NAVIGATION_NEW" icon="nav-new" onClick={() => openLink(LATEST_NEWS_URL)} />
      )}
    </Box>
  );
};
