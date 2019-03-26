import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button } from '@mycrypto/ui';
import cloneDeep from 'lodash/cloneDeep';
import styled from 'styled-components';

import { ContentPanel } from 'v2/components';
import { GithubService, AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { OS } from 'v2/services/Github';
import { DOWNLOAD_PAGE_URL, GITHUB_RELEASE_NOTES_URL } from './constants';
import { getFeaturedOS } from './helpers';
import { Layout } from 'v2/features';
import { AppDownloadItem } from './types';
import translate from 'translations';

// Legacy
import desktopAppIcon from 'common/assets/images/icn-desktop-app.svg';

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
  color: ${props => props.theme.headline};
`;

const Description = styled.p`
  font-size: 18px;
  font-weight: normal;
  line-height: 1.5;
  padding: 0 30px 0 30px;
  color: ${props => props.theme.text};
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

const Option = styled(Button)`
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

const Footer = styled.p`
  font-size: 16px;
  font-weight: normal;
  line-height: normal;
  margin: 0;

  a {
    color: ${props => props.theme.link};
    text-decoration: none;
    font-weight: bold;

    :hover {
      color: ${props => props.theme.linkHover};
    }
  }
`;

type Props = RouteComponentProps<{}>;

const DEFAULT_LINK = GITHUB_RELEASE_NOTES_URL;
const featuredOS = getFeaturedOS();

interface State {
  downloadItems: AppDownloadItem[];
}

export class DownloadApp extends Component<Props, State> {
  public state: State = {
    downloadItems: [
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
    ]
  };

  public async componentDidMount() {
    try {
      const releaseURLs = await GithubService.instance.getReleasesURLs();
      const downloadItems: AppDownloadItem[] = cloneDeep(this.state.downloadItems);

      downloadItems.forEach(downloadItem => {
        downloadItem.link = releaseURLs[downloadItem.OS] || DEFAULT_LINK;
      });

      this.setState({ downloadItems });
      this.trackUserLandsOnComponent(
        downloadItems.find(x => x.OS === featuredOS) || downloadItems[0]
      );
    } catch (e) {
      console.error(e);
    }
  }

  public render() {
    const { downloadItems } = this.state;
    const primaryDownload = downloadItems.find(x => x.OS === featuredOS) || downloadItems[0];
    const secondaryDownloads = downloadItems.filter(x => x !== primaryDownload);

    return (
      <Layout centered={true}>
        <ContentPanel onBack={this.props.history.goBack} className="">
          <DownloadAppWrapper>
            <Header>{translate('DOWNLOAD_APP_TITLE')}</Header>
            <Description>{translate('DOWNLOAD_APP_DESCRIPTION')}</Description>
            <ImgIcon src={desktopAppIcon} alt="Desktop" />
            <PrimaryButton onClick={() => this.openDownloadLink(primaryDownload)}>
              {translate('DOWNLOAD_APP_DOWNLOAD_BUTTON')} {primaryDownload.name}
            </PrimaryButton>
            <OptionGroup>
              <Option secondary={true} onClick={() => this.openDownloadLink(secondaryDownloads[0])}>
                {secondaryDownloads[0].name}
              </Option>
              <Option secondary={true} onClick={() => this.openDownloadLink(secondaryDownloads[1])}>
                {secondaryDownloads[1].name}
              </Option>
            </OptionGroup>
            <OptionGroup>
              <Option secondary={true} onClick={() => this.openDownloadLink(secondaryDownloads[2])}>
                {secondaryDownloads[2].name}
              </Option>
              <Option secondary={true} onClick={() => this.openDownloadLink(secondaryDownloads[3])}>
                {secondaryDownloads[3].name}
              </Option>
            </OptionGroup>
            <Footer>
              {translate('DOWNLOAD_APP_FOOTER_INFO')}{' '}
              <a
                onClick={this.trackLearnMoreClick}
                href={DOWNLOAD_PAGE_URL}
                target="_blank"
                rel="noreferrer"
              >
                {translate('DOWNLOAD_APP_FOOTER_INFO_LINK')}
              </a>
            </Footer>
          </DownloadAppWrapper>
        </ContentPanel>
      </Layout>
    );
  }

  private openDownloadLink = (item: AppDownloadItem) => {
    const target = item.link === DEFAULT_LINK ? '_blank' : '_self';
    window.open(item.link, target);
    AnalyticsService.instance.track(
      ANALYTICS_CATEGORIES.DOWNLOAD_DESKTOP,
      `${item.name} download button clicked`
    );
  };

  private trackLearnMoreClick = () => {
    AnalyticsService.instance.track(
      ANALYTICS_CATEGORIES.DOWNLOAD_DESKTOP,
      'Learn more link clicked'
    );
  };

  private trackUserLandsOnComponent = (item: AppDownloadItem) => {
    AnalyticsService.instance.track(
      ANALYTICS_CATEGORIES.DOWNLOAD_DESKTOP,
      `${item.name} user lands on this component`
    );
  };
}

export default withRouter<Props>(DownloadApp);
