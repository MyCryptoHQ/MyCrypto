// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import closeIcon from 'assets/images/icon-x.svg';

import './Modal.scss';

type Props = {
  isOpen?: boolean,
  title: string,
  buttons: {
    text: string,
    type?: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'link',
    onClick: () => void
  }[],
  handleClose: () => void,
  children: any
};

export default class Modal extends Component {
  props: Props;
  static propTypes = {
    isOpen: PropTypes.bool,
    title: PropTypes.node.isRequired,
    children: PropTypes.node,
    buttons: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.node.isRequired,
        type: PropTypes.oneOf([
          'default',
          'primary',
          'success',
          'info',
          'warning',
          'danger',
          'link'
        ]),
        onClick: PropTypes.func.isRequired
      })
    ),
    handleClose: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.updateBodyClass();
    document.addEventListener('keydown', this._escapeListner);
  }

  componentDidUpdate() {
    this.updateBodyClass();
  }

  updateBodyClass() {
    // $FlowFixMe
    document.body.classList.toggle('no-scroll', !!this.props.isOpen);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._escapeListner);
    // $FlowFixMe
    document.body.classList.remove('no-scroll');
  }

  _escapeListner = (ev: KeyboardEvent) => {
    // Don't trigger if they hit escape while on an input
    if (ev.target) {
      if (
        ev.target.tagName === 'INPUT' ||
        ev.target.tagName === 'SELECT' ||
        ev.target.tagName === 'TEXTAREA' ||
        ev.target.isContentEditable
      ) {
        return;
      }
    }

    if (ev.key === 'Escape' || ev.keyCode === 27) {
      this.props.handleClose();
    }
  };

  _renderButtons() {
    return this.props.buttons.map((btn, idx) => {
      let btnClass = 'Modal-footer-btn btn';

      if (btn.type) {
        btnClass += ` btn-${btn.type}`;
      }

      return (
        <button className={btnClass} onClick={btn.onClick} key={idx}>
          {btn.text}
        </button>
      );
    });
  }

  render() {
    const { isOpen, title, children, buttons, handleClose } = this.props;
    const hasButtons = buttons && buttons.length;

    return (
      <div>
        <div className={`Modalshade ${isOpen ? 'is-open' : ''}`} />
        <div className={`Modal ${isOpen ? 'is-open' : ''}`}>
          <div className="Modal-header">
            <h2 className="Modal-header-title">
              {title}
            </h2>
            <button className="Modal-header-close" onClick={handleClose}>
              <img className="Modal-header-close-icon" src={closeIcon} />
            </button>
          </div>
          <div className="Modal-content">
            {isOpen && children}
          </div>
          {hasButtons &&
            <div className="Modal-footer">
              {this._renderButtons()}
            </div>}
        </div>
      </div>
    );
  }
}
