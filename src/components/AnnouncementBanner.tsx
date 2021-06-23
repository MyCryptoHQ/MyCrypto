import styled from 'styled-components';

import { LinkApp } from '@components';
import { MYCRYPTO_PROD_LINK } from '@config';
import { COLORS } from '@theme';
import translate, { Trans } from '@translations';
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
    value={
      <CenteredBannerText>
        <Trans
          id="LAUNCH_ANNOUNCEMENT"
          variables={{
            $link: () => (
              <LinkApp
                href={MYCRYPTO_PROD_LINK}
                isExternal={true}
                variant="underlineLink"
                $underline={true}
              >
                {
                  // Remove protocol from uri
                  MYCRYPTO_PROD_LINK.split('//')[1]
                }
              </LinkApp>
            )
          }}
        />
        {translate('')}
      </CenteredBannerText>
    }
  />
);
