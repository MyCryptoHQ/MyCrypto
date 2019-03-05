import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button, Heading, Typography } from '@mycrypto/ui';
import cloneDeep from 'lodash/cloneDeep';

import { ContentPanel } from 'v2/components';
import { GithubService } from 'v2/services';
import { DOWNLOAD_PAGE_URL, GITHUB_RELEASE_NOTES_URL } from './constants';
import { getFeaturedOS } from './helpers';
import { Layout } from 'v2/features';
import { AppDownloadItem } from './types';
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
        OS: 'windows',
        name: 'Windows',
        link: DEFAULT_LINK
      },
      {
        OS: 'mac',
        name: 'Mac',
        link: DEFAULT_LINK
      },
      {
        OS: 'linux64',
        name: 'Linux (64-bit)',
        link: DEFAULT_LINK
      },
      {
        OS: 'linux32',
        name: 'Linux (32-bit)',
        link: DEFAULT_LINK
      },
      {
        OS: 'standalone',
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
    } catch (e) {
      console.error(e);
    }
  }

  public render() {
    const { downloadItems } = this.state;
    const primaryDownload = downloadItems.find(x => x.OS === featuredOS);
    const secondaryDownloads = downloadItems.filter(x => x !== primaryDownload);

    return (
      <Layout centered={true}>
        <ContentPanel onBack={this.props.history.goBack} className="DownloadApp">
          <Heading className="DownloadApp-heading">Download App</Heading>
          <Typography className="DownloadApp-description">
            Please download the MyCrypto Desktop app so you can securely complete creating your new
            account and start managing your funds.
          </Typography>
          <img className="DownloadApp-icon" src={desktopAppIcon} alt="Desktop" />
          <Button
            className="DownloadApp-option"
            onClick={() => this.openDownloadLink(primaryDownload.link)}
          >
            {primaryDownload.name}
          </Button>
          <div className="DownloadApp-optionGroup">
            <Button
              className="DownloadApp-optionGroup-option"
              secondary={true}
              onClick={() => this.openDownloadLink(secondaryDownloads[0].link)}
            >
              {secondaryDownloads[0].name}
            </Button>
            <Button
              className="DownloadApp-optionGroup-option"
              secondary={true}
              onClick={() => this.openDownloadLink(secondaryDownloads[1].link)}
            >
              {secondaryDownloads[1].name}
            </Button>
          </div>
          <div className="DownloadApp-optionGroup">
            <Button
              className="DownloadApp-optionGroup-option"
              secondary={true}
              onClick={() => this.openDownloadLink(secondaryDownloads[2].link)}
            >
              {secondaryDownloads[2].name}
            </Button>
            <Button
              className="DownloadApp-optionGroup-option"
              secondary={true}
              onClick={() => this.openDownloadLink(secondaryDownloads[3].link)}
            >
              {secondaryDownloads[3].name}
            </Button>
          </div>
          <Typography className="DownloadApp-learnMore">
            Not sure what this is?{' '}
            <a href={DOWNLOAD_PAGE_URL} target="_blank" rel="noreferrer">
              <Typography className="DownloadApp-learnMore-link">
                Learn more about our desktop app.
              </Typography>
            </a>
          </Typography>
        </ContentPanel>
      </Layout>
    );
  }

  private openDownloadLink = (link: string) => {
    const target = link === DEFAULT_LINK ? '_blank' : '_self';
    window.open(link, target);
  };
}

export default withRouter<Props>(DownloadApp);
