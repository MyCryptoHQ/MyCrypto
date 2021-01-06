import React, { FC, useCallback, useEffect, useState } from 'react';

import { Button, Icon, Panel, Typography } from '@mycrypto/ui';
import semver from 'semver';
import styled from 'styled-components';

import closeIcon from '@assets/images/icn-close.svg';
import updateImportantIcon from '@assets/images/icn-important-update.svg';
import updateIcon from '@assets/images/icn-update.svg';
import { VERSION as currentVersion, GITHUB_RELEASE_NOTES_URL, OS } from '@config';
import { GithubService } from '@services/ApiService';
import { BREAK_POINTS, COLORS } from '@theme';
import translate from '@translations';
import { TURL } from '@types';
import { getFeaturedOS, openLink } from '@utils';

import Modal from './Modal';

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

const Header = styled(Typography)`
  font-size: 32px;
  font-weight: bold;
  line-height: normal;
  margin-top: 0;
  margin-bottom: 15px;
  color: ${(props) => props.theme.headline};
`;

interface DescriptionProps {
  warning?: boolean;
  noMargin?: boolean;
}

// prettier-ignore
const Description = styled(Typography)<DescriptionProps>`
  margin-top: 5px;
  font-weight: normal;
  padding: ${props => (props.warning ? '0 30px 20px 30px' : '0 30px')};
  color: ${props => (props.warning ? PASTEL_RED : props.theme.text)};
  ${props => props.noMargin && 'margin: 0;'};
`;

interface ActionsWrapperProps {
  marginTop?: string;
}

// prettier-ignore
const ActionsWrapper = styled.div<ActionsWrapperProps>`
  margin-top: ${props => (props.marginTop ? props.marginTop : '54px')};
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

const ReleaseLink = styled(Typography)`
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

interface Props {
  isOpen?: boolean;
  OSName?: string;
  newVersion?: string;
  newVersionUrl?: string;
  isCritical?: boolean;
}

const NewAppReleaseModal: FC<Props> = (props) => {
  const [state, setState] = useState<Props>({
    isOpen: props.isOpen || false,
    OSName: props.OSName || OSNames[featuredOS],
    newVersion: props.newVersion || '',
    newVersionUrl: props.newVersionUrl || '',
    isCritical: props.isCritical || false
  });

  useEffect(() => {
    (async () => {
      try {
        const releasesInfo = await GithubService.instance.getReleasesInfo();
        const { version: newVersion, name, releaseUrls } = releasesInfo;

        const isCritical = name.toLowerCase().includes('[critical]');
        const newVersionUrl = releaseUrls[featuredOS];
        if (semver.lt(currentVersion, newVersion)) {
          setState((prevState) => ({
            ...prevState,
            isOpen: true,
            newVersion,
            newVersionUrl,
            isCritical
          }));
        }
      } catch (err) {
        console.error('Failed to fetch latest release from GitHub:', err);
      }
    })();
  }, [setState]);

  const onClose = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isOpen: false
    }));
  }, [state]);

  const downloadRelease = useCallback(() => {
    openLink(state.newVersionUrl as TURL, '_self');
  }, [state]);

  const getNonCriticalModal = useCallback(() => {
    return (
      <>
        <CloseButton basic={true} onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </CloseButton>
        <UpdateImg src={updateIcon} />
        <Header as="h2">{translate('APP_UPDATE_TITLE')}</Header>
        <Description>{translate('APP_UPDATE_BODY')}</Description>
        <ActionsWrapper>
          <SecondaryActionButton secondary={true} onClick={onClose}>
            {translate('APP_UPDATE_CANCEL')}
          </SecondaryActionButton>
          <ActionButton onClick={downloadRelease}>
            {translate('APP_UPDATE_CONFIRM', {
              $osName: state.OSName,
              $appVersion: `v${state.newVersion}`
            })}
          </ActionButton>
        </ActionsWrapper>
      </>
    );
  }, [state, onClose, downloadRelease]);

  const getCriticalModal = useCallback(() => {
    return (
      <>
        <UpdateImg src={updateImportantIcon} />
        <Header as="h2">{translate('APP_UPDATE_TITLE_CRITICAL')}</Header>
        <Description warning={true}>
          <WarningIcon icon="warning" /> {translate('APP_UPDATE_WARNING')}
        </Description>
        <Description noMargin={true}>{translate('APP_UPDATE_BODY_CRITICAL')}</Description>
        <ReleaseLink>
          <a href={GITHUB_RELEASE_NOTES_URL} target="_blank" rel="noreferrer">
            {GITHUB_RELEASE_NOTES_URL}.
          </a>
        </ReleaseLink>
        <ActionsWrapper marginTop="41px">
          <ActionButton onClick={downloadRelease}>
            {translate('APP_UPDATE_CONFIRM', {
              $osName: state.OSName,
              $appVersion: `v${state.newVersion}`
            })}
          </ActionButton>
        </ActionsWrapper>
      </>
    );
  }, [state, downloadRelease]);

  return state.isOpen ? (
    <Modal>
      <MainPanel>{state.isCritical ? getCriticalModal() : getNonCriticalModal()}</MainPanel>
    </Modal>
  ) : (
    <></>
  );
};

export default NewAppReleaseModal;
