import styled from 'styled-components';

import { Banner, LinkApp } from '@components';
import { ROUTE_PATHS } from '@config';
import { SPACING } from '@theme';
import { Trans, translateRaw } from '@translations';
import { BannerType } from '@types';

const SBanner = styled(Banner)`
  border-radius: 3px;
  margin: ${SPACING.BASE} 0px;
  padding: ${SPACING.BASE};
  font-size: 16px;
  & a:hover {
    font-weight: normal;
  }
`;

const BannerText = (
  <Trans
    id="DEMO_GATEWAY_BANNER"
    variables={{
      $link: () => (
        <LinkApp href={ROUTE_PATHS.ADD_ACCOUNT.path} variant="underlineLink">
          {translateRaw('ADD_AN_ACCOUNT')}
        </LinkApp>
      )
    }}
  />
);

export const DemoGatewayBanner = () => (
  <SBanner value={BannerText} type={BannerType.NOTIFICATION} />
);
