import React, { PureComponent } from 'react';

import { createPortal } from 'react-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import ModalBody from './ModalBody';
import { IButton } from './types';
import './index.scss';

interface Props {
  isOpen?: boolean;
  title?: React.ReactNode;
  disableButtons?: boolean;
  hideButtons?: boolean;
  children: React.ReactNode;
  buttons?: IButton[];
  maxWidth?: number;
  handleClose(): void;
}
interface ModalStyle {
  width?: string;
  maxWidth?: string;
}

const Fade = ({ ...props }: any) => (
  <CSSTransition {...props} timeout={300} classNames="animate-modal" />
);

export class Modal extends PureComponent<Props, never> {
  public modalParent: HTMLElement;
  public modalBody: ModalBody;

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.isOpen !== this.props.isOpen) {
      document.body.classList.toggle('no-scroll', !!this.props.isOpen);
    }
  }

  public componentDidMount() {
    const modalEl = document.getElementById('ModalContainer');
    if (modalEl) {
      this.modalParent = document.createElement('div');
      modalEl.appendChild(this.modalParent);
    }
  }

  public componentWillUnmount() {
    document.body.classList.remove('no-scroll');
    const modalEl = document.getElementById('ModalContainer');
    if (modalEl) {
      modalEl.removeChild(this.modalParent);
    }
  }

  public render() {
    const {
      isOpen,
      title,
      children,
      buttons,
      disableButtons,
      hideButtons,
      handleClose,
      maxWidth
    } = this.props;
    const hasButtons = buttons && buttons.length;
    const modalStyle: ModalStyle = {};

    if (maxWidth) {
      modalStyle.width = '100%';
      modalStyle.maxWidth = `${maxWidth}px`;
    }

    const modalBodyProps = {
      title,
      children,
      modalStyle,
      hasButtons,
      buttons,
      disableButtons,
      hideButtons,
      handleClose
    };

    const modal = (
      <TransitionGroup>
        {isOpen && (
          // Trap focus in modal by focusing the first element after the animation is complete
          <Fade onEntered={() => this.modalBody.firstTabStop.focus()}>
            <div>
              <div className="Modal-overlay" onClick={handleClose} />
              <ModalBody {...modalBodyProps} ref={(div) => (this.modalBody = div as ModalBody)} />
            </div>
          </Fade>
        )}
      </TransitionGroup>
    );

    if (this.modalParent) {
      return createPortal(modal, this.modalParent);
    } else {
      return modal;
    }
  }
}

export default Modal;
