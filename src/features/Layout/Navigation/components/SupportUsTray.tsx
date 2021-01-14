import React, { useCallback, useState } from 'react';

import CopyToClipboard from 'react-copy-to-clipboard';

import { Box, Icon, Text } from '@components';
import { donationAddressMap } from '@config';
import { useAnalytics } from '@hooks';
import { ANALYTICS_CATEGORIES } from '@services';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';
import { TTrayItem } from '@types';
import { useEffectOnce, useTimeoutFn } from '@vendor';

import { ExternalLink } from './ExternalLink';

export const SupportUsTray = ({ items }: { items: TTrayItem[] }) => {
  const [displayingMessage, setDisplayingMessage] = useState(false);
  const trackDonation = useAnalytics({
    category: ANALYTICS_CATEGORIES.FOOTER
  });
  const [isReady, clear, set] = useTimeoutFn(() => setDisplayingMessage(false), 3000);

  useEffectOnce(() => clear());

  const displayMessage = useCallback(() => {
    if (isReady() === false) clear();
    else {
      setDisplayingMessage(true);
      set();
    }
  }, [setDisplayingMessage]);

  const trackDonationClicked = useCallback(
    (title: string) => {
      trackDonation({
        actionName: `Donate ${title} clicked`
      });
    },
    [trackDonation]
  );

  return (
    <>
      <Box width="100%" p="16px">
        <Text
          textTransform="uppercase"
          fontSize={{ _: '14px', sm: '12px' }}
          fontWeight={700}
          color={{ _: 'GREYISH_BROWN', sm: 'BLUE_DARK_SLATE' }}
        >
          {translateRaw('NAVIGATION_DONATE')}
        </Text>
        <Box
          variant="rowAlign"
          justifyContent="space-between"
          width={{ _: '215px', sm: '100%' }}
          mb={SPACING.SM}
        >
          <CopyToClipboard
            text={donationAddressMap.ETH}
            onCopy={() => {
              displayMessage();
              trackDonationClicked('Ethereum');
            }}
          >
            <Box
              variant="rowCenter"
              width="103px"
              height="32px"
              backgroundColor="BLUE_MYC"
              color="WHITE"
              borderRadius="3px"
              py="10px"
            >
              <Icon type="nav-ethereum" width="10px" />
              <Text ml="10px" mb={0}>
                {translateRaw('NAVIGATION_ETHEREUM')}
              </Text>
            </Box>
          </CopyToClipboard>
          <CopyToClipboard
            text={donationAddressMap.BTC}
            onCopy={() => {
              displayMessage();
              trackDonationClicked('Bitcoin');
            }}
          >
            <Box
              variant="rowCenter"
              width="103px"
              height="32px"
              backgroundColor="BLUE_MYC"
              color="WHITE"
              borderRadius="3px"
              py="10px"
            >
              <Icon type="nav-bitcoin" width="10px" />
              <Text ml="10px" mb={0}>
                {translateRaw('NAVIGATION_BITCOIN')}
              </Text>
            </Box>
          </CopyToClipboard>
        </Box>
        <Box minHeight="25px" pb={SPACING.SM} variant="rowAlign">
          {displayingMessage && (
            <>
              <Icon type="confirm" width="10px" />
              <Text fontSize={5} fontStyle="italic" mb={0} ml="5px" color="DARK_BLUE_SLATE">
                {translateRaw('NEW_FOOTER_TEXT_2')}
              </Text>
            </>
          )}
        </Box>
        <Text
          textTransform="uppercase"
          fontSize={{ _: '14px', sm: '12px' }}
          fontWeight={700}
          color={{ _: 'GREYISH_BROWN', sm: 'BLUE_DARK_SLATE' }}
        >
          {translateRaw('NAVIGATION_PARTNERS')}
        </Text>
        {items.map((item, i) => item.type === 'external' && <ExternalLink key={i} item={item} />)}
      </Box>
    </>
  );
};
