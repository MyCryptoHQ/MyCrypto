import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import translate, { translateRaw } from 'translations';
import { setCurrentTo, TSetCurrentTo } from 'actions/transaction';
import { getLabelAddresses } from 'selectors/addressBook';
import { getToRaw } from 'selectors/transaction/fields';
import { Address, Identicon } from 'components/ui';
import './AddressFieldDropdown.scss';
import { getNetworkConfig } from 'selectors/config';
import { NetworkConfig } from 'types/network';

interface StateProps {
  labelAddresses: ReturnType<typeof getLabelAddresses>;
  currentTo: ReturnType<typeof getToRaw>;
  network: NetworkConfig;
}

interface DispatchProps {
  setCurrentTo: TSetCurrentTo;
}

type Props = StateProps & DispatchProps;

interface State {
  activeIndex: number | null;
}

class AddressFieldDropdown extends React.Component<Props> {
  public state: State = {
    activeIndex: null
  };

  public componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  public componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  public render() {
    const { currentTo } = this.props;
    const noMatchContent = currentTo.startsWith('0x') ? null : (
      <li className="AddressFieldDropdown-dropdown-item AddressFieldDropdown-dropdown-item-no-match">
        <i className="fa fa-warning" /> {translate('NO_LABEL_FOUND_CONTAINING')} "{currentTo}".
      </li>
    );

    return this.props.currentTo.length > 1 ? (
      <ul className="AddressFieldDropdown" role="listbox">
        {this.getFilteredLabels().length > 0 ? this.renderDropdownItems() : noMatchContent}
      </ul>
    ) : null;
  }

  private renderDropdownItems = () =>
    this.getFilteredLabels().map((filteredLabel, index: number) => {
      const { activeIndex } = this.state;
      const { address, label } = filteredLabel;
      const isActive = activeIndex === index;
      const className = `AddressFieldDropdown-dropdown-item ${
        isActive ? 'AddressFieldDropdown-dropdown-item--active' : ''
      }`;

      return (
        <li
          key={address}
          className={className}
          onClick={() => this.props.setCurrentTo(address)}
          role="option"
          title={`${translateRaw('SEND_TO')}${label}`}
        >
          <div className="AddressFieldDropdown-dropdown-item-identicon">
            <Identicon address={address} network={this.props.network} />
          </div>
          <strong className="AddressFieldDropdown-dropdown-item-label">{label}</strong>
          <em className="AddressFieldDropdown-dropdown-item-address">
            <Address address={address} />
          </em>
        </li>
      );
    });

  private getFilteredLabels = () =>
    Object.keys(this.props.labelAddresses)
      .filter(label => label.toLowerCase().includes(this.props.currentTo.toLowerCase()))
      .map(label => ({ address: this.props.labelAddresses[label], label }))
      .slice(0, 5);

  private getIsVisible = () =>
    this.props.currentTo.length > 1 && this.getFilteredLabels().length > 0;

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.getIsVisible()) {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          return this.handleEnterKeyDown();
        case 'ArrowUp':
          e.preventDefault();
          return this.handleUpArrowKeyDown();
        case 'ArrowDown':
          e.preventDefault();
          return this.handleDownArrowKeyDown();
        default:
          return;
      }
    }
  };

  private handleEnterKeyDown = () => {
    const { activeIndex } = this.state;

    if (activeIndex !== null) {
      const filteredLabels = this.getFilteredLabels();

      filteredLabels.forEach(({ address }, index) => {
        if (activeIndex === index) {
          this.props.setCurrentTo(address);
        }
      });

      this.clearActiveIndex();
    }
  };

  private handleUpArrowKeyDown = () => {
    const { activeIndex: previousActiveIndex } = this.state;
    const filteredLabelCount = this.getFilteredLabels().length;

    let activeIndex =
      previousActiveIndex === null ? filteredLabelCount - 1 : previousActiveIndex - 1;

    // Loop back to end
    if (activeIndex < 0) {
      activeIndex = filteredLabelCount - 1;
    }

    this.setState({ activeIndex });
  };

  private handleDownArrowKeyDown = () => {
    const { activeIndex: previousActiveIndex } = this.state;
    const filteredLabelCount = this.getFilteredLabels().length;

    let activeIndex = previousActiveIndex === null ? 0 : previousActiveIndex + 1;

    // Loop back to beginning
    if (activeIndex >= filteredLabelCount) {
      activeIndex = 0;
    }

    this.setState({ activeIndex });
  };

  private setActiveIndex = (activeIndex: number | null) => this.setState({ activeIndex });

  private clearActiveIndex = () => this.setActiveIndex(null);
}

export default connect(
  (state: AppState) => ({
    labelAddresses: getLabelAddresses(state),
    currentTo: getToRaw(state),
    network: getNetworkConfig(state)
  }),
  { setCurrentTo }
)(AddressFieldDropdown);
