import styled from 'styled-components';

import AppStoreBadgeIMG from '@assets/images/mobile/app-store-badge.png';
import GooglePlayBadgeIMG from '@assets/images/mobile/google-play-badge.png';
import { Body, Box, Button, Heading, LinkApp, Text } from '@components';
import { DOWNLOAD_MYCRYPTO_LINK, WALLETS_CONFIG } from '@config';
import { BREAK_POINTS, SPACING } from '@theme';
import translate from '@translations';
import { useScreenSize } from '@utils';

const Web3ImgContainer = styled.div`
  margin: 2em;
  padding-top: 2em;
  display: flex;
  width: 150px;
  flex: 1;

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin: 0.5em;
    padding-top: 0.5em;
  }
`;

const AppLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  > * {
    margin-top: ${SPACING.SM};
  }
`;

function InstallTrunk() {
  const providers = [WALLETS_CONFIG.METAMASK, WALLETS_CONFIG.COINBASE];
  return (
    <Box variant="rowAlign" justifyContent="space-between" mt={SPACING.BASE} width="100%">
      {providers.map((provider) => (
        <Box
          key={provider.id}
          width="100%"
          justifyContent="space-between"
          variant="columnAlign"
          margin={SPACING.SM}
        >
          <LinkApp href={provider.install!.getItLink!} isExternal={true}>
            <Box
              variant="columnCenter"
              m={SPACING.SM}
              size={{ _: '150px', xs: '200px' }}
              backgroundColor="WHITE"
              boxShadow="0 3px 6px 0 rgba(0, 0, 0, 0.07)"
              borderRadius="6px"
              px={SPACING.LG}
            >
              <img src={provider.icon} />
              <Box variant="columnCenter" minHeight="3em" mt={SPACING.SM}>
                <Text color="BLUE_DARK_SLATE" mb={0} textAlign="center">
                  {provider.name}
                </Text>
              </Box>
            </Box>
          </LinkApp>

          <AppLinkContainer>
            {provider.install && provider.install.appStore && (
              <LinkApp href={provider.install.appStore} isExternal={true}>
                <img src={AppStoreBadgeIMG} />
              </LinkApp>
            )}

            {provider.install && provider.install.googlePlay && (
              <LinkApp href={provider.install.googlePlay} isExternal={true}>
                <img src={GooglePlayBadgeIMG} />
              </LinkApp>
            )}
          </AppLinkContainer>
        </Box>
      ))}
    </Box>
  );
}

const InstallMetaMask = () => {
  const provider = WALLETS_CONFIG.METAMASK;
  return (
    <>
      <Box variant="columnCenter" mb={SPACING.BASE}>
        <Web3ImgContainer>
          <img src={provider.icon} />
        </Web3ImgContainer>
        <LinkApp href={provider.install!.getItLink!} isExternal={true}>
          <Button>{translate('PROVIDER_DOWNLOAD', { $provider: provider.name })}</Button>
        </LinkApp>
      </Box>
      <Box style={{ textAlign: 'center' }} mt={4}>
        {translate('ADD_ACCOUNT_WEB3_INSTALL_FOOTER')} <br />
        <LinkApp href={DOWNLOAD_MYCRYPTO_LINK} isExternal={true}>
          {translate('ADD_ACCOUNT_WEB3_INSTALL_FOOTER_LINK')}
        </LinkApp>
      </Box>
    </>
  );
};

const Web3ProviderInstall = () => {
  const { isMobile } = useScreenSize();
  return <Web3ProviderInstallUI isMobile={isMobile} />;
};

export const Web3ProviderInstallUI = ({ isMobile }: { isMobile: boolean }) => (
  <Box>
    <Heading fontSize="32px" textAlign="center" fontWeight="bold">
      {translate('ADD_ACCOUNT_WEB3_INSTALL_TITLE', {
        $walletId: isMobile ? 'Web3 Provider' : 'Metamask'
      })}
    </Heading>
    <Body textAlign="center">
      {translate(
        isMobile ? 'ADD_ACCOUNT_WEB3_INSTALL_MOBILE_DESC' : 'ADD_ACCOUNT_WEB3_INSTALL_DESC'
      )}
    </Body>
    <div>{isMobile ? <InstallTrunk /> : <InstallMetaMask />}</div>
  </Box>
);
export default Web3ProviderInstall;
