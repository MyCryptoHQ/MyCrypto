import React, { useState } from 'react';

import poapImage from '@assets/images/halloween-poap.svg';
import { Body, Box, Button, Heading, LinkApp, Text } from '@components';
import { PoapClaimService } from '@services/ApiService/PoapClaim';
import { claimPromo, getAnalyticsUserID, getPromoPoap, useDispatch, useSelector } from '@store';
import translate, { translateRaw } from '@translations';
import { useScreenSize } from '@utils';

export const HalloweenNotification = () => {
  const { isMobile } = useScreenSize();

  return (
    <Box variant={isMobile ? 'columnAlign' : 'rowAlign'}>
      <Box mr="4" width="10%">
        <img src={poapImage} />
      </Box>
      <Box mr="2" width="60%">
        <Heading color="WARNING_ORANGE" fontWeight="bold" fontSize="24px" lineHeight="32px" mt="0">
          {translateRaw('HALLOWEEN_POAP_NOTIFICATION_HEADER')}
        </Heading>
        <Body color="WARNING_ORANGE">{translate('HALLOWEEN_POAP_NOTIFICATION_BODY')}</Body>
      </Box>
      <Box variant="rowCenter" width="30%">
        <NotificationContent />
      </Box>
    </Box>
  );
};

const NotificationContent = () => {
  const dispatch = useDispatch();
  const key = 'halloween2021';
  const analyticsId = useSelector(getAnalyticsUserID);
  const promo = useSelector(getPromoPoap(key));
  const [isClaiming, setIsClaiming] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleClaim = () => {
    if (isClaiming) {
      return;
    }
    setIsClaiming(true);
    PoapClaimService.claim(analyticsId).then((res) => {
      if (res?.success) {
        dispatch(claimPromo({ key, claim: res.claim }));
      } else {
        setIsError(true);
      }
      setIsClaiming(false);
    });
  };

  const isClaimed = promo?.claimed;

  if (isError) {
    return (
      <Box variant="columnCenter">
        <Text as="div" color="white" fontSize="2">
          {translateRaw('HALLOWEEN_POAP_ERROR_HEADER')}
        </Text>
        <Text as="div" color="white" textAlign="center" width="80%">
          {translate('HALLOWEEN_POAP_ERROR')}
        </Text>
      </Box>
    );
  }

  return !isClaimed ? (
    <Button onClick={handleClaim} loading={isClaiming}>
      {translateRaw('CLAIM_NOW')}
    </Button>
  ) : (
    <Box variant="columnCenter">
      <Text as="div" color="white" fontSize="2">
        {translateRaw('POAP_CLAIM_APPROVED')}
      </Text>
      <LinkApp mt="2" isExternal href={promo!.claim!} textAlign="center">
        {translateRaw('ACCESS_POAP_LINK')}
      </LinkApp>
    </Box>
  );
};
