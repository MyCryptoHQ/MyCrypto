import React, { PureComponent } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ModalBody from './ModalBody';
import './index.scss';

export interface IButton {
  text: string | React.ReactElement<string>;
  type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'link';
  disabled?: boolean;
  onClick?(): void;
}
interface Props {
  isOpen?: boolean;
  title?: string;
  disableButtons?: boolean;
  children: any;
  buttons?: IButton[];
  maxWidth?: number;
  handleClose(): void;
}
interface ModalStyle {
  width?: string;
  maxWidth?: string;
}

const Fade = ({ children, ...props }: any) => (
  <CSSTransition {...props} timeout={300} classNames="animate-modal">
    {children}
  </CSSTransition>
);

export default class Modal extends PureComponent<Props, {}> {
  public modalBody: ModalBody;

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.isOpen !== this.props.isOpen) {
      document.body.classList.toggle('no-scroll', !!this.props.isOpen);
    }
  }

  public componentWillUnmount() {
    document.body.classList.remove('no-scroll');
  }

  public render() {
    const { isOpen, title, children, buttons, handleClose, maxWidth } = this.props;
    const hasButtons = buttons && buttons.length;
    const modalStyle: ModalStyle = {};

    if (maxWidth) {
      modalStyle.width = '100%';
      modalStyle.maxWidth = `${maxWidth}px`;
    }

    const modalBodyProps = { title, children, modalStyle, hasButtons, buttons, handleClose };

    return (
      <TransitionGroup>
        {isOpen && (
          <Fade>
            <div>
              <div className="Modal-overlay" onClick={handleClose} />
              <ModalBody {...modalBodyProps} ref={div => (this.modalBody = div as ModalBody)} />
            </div>
          </Fade>
        )}
      </TransitionGroup>
    );
  }
}
