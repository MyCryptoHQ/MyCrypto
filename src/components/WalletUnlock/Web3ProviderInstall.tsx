import React from 'react';

import { Typography } from '@mycrypto/ui';
import styled from 'styled-components';

import AppStoreBadgeIMG from '@assets/images/mobile/app-store-badge.png';
import GooglePlayBadgeIMG from '@assets/images/mobile/google-play-badge.png';
import { Box, Button, Heading, NewTabLink } from '@components';
import { DOWNLOAD_MYCRYPTO_LINK, WALLETS_CONFIG } from '@config';
import { BREAK_POINTS, SPACING } from '@theme';
import translate from '@translations';
import { useScreenSize } from '@utils';

const Web3ImgContainer = styled.div`
  margin: 2em;
  padding-top: 2em;
  display: flex;
  width: 60%;
  justify-content: center;
  align-content: center;

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin: 0.5em;
    padding-top: 0.5em;
  }
`;

const DownloadOption = styled(NewTabLink)`
  margin-top: ${SPACING.BASE};
`;

const Footer = styled.div`
  text-align: center;
`;

const SImgContainer = styled.div`
  width: 100%;
`;

function InstallTrunk() {
  const providers = [WALLETS_CONFIG.TRUST, WALLETS_CONFIG.COINBASE];
  return (
    <Box variant="rowAlign" mt={SPACING.BASE}>
      {providers.map((provider) => (
        <Box
          key={provider.id}
          width="100%"
          justifyContent="space-between"
          variant="columnCenter"
          alignSelf="flex-start"
          flexWrap="wrap"
          margin={SPACING.SM}
        >
          <NewTabLink href={provider.install ? provider.install.getItLink : undefined}>
            <SImgContainer>
              <img src={provider.icon} />
            </SImgContainer>
          </NewTabLink>

          <Typography>{provider.name}</Typography>
          {provider.install && provider.install.appStore && (
            <DownloadOption href={provider.install.appStore}>
              <img src={AppStoreBadgeIMG} />
            </DownloadOption>
          )}

          {provider.install && provider.install.googlePlay && (
            <DownloadOption href={provider.install.googlePlay}>
              <img src={GooglePlayBadgeIMG} />
            </DownloadOption>
          )}
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
          <SImgContainer>
            <img src={provider.icon} />
          </SImgContainer>
        </Web3ImgContainer>
        <a
          href={provider.install ? provider.install.getItLink : undefined}
          target="_blank"
          rel="noreferrer"
        >
          <Button>{translate('PROVIDER_DOWNLOAD', { $provider: provider.name })}</Button>
        </a>
      </Box>
      <Footer>
        {translate('ADD_ACCOUNT_WEB3_INSTALL_FOOTER')} <br />
        <NewTabLink
          content={translate('ADD_ACCOUNT_WEB3_INSTALL_FOOTER_LINK')}
          href={DOWNLOAD_MYCRYPTO_LINK}
        />
      </Footer>
    </>
  );
};

const Web3ProviderInstall = () => {
  const { isMobile } = useScreenSize();
  return <Web3ProviderInstallUI isMobile={isMobile} />;
};

export const Web3ProviderInstallUI = ({ isMobile }: { isMobile: boolean }) => (
  <Box p="2.5em">
    <Heading fontSize="32px" textAlign="center" fontWeight="bold">
      {translate('ADD_ACCOUNT_WEB3_INSTALL_TITLE', {
        $walletId: isMobile ? 'Web3 Provider' : 'Metamask'
      })}
    </Heading>
    <div>
      {translate(
        isMobile ? 'ADD_ACCOUNT_WEB3_INSTALL_MOBILE_DESC' : 'ADD_ACCOUNT_WEB3_INSTALL_DESC'
      )}
    </div>
    <div>{isMobile ? <InstallTrunk /> : <InstallMetaMask />}</div>
  </Box>
);
export default Web3ProviderInstall;
