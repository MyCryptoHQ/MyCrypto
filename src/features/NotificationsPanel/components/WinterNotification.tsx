import React, { useState } from 'react';

import poapImage from '@assets/images/winter-poap.svg';
import { Body, Box, Button, Heading, LinkApp, Text } from '@components';
import { PoapClaimService } from '@services/ApiService/PoapClaim';
import { claimPromo, getAnalyticsUserID, getPromoPoap, useDispatch, useSelector } from '@store';
import translate, { translateRaw } from '@translations';
import { useScreenSize } from '@utils';

export const WinterNotification = () => {
  const { isMobile } = useScreenSize();

  return (
    <Box variant={isMobile ? 'columnAlign' : 'rowAlign'}>
      <Box mr="4" width="10%">
        <img src={poapImage} />
      </Box>
      <Box mr="2" width="60%">
        <Heading
          color="WHITE"
          fontWeight="bold"
          fontSize="24px"
          lineHeight="32px"
          mt="0"
          textAlign={isMobile ? 'center' : 'left'}
        >
          {translateRaw('POAP_NOTIFICATION_HEADER')}
        </Heading>
        <Body color="WHITE">{translate('POAP_NOTIFICATION_BODY')}</Body>
        <Body color="WHITE" fontSize="12px" fontStyle="italic">
          {translate('POAP_ANALYTICS_NOTICE')}
        </Body>
      </Box>
      <Box variant="rowCenter" width="30%">
        <NotificationContent />
      </Box>
    </Box>
  );
};

const NotificationContent = () => {
  const dispatch = useDispatch();
  const key = 'winter2021';
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
        <Text as="div" color="white" fontSize="2" textAlign="center">
          {translateRaw('POAP_ERROR_HEADER')}
        </Text>
        <Text as="div" color="white" textAlign="center" width="80%">
          {translate('POAP_ERROR_BODY')}
        </Text>
      </Box>
    );
  }

  return !isClaimed ? (
    <Button
      onClick={handleClaim}
      loading={isClaiming}
      disabled={analyticsId.length === 0}
      colorScheme="transparent"
    >
      {translateRaw('CLAIM_NOW')}
    </Button>
  ) : (
    <Box variant="columnCenter">
      <Text as="div" color="white" fontSize="2" textAlign="center">
        {translateRaw('POAP_CLAIM_APPROVED')}
      </Text>
      <LinkApp mt="2" isExternal href={promo!.claim!} textAlign="center">
        {translateRaw('ACCESS_POAP_LINK')}
      </LinkApp>
    </Box>
  );
};
