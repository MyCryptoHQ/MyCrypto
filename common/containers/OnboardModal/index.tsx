import React from 'react';
import { connect } from 'react-redux';
import translate from 'translations';
import Stepper from 'react-stepper-horizontal';
import { showNotification, TShowNotification } from 'actions/notifications';
import { AppState } from 'reducers';
import Modal, { IButton } from 'components/ui/Modal';
import './index.scss';
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
const NUMBER_OF_SLIDES = 10;

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
  showNotification: TShowNotification;
}

class OnboardModal extends React.Component<Props, State> {
  private modal: Modal | null = null;

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
      if (currentSlide > 0 && currentSlide < NUMBER_OF_SLIDES) {
        this.props.resumeSlide(currentSlide);
        this.setState({
          isOpen: true
        });

        const onboardResumeMessage = translate('ONBOARD_resume');

        // Wait a sec so it doesn't get lost in the page-load
        setTimeout(() => {
          this.props.showNotification('info', onboardResumeMessage, 6000);
        }, 1200);
      }
    }
  }

  public render() {
    const { isOpen } = this.state;
    const { slideNumber } = this.props;

    const firstButtons: IButton[] = [
      {
        disabled: slideNumber === NUMBER_OF_SLIDES,
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
    const lastButtons: IButton[] = [
      {
        text: 'Finish',
        type: 'primary',
        onClick: this.closeModal
      },
      {
        text: 'Back',
        type: 'default',
        onClick: this.handlePreviousSlide
      }
    ];

    const buttons = slideNumber === NUMBER_OF_SLIDES ? lastButtons : firstButtons;
    const steps = new Array(NUMBER_OF_SLIDES).fill({});

    return (
      <div className="OnboardModal">
        <Modal isOpen={isOpen} buttons={buttons} ref={el => (this.modal = el)}>
          <div className="OnboardModal-stepper">
            <Stepper
              steps={steps}
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

    if (slides.length !== NUMBER_OF_SLIDES) {
      console.log('Slides length do not match const NUMBER_OF_SLIDES');
    }
    const currentSlideIndex = this.props.slideNumber - 1;

    return slides[currentSlideIndex];
  };

  private handlePreviousSlide = () => {
    const prevSlideNum = this.props.slideNumber - 1;
    localStorage.setItem(ONBOARD_LOCAL_STORAGE_KEY, String(prevSlideNum));
    this.props.decrementSlide();
    if (this.modal) {
      this.modal.scrollContentToTop();
    }
  };

  private handleNextSlide = () => {
    const nextSlideNum = this.props.slideNumber + 1;
    localStorage.setItem(ONBOARD_LOCAL_STORAGE_KEY, String(nextSlideNum));
    this.props.incrementSlide();
    if (this.modal) {
      this.modal.scrollContentToTop();
    }
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
  incrementSlide,
  showNotification
})(OnboardModal);
