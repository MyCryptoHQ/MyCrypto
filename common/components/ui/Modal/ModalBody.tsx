import React, { CSSProperties } from 'react';
import closeIcon from 'assets/images/close.svg';
import { IButton } from 'components/ui/Modal';

interface Props {
  title?: string;
  children: any;
  modalStyle?: CSSProperties;
  hasButtons?: number;
  buttons?: IButton[];
  disableButtons?: any;
  handleClose(): void;
}

export default class ModalBody extends React.Component<Props> {
  public firstTabStop: HTMLElement;
  private modal: HTMLElement;
  private modalContent: HTMLElement;
  private focusedElementBeforeModal: HTMLElement;
  private lastTabStop: HTMLElement;

  public componentDidMount() {
    this.focusedElementBeforeModal = document.activeElement as HTMLElement;
    // Find all focusable children
    const focusableElementsString =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    const focusableElements = Array.prototype.slice.call(
      this.modal.querySelectorAll(focusableElementsString)
    );

    // Convert NodeList to Array
    this.firstTabStop = focusableElements[0];
    this.lastTabStop = focusableElements[focusableElements.length - 1];

    this.modal.addEventListener('keydown', this.keyDownListener);
  }

  public componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDownListener);
  }

  public scrollContentToTop = () => {
    this.modalContent.scrollTop = 0;
  };

  public render() {
    const { title, children, modalStyle, hasButtons, handleClose } = this.props;
    return (
      <div
        className="Modal"
        style={modalStyle}
        role="dialog"
        aria-labelledby="Modal-header-title"
        ref={div => {
          this.modal = div as HTMLElement;
        }}
      >
        {title && (
          <div className="Modal-header flex-wrapper">
            <h2 className="Modal-header-title">{title}</h2>
            <div className="flex-spacer" />
            <button className="Modal-header-close" aria-label="Close" onClick={handleClose}>
              <img className="Modal-header-close-icon" src={closeIcon} alt="Close" />
            </button>
          </div>
        )}

        <div className="Modal-content" ref={div => (this.modalContent = div as HTMLElement)}>
          {children}
          <div className="Modal-fade" />
        </div>
        {hasButtons && <div className="Modal-footer">{this.renderButtons()}</div>}
      </div>
    );
  }

  private renderButtons = () => {
    const { disableButtons, buttons } = this.props;
    if (!buttons || !buttons.length) {
      return;
    }

    return buttons.map((btn, idx: number) => {
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
}
