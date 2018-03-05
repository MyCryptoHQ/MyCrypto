import React from 'react';
import closeIcon from 'assets/images/close.svg';

export default class ModalBody extends React.Component<any, any> {
  private modal: HTMLElement;
  private modalContent: HTMLElement;
  private focusedElementBeforeModal: HTMLElement;
  private focusableElementsString: string;
  private focusableElements: HTMLElement[];
  private firstTabStop: HTMLElement;
  private lastTabStop: HTMLElement;

  public componentDidMount() {
    this.focusedElementBeforeModal = document.activeElement as HTMLElement;
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
              <img className="Modal-header-close-icon" src={closeIcon} />
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
