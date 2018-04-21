import React from 'react';
import { connect } from 'react-redux';
import KeyCodes from 'shared/keycodes';
import { AppState } from 'reducers';
import translate from 'translations';
import { setCurrentTo } from 'actions/transaction';
import { AddressLabelPair } from 'actions/addressBook';
import { getLabels } from 'selectors/addressBook';
import { getTransactionToRaw } from 'selectors/transactions';
import { Address, Identicon } from 'components/ui';
import './AddressFieldDropdown.scss';

interface ReversedAddressToLabelDictionary {
  [label: string]: string;
}

interface Props {
  labels: ReversedAddressToLabelDictionary;
  currentTo: string;
  setCurrentTo(to: string): void;
  onSelect(e: React.ChangeEvent<HTMLInputElement>): void;
}

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
    return this.getIsVisible() ? (
      <ul className="AddressFieldDropdown" role="listbox">
        {this.renderDropdownItems()}
      </ul>
    ) : null;
  }

  private renderDropdownItems = () =>
    this.getFilteredLabels().map((filteredLabel: AddressLabelPair, index: number) => {
      const { setCurrentTo } = this.props;
      const { activeIndex } = this.state;
      const { address, label } = filteredLabel;
      const isActive = activeIndex === index;
      const className = `AddressFieldDropdown-dropdown-item ${
        isActive ? 'AddressFieldDropdown-dropdown-item--active' : ''
      }`;
      const title = `${translate('SEND_TO')}${label}`;

      return (
        <li
          key={address}
          className={className}
          onClick={() => setCurrentTo(address)}
          role="option"
          title={title}
        >
          <strong>{label}</strong>
          <Identicon address={address} size="2rem" />
          <strong>
            <Address address={address} />
          </strong>
        </li>
      );
    });

  private getFilteredLabels = () =>
    Object.keys(this.props.labels)
      .filter(label => label.toLowerCase().includes(this.props.currentTo.toLowerCase()))
      .map(label => ({ address: this.props.labels[label], label }))
      .slice(0, 5);

  private getIsVisible = () =>
    this.props.currentTo.length > 1 && this.getFilteredLabels().length > 0;

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.getIsVisible()) {
      switch (e.keyCode) {
        case KeyCodes.ENTER:
          return this.handleEnterKeyDown();
        case KeyCodes.UP_ARROW:
          return this.handleUpArrowKeyDown();
        case KeyCodes.DOWN_ARROW:
          return this.handleDownArrowKeyDown();
        default:
          return;
      }
    }
  };

  private handleEnterKeyDown = () => {
    const { setCurrentTo } = this.props;
    const { activeIndex } = this.state;

    if (activeIndex !== null) {
      const filteredLabels = this.getFilteredLabels();

      filteredLabels.forEach(({ address }, index) => {
        if (activeIndex === index) {
          setCurrentTo(address);
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
    labels: getLabels(state, { reversed: true }),
    currentTo: getTransactionToRaw(state)
  }),
  { setCurrentTo }
)(AddressFieldDropdown);
