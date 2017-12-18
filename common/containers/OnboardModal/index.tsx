import React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'reducers';
import Modal from 'components/ui/Modal';
import { startOnboardSession, TStartOnboardSession } from 'actions/onboardStatus';
import {
  WelcomeSlide,
  NotABankSlide,
  InterfaceSlide,
  BlockchainSlide,
  WhySlide,
  WhyMewSlide,
  SecureSlideOne,
  SecureSlideTwo,
  SecureSlideThree,
  FinalSlide
} from './components';

const ONBOARD_LOCAL_STORAGE_KEY = 'onboardStatus';

interface State {
  isOpen: boolean;
  showOnboardMsg: boolean;
  onboardStatus: number;
  currentSlide: number;
}

interface Props {
  sessionStarted: boolean;
  startOnboardSession: TStartOnboardSession;
}

class OnboardModal extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      showOnboardMsg: false,
      onboardStatus: Number(localStorage.getItem(ONBOARD_LOCAL_STORAGE_KEY)) || 0,
      currentSlide: 1
    };
  }

  public componentDidMount() {
    const { onboardStatus } = this.state;
    const { sessionStarted, startOnboardSession } = this.props;

    if (!sessionStarted) {
      startOnboardSession();
      if (onboardStatus === 0) {
        this.setState({
          isOpen: true
        });
        this.changeOnboardStatus(1);
      }
      if (onboardStatus > 0 && onboardStatus < 10) {
        this.setState({
          currentSlide: onboardStatus,
          showOnboardMsg: true,
          isOpen: true
        });
      }
    }
  }

  public render() {
    const { isOpen, showOnboardMsg } = this.state;
    return (
      <div>
        <Modal isOpen={isOpen} handleClose={this.closeModal}>
          {showOnboardMsg && this.renderOnboardMsg()}
          {this.renderSlide()}
        </Modal>
      </div>
    );
  }

  public closeModal = () => {
    this.setState({ isOpen: false });
  };

  public changeOnboardStatus = (slideNumber: number) => {
    localStorage.setItem(ONBOARD_LOCAL_STORAGE_KEY, String(slideNumber));
    this.setState({
      currentSlide: slideNumber
    });
  };

  private renderOnboardMsg = () => {
    return (
      <article className="onboarding__msg">
        {/* translate="ONBOARD_resume" */}
        It looks like you didn't finish reading through these slides last time. ProTip: Finish
        reading through the slides 😉
      </article>
    );
  };

  private renderSlide = () => {
    const slides = [
      <WelcomeSlide setOnboardStatus={this.changeOnboardStatus} />,
      <NotABankSlide setOnboardStatus={this.changeOnboardStatus} />,
      <InterfaceSlide setOnboardStatus={this.changeOnboardStatus} />,
      <BlockchainSlide setOnboardStatus={this.changeOnboardStatus} />,
      <WhySlide setOnboardStatus={this.changeOnboardStatus} />,
      <WhyMewSlide setOnboardStatus={this.changeOnboardStatus} />,
      <SecureSlideOne setOnboardStatus={this.changeOnboardStatus} />,
      <SecureSlideTwo setOnboardStatus={this.changeOnboardStatus} />,
      <SecureSlideThree setOnboardStatus={this.changeOnboardStatus} />,
      <FinalSlide closeModal={this.closeModal} />
    ];
    const currentSlideIndex = this.state.currentSlide - 1;

    return slides[currentSlideIndex];
  };
}

function mapStateToProps(state: AppState) {
  return {
    sessionStarted: state.onboardStatus.sessionStarted
  };
}

export default connect(mapStateToProps, {
  startOnboardSession
})(OnboardModal);
