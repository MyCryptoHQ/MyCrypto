import React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'reducers';
import Modal, { IButton } from 'components/ui/Modal';
import Stepper from 'react-stepper-horizontal';
import {
  startOnboardSession,
  TStartOnboardSession,
  decrementSlide,
  TDecrementSlide,
  incrementSlide,
  TIncrementSlide,
  resumeSlide,
  TResumeSlide
} from 'actions/onboardStatus';
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
}

interface Props {
  sessionStarted: boolean;
  slideNumber: number;
  startOnboardSession: TStartOnboardSession;
  resumeSlide: TResumeSlide;
  decrementSlide: TDecrementSlide;
  incrementSlide: TIncrementSlide;
}

class OnboardModal extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  public componentDidMount() {
    const { sessionStarted } = this.props;

    const currentSlide = Number(localStorage.getItem(ONBOARD_LOCAL_STORAGE_KEY)) || 0;

    if (!sessionStarted) {
      this.props.startOnboardSession();
      if (currentSlide === 0) {
        this.setState({
          isOpen: true
        });
      }
      if (currentSlide > 0 && currentSlide < 10) {
        this.props.resumeSlide(currentSlide);
        this.setState({
          isOpen: true
        });

        // notify message
      }
    }
  }

  public render() {
    const { isOpen } = this.state;
    const { slideNumber } = this.props;
    const buttons: IButton[] = [
      {
        text: 'Next',
        type: 'primary',
        onClick: this.handleNextSlide
      },
      {
        disabled: slideNumber === 1,
        text: 'Back',
        type: 'default',
        onClick: this.handlePreviousSlide
      }
    ];

    return (
      <div className="OnboardModal">
        <Modal isOpen={isOpen} handleClose={this.closeModal} buttons={buttons}>
          {/* {showOnboardMsg && this.renderOnboardMsg()} */}
          <div className="OnboardModal-stepper">
            <Stepper
              steps={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]}
              activeColor="#0e97c0"
              activeStep={slideNumber - 1}
              completeColor="#0e97c0"
              circleTop={1}
            />
          </div>
          <div className="OnboardModal-onboardSlide">{this.renderSlide()}</div>
        </Modal>
      </div>
    );
  }

  public closeModal = () => {
    this.setState({ isOpen: false });
  };

  public changeOnboardStatus = (slideNumber: number) => {
    localStorage.setItem(ONBOARD_LOCAL_STORAGE_KEY, String(slideNumber));
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
      <WelcomeSlide key={1} />,
      <NotABankSlide key={2} />,
      <InterfaceSlide key={3} />,
      <BlockchainSlide key={4} />,
      <WhySlide key={5} />,
      <WhyMewSlide key={6} />,
      <SecureSlideOne key={7} />,
      <SecureSlideTwo key={8} />,
      <SecureSlideThree key={9} />,
      <FinalSlide key={10} closeModal={this.closeModal} />
    ];
    const currentSlideIndex = this.props.slideNumber - 1;

    return slides[currentSlideIndex];
  };

  private handlePreviousSlide = () => {
    const prevSlideNum = this.props.slideNumber - 1;

    localStorage.setItem(ONBOARD_LOCAL_STORAGE_KEY, String(prevSlideNum));
    this.props.decrementSlide();
  };

  private handleNextSlide = () => {
    const nextSlideNum = this.props.slideNumber + 1;

    localStorage.setItem(ONBOARD_LOCAL_STORAGE_KEY, String(nextSlideNum));
    this.props.incrementSlide();
  };
}

function mapStateToProps(state: AppState) {
  return {
    sessionStarted: state.onboardStatus.sessionStarted,
    slideNumber: state.onboardStatus.slideNumber
  };
}

export default connect(mapStateToProps, {
  startOnboardSession,
  resumeSlide,
  decrementSlide,
  incrementSlide
})(OnboardModal);
