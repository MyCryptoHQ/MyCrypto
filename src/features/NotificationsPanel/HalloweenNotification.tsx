import React from 'react';

import poapImage from '@assets/images/halloween-poap.svg';
import { Body, Box, Button, Heading } from '@components';
import { translateRaw } from '@translations';

export const HalloweenNotification = () => (
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
    <Box>
      <Button>{translateRaw('CLAIM_NOW')}</Button>
    </Box>
  </Box>
);
