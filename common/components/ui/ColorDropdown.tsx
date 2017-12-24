import React, { Component } from 'react';
import classnames from 'classnames';
import DropdownShell from './DropdownShell';
import removeIcon from 'assets/images/icon-remove.svg';
import './ColorDropdown.scss';

interface Option<T> {
  name: any;
  value: T;
  color?: string;
  hidden: boolean | undefined;
  onRemove?(): void;
}

interface Props<T> {
  value: T;
  options: Option<T>[];
  label?: string;
  ariaLabel: string;
  extra?: any;
  size?: string;
  color?: string;
  menuAlign?: string;
  disabled?: boolean;
  onChange(value: T): void;
}

export default class ColorDropdown<T> extends Component<Props<T>, {}> {
  private dropdownShell: DropdownShell | null;

  public render() {
    const { ariaLabel, disabled, color, size } = this.props;

    return (
      <DropdownShell
        renderLabel={this.renderLabel}
        renderOptions={this.renderOptions}
        size={size}
        color={color}
        ariaLabel={ariaLabel}
        ref={el => (this.dropdownShell = el)}
        disabled={disabled}
      />
    );
  }

  private renderLabel = () => {
    const label = this.props.label ? `${this.props.label}:` : '';
    const activeOption = this.getActiveOption();

    return (
      <span>
        {label} {activeOption ? activeOption.name : '-'}
      </span>
    );
  };

  private renderOptions = () => {
    const { options, value, menuAlign, extra } = this.props;

    const listItems = options.filter(opt => !opt.hidden).reduce((prev: any[], opt) => {
      const prevOpt = prev.length ? prev[prev.length - 1] : null;
      if (prevOpt && !prevOpt.divider && prevOpt.color !== opt.color) {
        prev.push({ divider: true });
      }
      prev.push(opt);
      return prev;
    }, []);

    const menuClass = classnames({
      ColorDropdown: true,
      'dropdown-menu': true,
      [`dropdown-menu-${menuAlign || ''}`]: !!menuAlign
    });

    return (
      <ul className={menuClass}>
        {listItems.map((option, i) => {
          if (option.divider) {
            return <li key={i} role="separator" className="divider" />;
          } else {
            return (
              <li key={i} className="ColorDropdown-item" style={{ borderColor: option.color }}>
                <a
                  className={option.value === value ? 'active' : ''}
                  onClick={this.onChange.bind(null, option.value)}
                >
                  {option.name}

                  {option.onRemove && (
                    <img
                      className="ColorDropdown-item-remove"
                      onClick={this.onRemove.bind(null, option.onRemove)}
                      src={removeIcon}
                    />
                  )}
                </a>
              </li>
            );
          }
        })}
        {extra && <li key="separator" role="separator" className="divider" />}
        {extra}
      </ul>
    );
  };

  private onChange = (value: any) => {
    this.props.onChange(value);
    if (this.dropdownShell) {
      this.dropdownShell.close();
    }
  };

  private onRemove(onRemove: () => void, ev?: React.FormEvent<HTMLButtonElement>) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    onRemove();
  }

  private getActiveOption() {
    return this.props.options.find(opt => opt.value === this.props.value);
  }
}
