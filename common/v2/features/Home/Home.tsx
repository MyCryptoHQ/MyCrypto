import React, { Component } from 'react';
import styled from 'styled-components';

import {
  GetStartedPanel,
  DownloadAppPanel,
  CompatibleWalletsPanel,
  PeaceOfMindPanel,
  TestimonialsPanel,
  BottomActionPanel,
  FeaturesPanel,
  KeepYourAssetsSafePanel
} from './components';
import { getFeaturedOS } from 'v2/utils';
import { GithubService } from 'v2/services/ApiService';
import { COLORS } from 'v2/theme';
import { GITHUB_RELEASE_NOTES_URL as DEFAULT_LINK, OS } from 'v2/config';

const { SILVER, DARK_SLATE_BLUE, WHITE } = COLORS;

interface SectionProps {
  color?: string;
}

const HomeWrapper = styled.section`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;

const Section = styled.section`
  width: 100%;
  background-color: ${(props: SectionProps) => props.color};
  display: flex;
  justify-content: center;
`;

const BottomSection = styled(Section)``;

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
      const { releaseUrls } = await GithubService.instance.getReleasesInfo();
      const currentPlatformURL = releaseUrls[featuredOS] || DEFAULT_LINK;
      this.setState({ appDownloadLink: currentPlatformURL });
    } catch (e) {
      console.error(e);
    }
  };

  public render() {
    return (
      <HomeWrapper>
        <Section>
          <GetStartedPanel />
        </Section>
        <Section color={SILVER}>
          <CompatibleWalletsPanel />
        </Section>
        <Section color={WHITE}>
          <FeaturesPanel />
        </Section>
        <Section color={DARK_SLATE_BLUE}>
          <DownloadAppPanel downloadLink={this.state.appDownloadLink} OSName={this.state.OSName} />
        </Section>
        <Section color={SILVER}>
          <KeepYourAssetsSafePanel />
        </Section>
        <Section color={WHITE}>
          <PeaceOfMindPanel downloadLink={this.state.appDownloadLink} />
        </Section>
        <Section color={SILVER}>
          <TestimonialsPanel />
        </Section>
        <BottomSection>
          <BottomActionPanel />
        </BottomSection>
      </HomeWrapper>
    );
  }
}
