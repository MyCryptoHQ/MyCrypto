// @flow
import React, { Component } from 'react';
import classnames from 'classnames';

type Props = {
  ariaLabel: string,
  size: string,
  color: string,
  renderLabel: () => any,
  renderOptions: () => any
};

type State = {
  expanded: boolean
};

export default class DropdownComponent extends Component {
  props: Props;

  static defaultProps = {
    color: 'default',
    size: 'sm'
  };

  state: State = {
    expanded: false
  };

  dropdown = null;

  componentDidMount() {
    document.addEventListener('click', this._clickOffHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._clickOffHandler);
  }

  _clickOffHandler = (ev: MouseEvent) => {
    // Only calculate if dropdown is open & we have the ref
    if (!this.state.expanded || !this.dropdown) {
      return;
    }

    // If it's an element that's not inside of the dropdown, close it up
    if (this.dropdown !== ev.target && !this.dropdown.contains(ev.target)) {
      this.setState({ expanded: false });
    }
  };

  render() {
    const { ariaLabel, color, size, renderOptions, renderLabel } = this.props;
    const { expanded } = this.state;
    const toggleClasses = classnames([
      'dropdown-toggle',
      'btn',
      `btn-${color}`,
      `btn-${size}`
    ]);

    return (
      <span
        className={`dropdown ${expanded ? 'open' : ''}`}
        ref={el => (this.dropdown = el)}
      >
        <a
          tabIndex="0"
          aria-haspopup="true"
          aria-expanded={expanded}
          aria-label={ariaLabel}
          className={toggleClasses}
          onClick={this.toggle}
        >
          {renderLabel()}
          <i className="caret" />
        </a>
        {expanded && renderOptions()}
      </span>
    );
  }

  toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  open = () => {
    this.setState({ expanded: true });
  };

  close = () => {
    this.setState({ expanded: false });
  };
}
