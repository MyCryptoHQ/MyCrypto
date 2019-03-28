import React from 'react';
import { Panel, Button, Icon } from '@mycrypto/ui';
import styled from 'styled-components';
import semver from 'semver';

import Modal from './Modal';
import { BREAK_POINTS, GITHUB_RELEASE_NOTES_URL, COLORS } from 'v2/features/constants';
import { getFeaturedOS } from 'v2/features/helpers';
import { GithubService, AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { VERSION as currentVersion } from 'config';
import { OS } from 'v2/services/Github';
import translate from 'translations';

// Legacy
import closeIcon from 'common/assets/images/icn-close.svg';
import updateIcon from 'common/assets/images/icn-update.svg';
import updateImportantIcon from 'common/assets/images/icn-important-update.svg';

const { SCREEN_SM } = BREAK_POINTS;
const { PASTEL_RED } = COLORS;

const MainPanel = styled(Panel)`
  background-color: white;
  padding: 50px 65px;
  max-width: 770px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  max-height: 90%;
  overflow: auto;

  @media (max-width: ${SCREEN_SM}) {
    padding: 40px 20px;
    width: 90%;
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  right: 17px;
  top: 9px;

  img {
    width: 14px;
    height: 14px;
  }
`;

const UpdateImg = styled.img`
  width: 60px;
  height: 60px;
  margin-bottom: 15px;
`;

const Header = styled.p`
  font-size: 32px;
  font-weight: bold;
  line-height: normal;
  margin-top: 0;
  margin-bottom: 15px;
  color: ${props => props.theme.headline};
`;

interface DescriptionProps {
  warning?: boolean;
  noMargin?: boolean;
}

const Description = styled.p`
  font-size: 18px;
  font-weight: normal;
  line-height: 27px;
  padding: ${(props: DescriptionProps) => (props.warning ? '0 30px 20px 30px' : '0 30px')};
  color: ${props => (props.warning ? PASTEL_RED : props.theme.text)};
  ${(props: DescriptionProps) => props.noMargin && 'margin: 0;'};
`;

interface ActionsWrapperProps {
  marginTop?: string;
}

const ActionsWrapper = styled.div`
  margin-top: ${(props: ActionsWrapperProps) => (props.marginTop ? props.marginTop : '54px')};
  display: flex;
  flex-direction: row;
  justify-content: center;

  @media (max-width: ${SCREEN_SM}) {
    flex-direction: column;
  }
`;

const ActionButton = styled(Button)`
  font-size: 18px;
  font-weight: normal;
  margin-bottom: 15px;
`;

const SecondaryActionButton = styled(ActionButton)`
  margin-right: 50px;

  @media (max-width: ${SCREEN_SM}) {
    margin-right: 0px;
  }
`;

const ReleaseLink = styled.a`
  word-break: break-all;
`;

const WarningIcon = styled(Icon)`
  margin-right: 5px;
  vertical-align: middle;

  svg {
    color: ${PASTEL_RED};
  }
`;

const OSNames: { [key: string]: string } = {
  [OS.WINDOWS]: 'Windows',
  [OS.MAC]: 'macOS',
  [OS.LINUX64]: 'Linux'
};

const featuredOS = getFeaturedOS();

interface State {
  isOpen: boolean;
  OSName: string;
  newVersion?: string;
  newVersionUrl?: string;
  isCritical?: boolean;
}

export default class NewAppReleaseModal extends React.PureComponent<{}, State> {
  public state: State = {
    isOpen: false,
    OSName: OSNames[featuredOS]
  };

  public async componentDidMount() {
    try {
      const releasesInfo = await GithubService.instance.getReleasesInfo();
      const { version: newVersion, name, releaseUrls } = releasesInfo;

      const isCritical = name.includes('[Critical]');
      const newVersionUrl = releaseUrls[featuredOS];
      if (semver.lt(currentVersion, newVersion)) {
        this.setState({
          isOpen: true,
          newVersion,
          newVersionUrl,
          isCritical
        });
      }
    } catch (err) {
      console.error('Failed to fetch latest release from GitHub:', err);
    }
  }

  public render() {
    const { isOpen, isCritical } = this.state;

    return (
      isOpen && (
        <Modal>
          <MainPanel>{isCritical ? this.getCriticalModal() : this.getNonCriticalModal()}</MainPanel>
        </Modal>
      )
    );
  }

  private getNonCriticalModal = () => {
    const { OSName, newVersion } = this.state;

    return (
      <>
        <CloseButton basic={true} onClick={this.onClose}>
          <img src={closeIcon} alt="Close" />
        </CloseButton>
        <UpdateImg src={updateIcon} />
        <Header>{translate('APP_UPDATE_TITLE')}</Header>
        <Description>{translate('APP_UPDATE_BODY')}</Description>
        <ActionsWrapper>
          <SecondaryActionButton secondary={true} onClick={this.onClose}>
            {translate('APP_UPDATE_CANCEL')}
          </SecondaryActionButton>
          <ActionButton onClick={this.downloadRelease}>
            {translate('APP_UPDATE_CONFIRM', { $osName: OSName, $appVersion: `v${newVersion}` })}
          </ActionButton>
        </ActionsWrapper>
      </>
    );
  };

  private getCriticalModal = () => {
    const { OSName, newVersion } = this.state;

    return (
      <>
        <UpdateImg src={updateImportantIcon} />
        <Header>{translate('APP_UPDATE_TITLE_CRITICAL')}</Header>
        <Description warning={true}>
          <WarningIcon icon="warning" /> {translate('APP_UPDATE_WARNING')}
        </Description>
        <Description noMargin={true}>{translate('APP_UPDATE_BODY_CRITICAL')}</Description>
        <ReleaseLink href={GITHUB_RELEASE_NOTES_URL} target="_blank" rel="noreferrer">
          {GITHUB_RELEASE_NOTES_URL}.
        </ReleaseLink>
        <ActionsWrapper marginTop="41px">
          <ActionButton onClick={this.downloadRelease}>
            {translate('APP_UPDATE_CONFIRM', { $osName: OSName, $appVersion: `v${newVersion}` })}
          </ActionButton>
        </ActionsWrapper>
      </>
    );
  };

  private onClose = () => {
    const { OSName, newVersion } = this.state;
    this.setState({ isOpen: false });
    AnalyticsService.instance.track(
      ANALYTICS_CATEGORIES.UPDATE_DESKTOP,
      'Not Right Now button clicked',
      { current_version: currentVersion, new_version: newVersion, os: OSName }
    );
  };

  private downloadRelease = () => {
    const { OSName, newVersion, newVersionUrl } = this.state;
    window.open(newVersionUrl, '_self');
    AnalyticsService.instance.track(
      ANALYTICS_CATEGORIES.UPDATE_DESKTOP,
      'Get New Version button clicked',
      { current_version: currentVersion, new_version: newVersion, os: OSName }
    );
  };
}
