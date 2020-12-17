import React from 'react';

import styled from 'styled-components';

import { Banner } from '@components';
import { SPACING } from '@theme';
import { BannerType } from '@types';

const SBanner = styled(Banner)`
  border-radius: 3px;
  margin: ${SPACING.BASE} 0px;
  padding: ${SPACING.BASE};
  font-size: 16px;
`;

export const DemoGatewayBanner = ({ copy }: { copy: string }) => (
  <SBanner value={copy} type={BannerType.NOTIFICATION} />
);
