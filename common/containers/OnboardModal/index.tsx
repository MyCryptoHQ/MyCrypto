import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'features/reducers';
import Modal from 'components/ui/Modal';
import { Stepper, Slide1 } from './components';
import { toggleOnboardModal, TToggleOnbardModal } from 'features/onboardStatus/actions';
import './index.scss';

interface StateProps {
  open: boolean;
  toggleOnboardModal: TToggleOnbardModal;
}

interface State {
  slide: number;
}

class OnboardModal extends React.Component<StateProps, State> {
  public state = {
    slide: 0
  };

  public slideProps = {
    stepper: <Stepper length={4} index={this.state.slide} />,
    increment: () => this.setState({ slide: this.state.slide + 1 })
  };

  // TODO: last slide takes `onComplete` prop which toggles the modal
  public slides = [
    <Slide1 {...this.slideProps} key={0} />,
    <Slide1 {...this.slideProps} key={1} />,
    <Slide1 {...this.slideProps} key={2} />,
    <Slide1 {...this.slideProps} key={3} />
  ];

  private modal: Modal | null = null;

  public toggleModal = () => {
    this.props.toggleOnboardModal();
  };

  public render() {
    const { slides } = this;
    const { open } = this.props;
    const { slide } = this.state;

    return (
      <Modal
        className="OnboardModal"
        isOpen={open}
        closeable={false}
        maxWidth={1024}
        handleClose={this.toggleModal}
      >
        {slides[slide]}
      </Modal>
    );
  }

  private nextSlide = () => {
    const { slide } = this.state;
    if (this.modal) {
      this.modal.modalBody.scrollContentToTop();
    }
  };
}

function mapStateToProps(state: AppState) {
  return {
    open: state.onboardStatus.open
  };
}

export default connect(mapStateToProps, { toggleOnboardModal })(OnboardModal);
