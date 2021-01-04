import React from 'react';

import styled from 'styled-components';

import { Banner } from '@components';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';
import { BannerType } from '@types';

const SBanner = styled(Banner)`
  border-radius: 3px;
  margin: ${SPACING.BASE} 0px;
  padding: ${SPACING.BASE};
  font-size: 16px;
`;

export const DemoGatewayBanner = () => (
  <SBanner value={translateRaw('DEMO_GATEWAY_BANNER')} type={BannerType.NOTIFICATION} />
);
