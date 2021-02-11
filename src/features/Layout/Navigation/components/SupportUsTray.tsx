import React, { useCallback, useState } from 'react';

import CopyToClipboard from 'react-copy-to-clipboard';

import { Box, Icon, Text } from '@components';
import { donationAddressMap } from '@config';
import { useAnalytics } from '@services/Analytics';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';
import { TTrayItem } from '@types';
import { useEffectOnce, useTimeoutFn } from '@vendor';

import { TrayLink } from './TrayLink';

export const SupportUsTray = ({ items }: { items: TTrayItem[] }) => {
  const [displayingMessage, setDisplayingMessage] = useState(false);
  const { track } = useAnalytics();
  const [isReady, clear, set] = useTimeoutFn(() => setDisplayingMessage(false), 3000);

  useEffectOnce(() => clear());

  const displayMessage = useCallback(() => {
    if (isReady() === false) clear();
    else {
      setDisplayingMessage(true);
      set();
    }
  }, [setDisplayingMessage]);

  const trackDonationClicked = (title: string) => {
    track({
      name: 'Donate clicked',
      params: { asset: title }
    });
  };

  return (
    <>
      <Box width="100%" p={{ _: 0, sm: '1.6vh', xxl: '16px' }} pb={{ _: SPACING.MD, sm: 0 }}>
        <Text
          textTransform="uppercase"
          fontSize={{ _: '14px', sm: '1.2vh', xxl: '14px' }}
          fontWeight={700}
          color={{ _: 'GREYISH_BROWN', sm: 'BLUE_DARK_SLATE' }}
        >
          {translateRaw('NAVIGATION_DONATE')}
        </Text>
        <Box
          variant="rowAlign"
          justifyContent="space-between"
          width={{ _: '220px', sm: '100%' }}
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
              width={{ _: '105px', sm: '10.5vh', xxl: '105px' }}
              height={{ _: '32px', sm: '3.2vh', xxl: '32px' }}
              backgroundColor="BLUE_MYC"
              color="WHITE"
              borderRadius="3px"
              py={{ _: '10px', sm: '1vh', xxl: '10px' }}
            >
              <Icon type="nav-ethereum" width={{ _: '10px', sm: '1vh', xxl: '10px' }} />
              <Text
                ml={{ _: '10xp', sm: '1vh', xxl: '10px' }}
                mb={0}
                fontSize={{ _: '16px', sm: '1.6vh', xxl: '16px' }}
              >
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
              width={{ _: '105px', sm: '10.5vh', xxl: '105px' }}
              height={{ _: '32px', sm: '3.2vh', xxl: '32px' }}
              backgroundColor="BLUE_MYC"
              color="WHITE"
              borderRadius="3px"
              py={{ _: '10px', sm: '1vh', xxl: '10px' }}
            >
              <Icon type="nav-bitcoin" width={{ _: '10px', sm: '1vh', xxl: '10px' }} />
              <Text
                ml={{ _: '10xp', sm: '1vh', xxl: '10px' }}
                mb={0}
                fontSize={{ _: '16px', sm: '1.6vh', xxl: '16px' }}
              >
                {translateRaw('NAVIGATION_BITCOIN')}
              </Text>
            </Box>
          </CopyToClipboard>
        </Box>
        <Box minHeight={{ _: '25px', sm: '2.5vh', xxl: '25px' }} pb={SPACING.SM} variant="rowAlign">
          {displayingMessage && (
            <>
              <Icon type="confirm" width={{ _: '10px', sm: '1vh', xxl: '10px' }} />
              <Text
                fontSize={{ _: '10px', sm: '1vh', xxl: '10px' }}
                fontStyle="italic"
                mb={0}
                ml="5px"
                color="DARK_BLUE_SLATE"
              >
                {translateRaw('NEW_FOOTER_TEXT_2')}
              </Text>
            </>
          )}
        </Box>
        <Text
          textTransform="uppercase"
          fontSize={{ _: '14px', sm: '1.2vh', xxl: '14px' }}
          fontWeight={700}
          color={{ _: 'GREYISH_BROWN', sm: 'BLUE_DARK_SLATE' }}
        >
          {translateRaw('NAVIGATION_PARTNERS')}
        </Text>
        {items.map((item, i) => item.type === 'external' && <TrayLink key={i} item={item} />)}
      </Box>
    </>
  );
};
