import React from 'react';
import { Panel, Button } from '@mycrypto/ui';
import styled from 'styled-components';
import semver from 'semver';

import Modal from './Modal';
import { BREAK_POINTS } from 'v2/features/constants';
import { getFeaturedOS } from 'v2/features/helpers';
import { GithubService } from 'v2/services';
import { VERSION as currentVersion } from 'config';
import { OS } from 'v2/services/Github';
import translate from 'translations';

// Legacy
import closeIcon from 'common/assets/images/icn-close.svg';
import updateIcon from 'common/assets/images/icn-update.svg';

const { SCREEN_SM } = BREAK_POINTS;

const MainPanel = styled(Panel)`
  background-color: white;
  padding: 50px 65px;
  max-width: 750px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;

  @media (max-width: ${SCREEN_SM}) {
    padding: 40px 20px;
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

const Description = styled.p`
  font-size: 18px;
  font-weight: normal;
  line-height: 1.5;
  padding: 0 30px 0 30px;
  color: ${props => props.theme.text};
`;

const ActionsWrapper = styled.div`
  margin-top: 54px;
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

const OSNames: { [key: string]: string } = {
  [OS.WINDOWS]: 'Windows',
  [OS.MAC]: 'macOS',
  [OS.LINUX64]: 'Linux'
};

const featuredOS = getFeaturedOS();

interface State {
  isOpen: boolean;
  OSName: string;
  nextVersion: string;
  nextVersionUrl?: string;
}

export default class NewAppReleaseModal extends React.PureComponent<{}, State> {
  public state: State = {
    isOpen: false,
    OSName: OSNames[featuredOS],
    nextVersion: 'v'
  };

  public async componentDidMount() {
    try {
      const releasesWithVersion = await GithubService.instance.getReleasesURLs();
      const { version: nextVersion } = releasesWithVersion;
      const nextVersionUrl = releasesWithVersion[featuredOS];
      if (semver.lt(currentVersion, nextVersion)) {
        this.setState({
          isOpen: true,
          nextVersion: `v${releasesWithVersion.version}`,
          nextVersionUrl
        });
      }
    } catch (err) {
      console.error('Failed to fetch latest release from GitHub:', err);
    }
  }

  public render() {
    const { isOpen, OSName, nextVersion } = this.state;

    return (
      isOpen && (
        <Modal>
          <MainPanel>
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
                {translate('APP_UPDATE_CONFIRM', { $osName: OSName, $appVersion: nextVersion })}
              </ActionButton>
            </ActionsWrapper>
          </MainPanel>
        </Modal>
      )
    );
  }

  private onClose = () => {
    this.setState({ isOpen: false });
  };

  private downloadRelease = () => {
    window.open(this.state.nextVersionUrl, '_self');
  };
}
