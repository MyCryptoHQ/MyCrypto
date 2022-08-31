import { AnnouncementBanner, Box, Icon } from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE, LATEST_NEWS_URL } from '@config';
import { COLORS, SPACING } from '@theme';

import { TopItem } from './components';

export const TopNav = ({
  isMobile,
  isTrayOpen,
  openTray
}: {
  current: string;
  isMobile: boolean;
  isTrayOpen: boolean;
  openTray(): void;
}) => {
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
          {/* Center Banner by adding left margin */}
          <Box mr="auto" ml={{ _: '0', xxl: 'calc(50% - 462px)' }}>
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
        isExternal={true}
        title="NAVIGATION_HELP"
        icon="nav-help"
        href={getKBHelpArticle(KB_HELP_ARTICLE.HOME)}
        color={color}
      />
      {!isMobile && (
        <TopItem
          isExternal={true}
          color={color}
          title="NAVIGATION_NEW"
          icon="nav-new"
          href={LATEST_NEWS_URL}
        />
      )}
    </Box>
  );
};
