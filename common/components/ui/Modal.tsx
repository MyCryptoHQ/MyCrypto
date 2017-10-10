import closeIcon from 'assets/images/icon-x.svg';
import React, { Component } from 'react';
import './Modal.scss';

export interface IButton {
  text: string;
  type?:
    | 'default'
    | 'primary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'link';
  disabled?: boolean;
  onClick?(): void;
}
interface Props {
  isOpen?: boolean;
  title: string;
  disableButtons?: boolean;
  children: any;
  buttons: IButton[];
  handleClose(): void;
}

export default class Modal extends Component<Props, {}> {
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
    const { isOpen, title, children, buttons, handleClose } = this.props;
    const hasButtons = buttons && buttons.length;

    return (
      <div>
        <div className={`Modalshade ${isOpen ? 'is-open' : ''}`} />
        <div className={`Modal ${isOpen ? 'is-open' : ''}`}>
          <div className="Modal-header">
            <h2 className="Modal-header-title">{title}</h2>
            <button className="Modal-header-close" onClick={handleClose}>
              <img className="Modal-header-close-icon" src={closeIcon} />
            </button>
          </div>
          <div className="Modal-content">{isOpen && children}</div>
          {hasButtons && (
            <div className="Modal-footer">{this.renderButtons()}</div>
          )}
        </div>
      </div>
    );
  }
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
      this.props.handleClose();
    }
  };

  private renderButtons = () => {
    const { disableButtons, buttons } = this.props;

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
