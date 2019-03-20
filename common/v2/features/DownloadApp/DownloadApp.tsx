import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button, Heading, Typography } from '@mycrypto/ui';
import cloneDeep from 'lodash/cloneDeep';

import { ContentPanel } from 'v2/components';
import { GithubService, AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { OS } from 'v2/services/Github';
import { DOWNLOAD_PAGE_URL } from './constants';
import { GITHUB_RELEASE_NOTES_URL } from 'v2/features/constants';
import { getFeaturedOS } from 'v2/features/helpers';
import { Layout } from 'v2/features';
import { AppDownloadItem } from './types';
import translate from 'translations';
import './DownloadApp.scss';

// Legacy
import desktopAppIcon from 'common/assets/images/icn-desktop-app.svg';

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
        <ContentPanel onBack={this.props.history.goBack} className="DownloadApp">
          <Heading className="DownloadApp-heading"> {translate('DOWNLOAD_APP_TITLE')}</Heading>
          <Typography className="DownloadApp-description">
            {translate('DOWNLOAD_APP_DESCRIPTION')}
          </Typography>
          <img className="DownloadApp-icon" src={desktopAppIcon} alt="Desktop" />
          <Button
            className="DownloadApp-option"
            onClick={() => this.openDownloadLink(primaryDownload)}
          >
            {primaryDownload.name}
          </Button>
          <div className="DownloadApp-optionGroup">
            <Button
              className="DownloadApp-optionGroup-option"
              secondary={true}
              onClick={() => this.openDownloadLink(secondaryDownloads[0])}
            >
              {secondaryDownloads[0].name}
            </Button>
            <Button
              className="DownloadApp-optionGroup-option"
              secondary={true}
              onClick={() => this.openDownloadLink(secondaryDownloads[1])}
            >
              {secondaryDownloads[1].name}
            </Button>
          </div>
          <div className="DownloadApp-optionGroup">
            <Button
              className="DownloadApp-optionGroup-option"
              secondary={true}
              onClick={() => this.openDownloadLink(secondaryDownloads[2])}
            >
              {secondaryDownloads[2].name}
            </Button>
            <Button
              className="DownloadApp-optionGroup-option"
              secondary={true}
              onClick={() => this.openDownloadLink(secondaryDownloads[3])}
            >
              {secondaryDownloads[3].name}
            </Button>
          </div>
          <Typography className="DownloadApp-learnMore">
            {translate('DOWNLOAD_APP_FOOTER_INFO')}{' '}
            <a
              onClick={this.trackLearnMoreClick}
              href={DOWNLOAD_PAGE_URL}
              target="_blank"
              rel="noreferrer"
            >
              {translate('DOWNLOAD_APP_FOOTER_INFO_LINK')}
            </a>
          </Typography>
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
