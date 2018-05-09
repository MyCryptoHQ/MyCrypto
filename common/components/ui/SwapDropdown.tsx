import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { Option } from 'react-select';
import './SwapDropdown.scss';

export interface SingleCoin {
  id: string;
  name: string;
  image: string;
  status: string;
}

interface Props {
  options: SingleCoin[];
  disabledOption?: string;
  value: string;
  onChange(value: SingleCoin): void;
}

interface State {
  isOpen: boolean;
  mainOptions: SingleCoin[];
  otherOptions: SingleCoin[];
}

const MAIN_OPTIONS = ['ETH', 'BTC'];

class SwapDropdown extends PureComponent<Props, State> {
  public state: State = {
    isOpen: false,
    mainOptions: [],
    otherOptions: []
  };

  public dropdown: HTMLDivElement | null;

  public UNSAFE_componentWillMount() {
    this.buildOptions(this.props.options);
    document.addEventListener('click', this.handleBodyClick);
  }

  public componentWillUnmount() {
    document.removeEventListener('click', this.handleBodyClick);
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.options !== nextProps.options) {
      this.buildOptions(nextProps.options);
    }
  }

  public render() {
    const { options, value, disabledOption } = this.props;
    const { isOpen, mainOptions, otherOptions } = this.state;

    const selectedOption = options.find(opt => opt.name === value);

    return (
      <div className="SwapDropdown" ref={el => (this.dropdown = el)}>
        <button className="SwapDropdown-button btn btn-default" onClick={this.toggleMenu}>
          {selectedOption ? (
            <React.Fragment>
              <img src={selectedOption.image} className="SwapDropdown-button-logo" />
              <span className="SwapDropdown-button-label">{selectedOption.id}</span>
            </React.Fragment>
          ) : (
            'Unknown'
          )}
        </button>

        {isOpen && (
          <div className="SwapDropdown-menu">
            <i className="SwapDropdown-menu-triangle" />
            <div className="SwapDropdown-menu-content">
              {mainOptions.map(opt => (
                <SwapOption
                  key={opt.name}
                  option={opt}
                  isMain={true}
                  isDisabled={opt.name === disabledOption}
                  onChange={this.handleChange}
                />
              ))}
              {otherOptions.map(opt => (
                <SwapOption
                  key={opt.name}
                  option={opt}
                  isMain={false}
                  isDisabled={opt.name === disabledOption}
                  onChange={this.handleChange}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  private toggleMenu = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  private handleChange = (coin: SingleCoin) => {
    this.props.onChange(coin);
    if (this.state.isOpen) {
      this.toggleMenu();
    }
  };

  private handleBodyClick = (ev: MouseEvent) => {
    if (!this.state.isOpen || !this.dropdown) {
      return;
    }

    if (
      ev.target !== this.dropdown &&
      ev.target instanceof HTMLElement &&
      !this.dropdown.contains(ev.target)
    ) {
      this.toggleMenu();
    }
  };

  private buildOptions(options: Props['options']) {
    const mainOptions: SingleCoin[] = [];
    let otherOptions: SingleCoin[] = [];

    options.forEach(opt => {
      if (MAIN_OPTIONS.includes(opt.id)) {
        mainOptions.push(opt);
      } else {
        otherOptions.push(opt);
      }
    });

    // Sort non-main coins alphabetically
    otherOptions = otherOptions.sort(
      (opt1, opt2) => (opt1.id.toLowerCase() > opt2.id.toLowerCase() ? 1 : -1)
    );

    this.setState({ mainOptions, otherOptions });
  }
}

interface SwapOptionProps {
  option: SingleCoin;
  isMain?: boolean;
  isDisabled?: boolean;
  onChange(opt: Option): void;
}

const SwapOption: React.SFC<SwapOptionProps> = ({ option, isMain, isDisabled, onChange }) => {
  const handleChange = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    onChange({
      label: option.id,
      value: option.name
    });
  };

  const classNames = classnames('SwapOption', isMain && 'is-main', isDisabled && 'is-disabled');

  return (
    <button className={classNames} disabled={isDisabled} onClick={handleChange}>
      {isMain ? (
        <React.Fragment>
          <img src={option.image} className="SwapOption-logo" alt={`${option.name} logo`} />
          <div className="SwapOption-info">
            <div className="SwapOption-ticker">{option.id}</div>
            <div className="SwapOption-name">{option.name}</div>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="SwapOption-top">
            <img src={option.image} className="SwapOption-logo" alt={`${option.name} logo`} />
            <div className="SwapOption-ticker">{option.id}</div>
          </div>
          <div className="SwapOption-name">{option.name}</div>
        </React.Fragment>
      )}
    </button>
  );
};

export default SwapDropdown;
