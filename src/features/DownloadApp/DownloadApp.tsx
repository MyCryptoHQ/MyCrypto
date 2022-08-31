import { FC, useEffect, useState } from 'react';

import { Button } from '@mycrypto/ui';
import cloneDeep from 'lodash/cloneDeep';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import desktopAppIcon from '@assets/images/icn-desktop-app.svg';
import { ExtendedContentPanel, LinkApp, Text } from '@components';
import { DOWNLOAD_MYCRYPTO_LINK, GITHUB_RELEASE_NOTES_URL, OS } from '@config';
import { GithubService } from '@services/ApiService';
import translate from '@translations';
import { getFeaturedOS, goBack } from '@utils';

const DownloadAppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 4px 26px 4px;
  text-align: center;
`;

const Header = styled.p`
  font-size: 32px;
  font-weight: bold;
  line-height: normal;
  margin-top: 0;
  margin-bottom: 15px;
  color: ${(props) => props.theme.headline};
`;

const Description = styled.p`
  font-size: 18px;
  font-weight: normal;
  line-height: 1.5;
  padding: 0 30px 0 30px;
  color: ${(props) => props.theme.text};
`;

const ImgIcon = styled.img`
  width: 135px;
  height: 135px;
  margin: 21px 0 28px 0;
`;

const PrimaryButton = styled(Button)`
  width: 320px;
  margin-bottom: 15px;
  font-size: 18px;

  @media (min-width: 700px) {
    width: 420px;
  }
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 700px) {
    flex-direction: row;
  }
`;

const SButton = styled(Button)`
  width: 100%;
`;

const SLinkApp = styled(LinkApp)`
  width: 320px;
  margin-bottom: 15px;
  font-size: 17px;

  @media (min-width: 700px) {
    width: 200px;

    &:first-of-type {
      margin-right: 20px;
    }
  }
`;

const DEFAULT_LINK = GITHUB_RELEASE_NOTES_URL;
const featuredOS = getFeaturedOS();

const DownloadApp: FC<RouteComponentProps> = ({ history }) => {
  const [downloadItems, setDownloadItems] = useState([
    {
      OS: OS.WINDOWS,
      name: 'Windows',
      link: DEFAULT_LINK
    },
    {
      OS: OS.MAC,
      name: 'Mac',
      link: DEFAULT_LINK
    },
    {
      OS: OS.LINUX64,
      name: 'Linux (64-bit)',
      link: DEFAULT_LINK
    },
    {
      OS: OS.LINUX32,
      name: 'Linux (32-bit)',
      link: DEFAULT_LINK
    },
    {
      OS: OS.STANDALONE,
      name: 'Stand Alone',
      link: DEFAULT_LINK
    }
  ]);

  useEffect(() => {
    (async () => {
      try {
        const { releaseUrls } = await GithubService.instance.getReleasesInfo();
        const downloadItemsTemp = cloneDeep(downloadItems);

        downloadItemsTemp.forEach((downloadItem) => {
          downloadItem.link = releaseUrls[downloadItem.OS] || DEFAULT_LINK;
        });

        setDownloadItems(downloadItemsTemp);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [setDownloadItems]);

  const primaryDownload = downloadItems.find((x) => x.OS === featuredOS) ?? downloadItems[0];
  const secondaryDownloads = downloadItems.filter((x) => x !== primaryDownload);
  const onBack = () => goBack(history);

  return (
    <ExtendedContentPanel onBack={onBack}>
      <DownloadAppWrapper>
        <Header>{translate('DOWNLOAD_APP_TITLE')}</Header>
        <Description>{translate('DOWNLOAD_APP_DESCRIPTION')}</Description>
        <ImgIcon src={desktopAppIcon} alt="Desktop" />
        <LinkApp href={primaryDownload.link} isExternal={true} target="_self">
          <PrimaryButton>
            {translate('DOWNLOAD_APP_DOWNLOAD_BUTTON')} {primaryDownload.name}
          </PrimaryButton>
        </LinkApp>
        <OptionGroup>
          <SLinkApp href={secondaryDownloads[0].link} isExternal={true} target="_self">
            <SButton secondary={true}>{secondaryDownloads[0].name}</SButton>
          </SLinkApp>
          <SLinkApp href={secondaryDownloads[1].link} isExternal={true} target="_self">
            <SButton secondary={true}>{secondaryDownloads[1].name}</SButton>
          </SLinkApp>
        </OptionGroup>
        <OptionGroup>
          <SLinkApp href={secondaryDownloads[2].link} isExternal={true} target="_self">
            <SButton secondary={true}>{secondaryDownloads[2].name}</SButton>
          </SLinkApp>
          <SLinkApp href={secondaryDownloads[3].link} isExternal={true} target="_self">
            <SButton secondary={true}>{secondaryDownloads[3].name}</SButton>
          </SLinkApp>
        </OptionGroup>
        <Text mb={0}>
          {translate('DOWNLOAD_APP_FOOTER_INFO')}{' '}
          <LinkApp href={DOWNLOAD_MYCRYPTO_LINK} isExternal={true}>
            {translate('DOWNLOAD_APP_FOOTER_INFO_LINK')}
          </LinkApp>
        </Text>
      </DownloadAppWrapper>
    </ExtendedContentPanel>
  );
};

export default withRouter(DownloadApp);
