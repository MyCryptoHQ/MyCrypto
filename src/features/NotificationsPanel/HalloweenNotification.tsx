import React from 'react';

import bg from '@assets/images/halloween-bg.svg';
import poapImage from '@assets/images/halloween-poap.svg';
import { Body, Box, Button, Heading } from '@components';
import { translateRaw } from '@translations';

export const HalloweenNotification = () => (
  <Box variant="rowAlign" style={{ backgroundImage: `url(${bg})` }}>
    <Box mr="3">
      <img src={poapImage} />
    </Box>
    <Box>
      <Heading color="WARNING_ORANGE" fontWeight="bold" fontSize="24px" lineHeight="32px">
        {translateRaw('POAP_NOTIFICATION_HEADER')}
      </Heading>
      <Body color="WARNING_ORANGE">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Euismod pharetra quis fringilla
        ultricies turpis elit varius. Porttitor amet, tortor, nunc lectus.
      </Body>
    </Box>
    <Box ml="3">
      <Button>{translateRaw('CLAIM_NOW')}</Button>
    </Box>
  </Box>
);
