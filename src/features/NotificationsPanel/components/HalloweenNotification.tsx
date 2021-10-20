import React, { useState } from 'react';

import poapImage from '@assets/images/halloween-poap.svg';
import { Body, Box, Button, Heading, LinkApp, Text } from '@components';
import { PoapClaimService } from '@services/ApiService/PoapClaim';
import { claimPromo, getAnalyticsUserID, getPromoPoap, useDispatch, useSelector } from '@store';
import { translateRaw } from '@translations';

export const HalloweenNotification = () => {
  const dispatch = useDispatch();
  const key = 'halloween2021';
  const analyticsId = useSelector(getAnalyticsUserID);
  const promo = useSelector(getPromoPoap(key));
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = () => {
    if (isClaiming) {
      return;
    }
    setIsClaiming(true);
    PoapClaimService.claim(analyticsId).then((res) => {
      if (res?.success) {
        dispatch(claimPromo({ key, claim: res.claim }));
      } else {
        // @todo
      }
      setIsClaiming(false);
    });
  };

  const isClaimed = promo?.claimed;

  return (
    <Box variant="rowAlign">
      <Box mr="4">
        <img src={poapImage} />
      </Box>
      <Box mr="4">
        <Heading color="WARNING_ORANGE" fontWeight="bold" fontSize="24px" lineHeight="32px" mt="0">
          {translateRaw('POAP_NOTIFICATION_HEADER')}
        </Heading>
        <Body color="WARNING_ORANGE">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Euismod pharetra quis fringilla
          ultricies turpis elit varius. Porttitor amet, tortor, nunc lectus.
        </Body>
      </Box>
      <Box variant="rowCenter" style={{ flexGrow: 1 }}>
        {!isClaimed ? (
          <Button onClick={handleClaim} loading={isClaiming}>
            {translateRaw('CLAIM_NOW')}
          </Button>
        ) : (
          <Box variant="columnCenter">
            <Text as="div" color="white" fontSize="2">
              {translateRaw('POAP_CLAIM_APPROVED')}
            </Text>
            <LinkApp mt="2" isExternal href={promo!.claim!}>
              {translateRaw('ACCESS_POAP_LINK')}
            </LinkApp>
          </Box>
        )}
      </Box>
    </Box>
  );
};
