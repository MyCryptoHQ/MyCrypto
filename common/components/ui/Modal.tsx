import closeIcon from 'assets/images/close.svg';
import React, { PureComponent } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './Modal.scss';

export interface IButton {
  text: string | React.ReactElement<string>;
  type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'link';
  disabled?: boolean;
  onClick?(): void;
}
interface Props {
  isOpen?: boolean;
  title?: string | React.ReactElement<any>;
  disableButtons?: boolean;
  children: any;
  buttons?: IButton[];
  maxWidth?: number;
  handleClose?(): void;
}
interface ModalStyle {
  width?: string;
  maxWidth?: string;
}

const Fade = ({ children, ...props }) => (
  <CSSTransition {...props} timeout={300} classNames="animate-modal">
    {children}
  </CSSTransition>
);

export default class Modal extends PureComponent<Props, {}> {
  private modalContent: HTMLElement | null = null;

  public componentDidMount() {
    this.updateBodyClass();
    document.addEventListener('keydown', this.escapeListner);
  }

  public componentDidUpdate() {
    this.updateBodyClass();
  }

  public updateBodyClass() {
    document.body.classList.toggle('no-scroll', !!this.props.isOpen);
  }

  public componentWillUnmount() {
    document.removeEventListener('keydown', this.escapeListner);
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

    return (
      <TransitionGroup>
        {isOpen && (
          <Fade>
            <div>
              <div className="Modalshade" />
              <div className="Modal" style={modalStyle}>
                {title && (
                  <div className="Modal-header flex-wrapper">
                    <h2 className="Modal-header-title">{title}</h2>
                    <div className="flex-spacer" />
                    <button className="Modal-header-close" onClick={handleClose}>
                      <img className="Modal-header-close-icon" src={closeIcon} />
                    </button>
                  </div>
                )}

                <div className="Modal-content" ref={el => (this.modalContent = el)}>
                  {isOpen && children}
                  <div className="Modal-fade" />
                </div>
                {hasButtons && <div className="Modal-footer">{this.renderButtons()}</div>}
              </div>
            </div>
          </Fade>
        )}
      </TransitionGroup>
    );
  }

  public scrollContentToTop = () => {
    if (this.modalContent) {
      this.modalContent.scrollTop = 0;
    }
  };

  private escapeListner = (ev: KeyboardEvent) => {
    // Don't trigger if they hit escape while on an input
    if (ev.target) {
      if (
        (ev.target as HTMLElement).tagName === 'INPUT' ||
        (ev.target as HTMLElement).tagName === 'SELECT' ||
        (ev.target as HTMLElement).tagName === 'TEXTAREA' ||
        (ev.target as HTMLElement).isContentEditable
      ) {
        return;
      }
    }

    if (ev.key === 'Escape' || ev.keyCode === 27) {
      if (!this.props.handleClose) {
        return;
      }
      this.props.handleClose();
    }
  };

  private renderButtons = () => {
    const { disableButtons, buttons } = this.props;
    if (!buttons || !buttons.length) {
      return;
    }

    return buttons.map((btn, idx) => {
      let btnClass = 'Modal-footer-btn btn';

      if (btn.type) {
        btnClass += ` btn-${btn.type}`;
      }

      return (
        <button
          className={btnClass}
          onClick={btn.onClick}
          key={idx}
          disabled={disableButtons || btn.disabled}
        >
          {btn.text}
        </button>
      );
    });
  };
}
