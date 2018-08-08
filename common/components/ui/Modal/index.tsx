import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import ModalBody from './ModalBody';
import './index.scss';

export interface IButton {
  text: string | React.ReactElement<string>;
  type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'link';
  disabled?: boolean;
  onClick?(): void;
}
interface Props {
  className?: string;
  isOpen?: boolean;
  title?: React.ReactNode;
  disableButtons?: boolean;
  hideButtons?: boolean;
  children: React.ReactNode;
  buttons?: IButton[];
  maxWidth?: number;
  closeable?: boolean;
  handleClose(): void;
}
interface ModalStyle {
  width?: string;
  maxWidth?: string;
}

const Fade = ({ ...props }: any) => (
  <CSSTransition {...props} timeout={300} classNames="animate-modal" />
);

export default class Modal extends React.Component<Props> {
  public static defaultProps = {
    closeable: true
  };
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
      className,
      isOpen,
      title,
      children,
      buttons,
      disableButtons,
      hideButtons,
      handleClose,
      closeable,
      maxWidth
    } = this.props;
    const hasButtons = buttons && buttons.length;
    const modalStyle: ModalStyle = {};

    if (maxWidth) {
      modalStyle.width = '100%';
      modalStyle.maxWidth = `${maxWidth}px`;
    }

    const modalBodyProps = {
      className,
      title,
      children,
      modalStyle,
      hasButtons,
      buttons,
      disableButtons,
      hideButtons,
      handleClose,
      closeable
    };

    const modal = (
      <TransitionGroup>
        {isOpen && (
          // Trap focus in modal by focusing the first element after the animation is complete
          <Fade onEntered={() => this.modalBody.firstTabStop.focus()}>
            <div>
              <div className="Modal-overlay" onClick={closeable ? handleClose : () => []} />
              <ModalBody {...modalBodyProps} ref={div => (this.modalBody = div as ModalBody)} />
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
