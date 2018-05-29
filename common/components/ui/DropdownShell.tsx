import React, { Component } from 'react';
import classnames from 'classnames';

interface Props {
  ariaLabel: string;
  disabled?: boolean;
  size?: string;
  color?: string;
  renderLabel(): any;
  renderOptions(): any;
}

interface State {
  expanded: boolean;
}

export default class DropdownComponent extends Component<Props, State> {
  public static defaultProps = {
    color: 'default',
    size: 'sm'
  };

  public state: State = {
    expanded: false
  };

  private dropdown: HTMLElement | null;

  public componentDidMount() {
    document.addEventListener('click', this.clickOffHandler);
  }

  public componentWillUnmount() {
    document.removeEventListener('click', this.clickOffHandler);
  }

  public render() {
    const { ariaLabel, color, disabled, size, renderOptions, renderLabel } = this.props;
    const { expanded } = this.state;
    const toggleClasses = classnames(['dropdown-toggle', 'btn', `btn-${color}`, `btn-${size}`]);

    return (
      <span
        className={`dropdown ${expanded || disabled ? 'open' : ''}`}
        ref={el => (this.dropdown = el)}
      >
        <a
          tabIndex={0}
          aria-haspopup="true"
          aria-expanded={expanded}
          aria-label={ariaLabel}
          className={toggleClasses}
          onClick={this.toggle}
        >
          {renderLabel()}
          {!disabled && <i className="caret" />}
        </a>
        {expanded && !disabled && renderOptions()}
      </span>
    );
  }

  public toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  public open = () => {
    this.setState({ expanded: true });
  };

  public close = () => {
    this.setState({ expanded: false });
  };

  private clickOffHandler = (ev: MouseEvent) => {
    // Only calculate if dropdown is open & we have the ref
    if (!this.state.expanded || !this.dropdown) {
      return;
    }

    // If it's an element that's not inside of the dropdown, close it up
    if (
      this.dropdown !== ev.target &&
      ev.target instanceof HTMLElement &&
      !this.dropdown.contains(ev.target)
    ) {
      this.setState({ expanded: false });
    }
  };
}
