import React from 'react';
import { Panel, Button } from '@mycrypto/ui';
import styled from 'styled-components';

import Modal from './Modal';
import { getLatestElectronRelease } from 'utils/versioning';
import { BREAK_POINTS } from 'v2/features/constants';

// Legacy
import closeIcon from 'common/assets/images/icn-close.svg';
import updateIcon from 'common/assets/images/icn-update.svg';

const { SCREEN_SM } = BREAK_POINTS;

const MainPanel = styled(Panel)`
  background-color: white;
  padding: 50px 90px;
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

interface State {
  isOpen: boolean;
  newRelease?: string;
}

export default class NewAppReleaseModal extends React.PureComponent<{}, State> {
  public state: State = {
    isOpen: false
  };

  public async componentDidMount() {
    try {
      const newRelease = await getLatestElectronRelease();
      if (newRelease) {
        this.setState({ isOpen: true, newRelease });
      }
    } catch (err) {
      console.error('Failed to fetch latest release from GitHub:', err);
    }
  }

  public render() {
    const { isOpen } = this.state;

    return (
      isOpen && (
        <Modal>
          <MainPanel>
            <CloseButton basic={true} onClick={this.onClose}>
              <img src={closeIcon} alt="Close" />
            </CloseButton>
            <UpdateImg src={updateIcon} />
            <Header>There’s a new & improved version of MyCrypto available!</Header>
            <Description>
              We know it’s annoying, but updating your app fixes bugs, enables fun features, and
              ensures your app is secure.
            </Description>
            <ActionsWrapper>
              <SecondaryActionButton secondary={true} onClick={this.onClose}>
                Not Right Now
              </SecondaryActionButton>
              <ActionButton onClick={this.openRelease}>Download MacOS v1.5.7 Now</ActionButton>
            </ActionsWrapper>
          </MainPanel>
        </Modal>
      )
    );
  }

  private onClose = () => {
    this.setState({ isOpen: false });
  };

  private openRelease() {
    window.open('https://github.com/MyCryptoHQ/MyCrypto/releases/latest');
  }
}
