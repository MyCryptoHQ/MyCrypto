import React, { useContext } from 'react';

import { useHistory } from 'react-router-dom';

import { AnnouncementBanner, Box, Icon } from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE, LATEST_NEWS_URL, ROUTE_PATHS } from '@config';
import { ScreenLockContext } from '@features/ScreenLock';
import { COLORS, SPACING } from '@theme';
import { openLink } from '@utils';

import { TopItem } from './components';

export const TopNav = ({
  current,
  isMobile,
  isTrayOpen,
  openTray
}: {
  current: string;
  isMobile: boolean;
  isTrayOpen: boolean;
  openTray(): void;
}) => {
  const { locked, startLockCountdown } = useContext(ScreenLockContext);
  const { push } = useHistory();

  const color = isMobile && isTrayOpen ? COLORS.WHITE : COLORS.GREYISH_BROWN;

  return (
    <Box
      variant="rowAlign"
      justifyContent="flex-end"
      ml={SPACING.BASE}
      mb={SPACING.BASE}
      mt={SPACING.MD}
      mr={SPACING.XS}
    >
      {isMobile && (
        <TopItem
          title="NAVIGATION_MENU"
          icon="nav-menu"
          left={true}
          color={color}
          current={isTrayOpen}
          onClick={openTray}
        />
      )}
      {!isMobile && (
        <>
          <Box mr="auto" ml={{ _: '0', xxl: 'calc(50% - 350px)' }}>
            <AnnouncementBanner />
          </Box>
          <Icon
            type="logo-mycrypto-text-blue"
            width="147px"
            style={{ marginRight: '35px', marginLeft: '35px' }}
          />
        </>
      )}
      <TopItem
        title="NAVIGATION_LOCK"
        icon="nav-lock"
        onClick={() => startLockCountdown(true)}
        current={locked}
        color={color}
      />
      <TopItem
        title="NAVIGATION_JOIN"
        icon="nav-membership"
        onClick={() => push(ROUTE_PATHS.MYC_MEMBERSHIP.path)}
        current={current === ROUTE_PATHS.MYC_MEMBERSHIP.path}
        color={color}
      />
      <TopItem
        title="NAVIGATION_HELP"
        icon="nav-help"
        onClick={() => openLink(getKBHelpArticle(KB_HELP_ARTICLE.HOME))}
        color={color}
      />
      {!isMobile && (
        <TopItem
          color={color}
          title="NAVIGATION_NEW"
          icon="nav-new"
          onClick={() => openLink(LATEST_NEWS_URL)}
        />
      )}
    </Box>
  );
};
