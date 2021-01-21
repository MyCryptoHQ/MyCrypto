import React from 'react';

import styled from 'styled-components';

import { COLORS } from '@theme';
import translate from '@translations';
import { BannerType } from '@types';

import { Banner } from './Banner';

const SBanner = styled(Banner)`
  background-color: ${COLORS.LIGHT_PURPLE};
  border-radius: 16px;
`;

const CenteredBannerText = styled.div`
  text-align: center;
  & a {
    &:hover {
      font-weight: normal;
    }
  }
`;

export const AnnouncementBanner = () => (
  <SBanner
    type={BannerType.ANNOUNCEMENT}
    value={<CenteredBannerText>{translate('LAUNCH_ANNOUNCEMENT')}</CenteredBannerText>}
  />
);
