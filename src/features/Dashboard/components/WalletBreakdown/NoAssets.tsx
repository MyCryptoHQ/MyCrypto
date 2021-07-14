import styled from 'styled-components';

import addIcon from '@assets/images/icn-add-assets.svg';
import { LinkApp } from '@components';
import { BUY_MYCRYPTO_WEBSITE, ROUTE_PATHS } from '@config';
import { COLORS } from '@theme';
import translate, { Trans, translateRaw } from '@translations';

const { BLUE_BRIGHT } = COLORS;

const NoAssetsWrapper = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NoAssetsCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PlusIcon = styled.img`
  width: 75px;
  height: 75px;
`;

const NoAssetsHeading = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #b5bfc7;
`;

const NoAssetsDescription = styled.div`
  color: #b5bfc7;
  text-align: center;
  font-weight: normal;

  > a {
    color: ${BLUE_BRIGHT};
  }
`;

const NoAssets = ({ numOfAssets }: { numOfAssets: number }) => {
  return (
    <NoAssetsWrapper>
      <NoAssetsCenter>
        <PlusIcon src={addIcon} />
        <NoAssetsHeading>{translate('WALLET_BREAKDOWN_NO_ASSETS')}</NoAssetsHeading>
        <NoAssetsDescription>
          {numOfAssets === 0 ? (
            <Trans
              id="WALLET_BREAKDOWN_NO_ASSETS_MORE_HIDDEN"
              variables={{
                $link: () => (
                  <LinkApp href={ROUTE_PATHS.SETTINGS.path}>
                    {translateRaw('WALLET_BREAKDOWN_SETTINGS_PAGE')}
                  </LinkApp>
                )
              }}
            />
          ) : (
            <Trans
              id="WALLET_BREAKDOWN_NO_ASSETS_MORE"
              variables={{
                $link: () => (
                  <LinkApp href={BUY_MYCRYPTO_WEBSITE} isExternal={true}>
                    {translateRaw('WALLET_BREAKDOWN_BUY_ETH')}
                  </LinkApp>
                )
              }}
            />
          )}
        </NoAssetsDescription>
      </NoAssetsCenter>
    </NoAssetsWrapper>
  );
};

export default NoAssets;
