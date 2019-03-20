import React, { Component } from 'react';
import { OS } from 'v2/services/Github';
import { Layout } from 'v2/features';
import {
  GetStartedPanel,
  DownloadAppPanel,
  CompatibleWalletsPanel,
  PeaceOfMindPanel,
  TestimonialsPanel,
  BottomActionPanel,
  FeaturesPanel
} from './components';
import { getFeaturedOS } from 'v2/features/helpers';
import { GithubService } from 'v2/services';
import { GITHUB_RELEASE_NOTES_URL as DEFAULT_LINK } from 'v2/features/constants';
import './Home.scss';

const OSNames: { [key: string]: string } = {
  [OS.WINDOWS]: 'Windows',
  [OS.MAC]: 'macOS',
  [OS.LINUX64]: 'Linux (64-bit)'
};

const featuredOS = getFeaturedOS();

export default class Home extends Component {
  public state = {
    appDownloadLink: DEFAULT_LINK,
    OSName: OSNames[featuredOS]
  };

  public componentDidMount = async () => {
    try {
      const releaseURLs = await GithubService.instance.getReleasesURLs();
      const currentPlatformURL = releaseURLs[featuredOS] || DEFAULT_LINK;
      this.setState({ appDownloadLink: currentPlatformURL });
    } catch (e) {
      console.error(e);
    }
  };

  public render() {
    return (
      <Layout className="WhiteBackground" fluid={true}>
        <section className="Home">
          <section className="LimitedWidth">
            <GetStartedPanel />
          </section>
          <section className="Home-compatibleWallets">
            <CompatibleWalletsPanel />
          </section>
          <section className="Home-featuresPanel">
            <FeaturesPanel />
          </section>
          <section className="Home-downloadApp">
            <DownloadAppPanel
              downloadLink={this.state.appDownloadLink}
              OSName={this.state.OSName}
            />
          </section>
          <section className="Home-peaceOfMind">
            <PeaceOfMindPanel downloadLink={this.state.appDownloadLink} />
          </section>
          <section className="Home-testimonials">
            <TestimonialsPanel />
          </section>
          <section className="Home-bottomAction">
            <BottomActionPanel />
          </section>
        </section>
      </Layout>
    );
  }
}
