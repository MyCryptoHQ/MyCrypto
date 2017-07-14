// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import closeIcon from 'assets/images/icon-x.svg';

import './Modal.scss';

export default class Modal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
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

  componentDidMount() {}

  componentWillUnmount() {}

  _renderButtons() {
    let idx = 0;

    return this.props.buttons.map(btn => {
      let btnClass = 'Modal-footer-btn btn';

      if (btn.type) {
        btnClass += ` btn-${btn.type}`;
      }

      return (
        <button className={btnClass} onClick={btn.onClick} key={idx++}>
          {btn.text}
        </button>
      );
    });
  }

  render() {
    const { isOpen, title, children, buttons, handleClose } = this.props;
    const hasButtons = buttons && buttons.length;
    const size = this.props.size || 'medium';

    return (
      <div>
        <div className={`Modalshade ${isOpen ? 'is-open' : ''}`} />
        <div className={`Modal is-${size} ${isOpen ? 'is-open' : ''}`}>
          <div className="Modal-header">
            <h2 className="Modal-header-title">
              {title}
            </h2>
            <button className="Modal-header-close" onClick={handleClose}>
              <img className="Modal-header-close-icon" src={closeIcon} />
            </button>
          </div>
          <div className={`Modal-content ${hasButtons ? 'has-buttons' : ''}`}>
            {children}
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
