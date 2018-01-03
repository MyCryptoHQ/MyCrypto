import React, { Component } from 'react';
import './SwapDropdown.scss';
import classnames from 'classnames';

export interface SingleCoin {
  id: string;
  name: string;
  image: string;
  status: string;
}

interface Props<T> {
  ariaLabel: string;
  options: SingleCoin[];
  value: string;
  onChange(value: T): void;
}

class SwapDropdown<T> extends Component<Props<T>, {}> {
  public state = {
    open: false
  };

  private dropdown: HTMLElement | null;

  public componentDidMount() {
    document.addEventListener('click', this.clickHandler);
  }

  public componentWillUnmount() {
    document.removeEventListener('click', this.clickHandler);
  }

  public handleClickOutside() {
    this.toggleDropdown();
  }

  public render() {
    const { open } = this.state;
    const { options, value } = this.props;
    const dropdownGrid = classnames(open && 'open', 'SwapDropdown-grid');

    const mappedCoins = options.sort((a, b) => (a.id > b.id ? 1 : -1)).map((coin: SingleCoin) => {
      const cn = classnames(coin.status !== 'available' && 'inactive', 'SwapDropdown-item');
      return (
        <li className={cn} key={coin.id}>
          <a onClick={coin.status === 'available' ? this.onChange.bind(null, coin.id) : null}>
            <img src={coin.image} height="20" width="20" />
            {/* <div className="SwapDropdown-desc"> */}
            <strong>{coin.id}</strong>
            <br />
            <small>{coin.name}</small>
            {/* </div> */}
          </a>
        </li>
      );
    });
    return (
      <div className="SwapDropdown" ref={el => (this.dropdown = el)}>
        <button onClick={this.toggleDropdown}>
          {value}
          <i className="caret" />
        </button>
        <ul className={dropdownGrid}>{mappedCoins}</ul>
      </div>
    );
  }
  private toggleDropdown = () => {
    this.setState({
      open: !this.state.open
    });
  };

  private onChange = (value: any) => {
    this.props.onChange(value);
    if (this.state.open) {
      this.setState({
        open: false
      });
    }
  };

  private clickHandler = (ev: Event) => {
    if (!this.state.open || !this.dropdown) {
      return;
    }

    if (
      this.dropdown !== ev.target &&
      ev.target instanceof HTMLElement &&
      !this.dropdown.contains(ev.target)
    ) {
      this.setState({
        open: false
      });
    }
  };
}

export default SwapDropdown;
