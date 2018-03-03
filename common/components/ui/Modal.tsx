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
  handleClose(): void;
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
  private modal: HTMLElement;
  private modalContent: HTMLElement | null = null;
  private focusedElementBeforeModal: HTMLElement;
  private focusableElementsString: string;
  private focusableElements: HTMLElement[];
  private firstTabStop: HTMLElement;
  private lastTabStop: HTMLElement;

  public componentDidMount() {
    this.toggleScroll();
    this.focusedElementBeforeModal = document.activeElement as HTMLElement;
  }

  public componentDidUpdate() {
    console.log('Component did update');
    this.toggleScroll();
    if (this.props.isOpen) {
      // Find all focusable children
      this.focusableElementsString =
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
      this.focusableElements = Array.prototype.slice.call(
        this.modal.querySelectorAll(this.focusableElementsString)
      );

      // Convert NodeList to Array
      this.firstTabStop = this.focusableElements[0];
      this.lastTabStop = this.focusableElements[this.focusableElements.length - 1];

      // Focus first child
      this.firstTabStop.focus();

      this.modal.addEventListener('keydown', this.keyDownListener);
    }
  }

  public toggleScroll() {
    document.body.classList.toggle('no-scroll', !!this.props.isOpen);
  }

  public componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDownListener);
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
              <div className="Modal-overlay" onClick={handleClose} />
              <div
                className="Modal"
                style={modalStyle}
                role="dialog"
                aria-labelledby="Modal-header-title"
                tabIndex={1}
                ref={div => {
                  this.modal = div as HTMLElement;
                }}
              >
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

  private keyDownListener = (e: KeyboardEvent) => {
    // Check for TAB key press
    if (e.keyCode === 9) {
      // SHIFT + TAB
      if (e.shiftKey) {
        if (document.activeElement === this.firstTabStop) {
          e.preventDefault();
          this.lastTabStop.focus();
        }

        // TAB
      } else {
        if (document.activeElement === this.lastTabStop) {
          e.preventDefault();
          this.firstTabStop.focus();
        }
      }
    }

    // Check for ESC key press
    if (e.keyCode === 27) {
      this.focusedElementBeforeModal.focus();
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
