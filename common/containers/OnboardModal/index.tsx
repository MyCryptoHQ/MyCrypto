import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'features/reducers';
import Modal from 'components/ui/Modal';
import { Stepper, Slide1, Slide2, Slide3, Slide4 } from './components';
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

  private modal: Modal | null = null;

  public toggleModal = () => {
    this.props.toggleOnboardModal();
  };

  public selectSlide = (index: number) => {
    this.setState({ slide: index });
  };

  public render() {
    const { selectSlide } = this;
    const { open } = this.props;
    const { slide } = this.state;

    const slideProps = {
      stepper: <Stepper length={4} index={this.state.slide} select={selectSlide} />,
      increment: () => {
        this.setState({ slide: this.state.slide + 1 });
      },
      select: (index: number) => {
        this.setState({ slide: index });
      }
    };

    // TODO: last slide takes `onComplete` prop which toggles the modal
    const slides = [
      <Slide1 {...slideProps} key={0} />,
      <Slide2 {...slideProps} key={1} />,
      <Slide3 {...slideProps} key={2} />,
      <Slide4 {...slideProps} onComplete={this.toggleModal} key={3} />
    ];

    return (
      <Modal
        className="OnboardModal"
        isOpen={open}
        closeable={false}
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
