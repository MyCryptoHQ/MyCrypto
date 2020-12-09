import React, { useCallback, useEffect, useRef, useState } from 'react';

import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';

import { Box, Icon, Text } from '@components';
import { donationAddressMap } from '@config';
import { useAnalytics } from '@hooks';
import { ANALYTICS_CATEGORIES } from '@services';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';
import { TTrayItem } from '@types';

import { ExternalLink } from './ExternalLink';

const SText = styled(Text)`
  text-transform: uppercase;
`;

export const SupportUsTray = ({ items }: { items: TTrayItem[] }) => {
  const [displayingMessage, setDisplayMassage] = useState(false);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackDoncation = useAnalytics({
    category: ANALYTICS_CATEGORIES.FOOTER
  });

  const clearTimeoutId = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }, [timeoutId]);

  useEffect(() => {
    return () => {
      clearTimeoutId();
    };
  }, [clearTimeoutId]);

  const displayMessage = useCallback(() => {
    setDisplayMassage(true);
    clearTimeoutId();

    timeoutId.current = setTimeout(() => {
      setDisplayMassage(false);
    }, 3000);
  }, [setDisplayMassage]);

  const trackDonationClicked = useCallback(
    (title: string) => {
      trackDoncation({
        actionName: `Donate ${title} clicked`
      });
    },
    [trackDoncation]
  );

  return (
    <>
      <Box width="100%">
        <SText fontSize="12px" fontWeight={700} color="BLUE_DARK_SLATE">
          {translateRaw('NAVIGATION_DONATE')}
        </SText>
        <Box variant="rowAlign" justifyContent="space-between" width="100%" mb={SPACING.SM}>
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
        <SText fontSize="12px" fontWeight={700} color="BLUE_DARK_SLATE">
          {translateRaw('NAVIGATION_PARTNERS')}
        </SText>
        {items.map((item, i) => item.type === 'external' && <ExternalLink key={i} item={item} />)}
      </Box>
    </>
  );
};
