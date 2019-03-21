import React, { Component } from 'react';
import styled from 'styled-components';

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
import { COLORS, GITHUB_RELEASE_NOTES_URL as DEFAULT_LINK } from 'v2/features/constants';

const { SILVER, DARK_SLATE_BLUE } = COLORS;

interface SectionProps {
  color?: string;
}

const HomeWrapper = styled.section`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
`;

const Section = styled.section`
  width: 100%;
  background-color: ${(props: SectionProps) => props.color};
  display: flex;
  justify-content: center;
`;

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
        <HomeWrapper>
          <Section>
            <GetStartedPanel />
          </Section>
          <Section color={SILVER}>
            <CompatibleWalletsPanel />
          </Section>
          <Section>
            <FeaturesPanel />
          </Section>
          <Section color={DARK_SLATE_BLUE}>
            <DownloadAppPanel
              downloadLink={this.state.appDownloadLink}
              OSName={this.state.OSName}
            />
          </Section>
          <Section>
            <PeaceOfMindPanel downloadLink={this.state.appDownloadLink} />
          </Section>
          <Section color={SILVER}>
            <TestimonialsPanel />
          </Section>
          <Section>
            <BottomActionPanel />
          </Section>
        </HomeWrapper>
      </Layout>
    );
  }
}
