import React from 'react';
import { connect } from 'react-redux';

import translate, { translateRaw } from 'translations';
import { AppState } from 'features/reducers';
import { transactionActions, transactionSelectors } from 'features/transaction';
import { addressBookSelectors } from 'features/addressBook';
import { walletSelectors } from 'features/wallet';
import { Address, Identicon } from 'components/ui';
import './AddressFieldDropdown.scss';

interface Props {
  addressInput?: string;
  dropdownThreshold?: number;
  labelAddresses: ReturnType<typeof addressBookSelectors.getLabelAddresses>;
  recentAddresses: ReturnType<typeof walletSelectors.getRecentAddresses>;
  onEntryClick(address: string): void;
}

interface State {
  activeIndex: number | null;
}

class AddressFieldDropdownClass extends React.Component<Props, State> {
  public state = {
    activeIndex: null
  };

  private exists: boolean = true;

  public componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  public componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.exists = false;
  }

  public render() {
    const { addressInput } = this.props;

    return (
      this.getIsVisible() && (
        <ul className="AddressFieldDropdown" role="listbox">
          {this.getFilteredLabels().length > 0 ? (
            this.renderDropdownItems()
          ) : (
            <li className="AddressFieldDropdown-dropdown-item AddressFieldDropdown-dropdown-item-no-match">
              <i className="fa fa-warning" /> {translate('NO_LABEL_FOUND_CONTAINING')} "
              {addressInput}".
            </li>
          )}
        </ul>
      )
    );
  }

  private renderDropdownItems = () => {
    const { onEntryClick } = this.props;
    const { activeIndex } = this.state;

    return this.getFilteredLabels().map(
      ({ address, label }: { address: string; label: string }, index: number) => {
        const isActive = activeIndex === index;
        const className = `AddressFieldDropdown-dropdown-item ${
          isActive ? 'AddressFieldDropdown-dropdown-item--active' : ''
        }`;

        return (
          <li
            key={address}
            role="option"
            className={className}
            onClick={() => onEntryClick(address)}
            title={`${translateRaw('SEND_TO')}${label}`}
          >
            <div className="AddressFieldDropdown-dropdown-item-identicon">
              <Identicon address={address} />
            </div>
            <strong className="AddressFieldDropdown-dropdown-item-label">{label}</strong>
            <em className="AddressFieldDropdown-dropdown-item-address">
              <Address address={address} />
            </em>
          </li>
        );
      }
    );
  };

  private getFormattedRecentAddresses = (): { [label: string]: string } => {
    const { labelAddresses, recentAddresses } = this.props;
    // Hash existing entries by address for performance.
    const addressesInBook: { [address: string]: boolean } = Object.values(labelAddresses).reduce(
      (prev: { [address: string]: boolean }, next: string) => {
        prev[next] = true;
        return prev;
      },
      {}
    );
    // Make recent addresses sequential.
    let recentAddressCount: number = 0;
    const addresses = recentAddresses.reduce((prev: { [label: string]: string }, next: string) => {
      // Prevent duplication.
      if (addressesInBook[next]) {
        return prev;
      }
      prev[
        translateRaw('RECENT_ADDRESS_NUMBER', { $number: (++recentAddressCount).toString() })
      ] = next;

      return prev;
    }, {});

    return addresses;
  };

  private getFilteredLabels = () => {
    const { addressInput, labelAddresses } = this.props;
    const formattedRecentAddresses = this.getFormattedRecentAddresses();

    return Object.keys({ ...labelAddresses, ...formattedRecentAddresses })
      .filter(label => !addressInput || label.toLowerCase().includes(addressInput))
      .map(label => ({ address: labelAddresses[label] || formattedRecentAddresses[label], label }))
      .slice(0, 5);
  };

  private getIsVisible = () => {
    const { addressInput, dropdownThreshold = 3 } = this.props;

    return (
      addressInput &&
      addressInput.length >= dropdownThreshold &&
      this.getFilteredLabels().length > 0
    );
  };

  private setActiveIndex = (activeIndex: number | null) => this.setState({ activeIndex });

  private clearActiveIndex = () => this.setActiveIndex(null);

  //#region Keyboard Controls
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
    const { onEntryClick } = this.props;
    const { activeIndex } = this.state;

    if (activeIndex !== null) {
      const filteredLabels = this.getFilteredLabels();

      filteredLabels.forEach(({ address }, index) => {
        if (activeIndex === index) {
          onEntryClick(address);
        }
      });

      if (this.exists) {
        this.clearActiveIndex();
      }
    }
  };

  private handleUpArrowKeyDown = () => {
    const { activeIndex: previousActiveIndex } = this.state;
    const filteredLabelCount = this.getFilteredLabels().length;

    let activeIndex =
      previousActiveIndex === null ? filteredLabelCount - 1 : previousActiveIndex! - 1;

    // Loop back to end
    if (activeIndex < 0) {
      activeIndex = filteredLabelCount - 1;
    }

    this.setState({ activeIndex });
  };

  private handleDownArrowKeyDown = () => {
    const { activeIndex: previousActiveIndex } = this.state;
    const filteredLabelCount = this.getFilteredLabels().length;

    let activeIndex = previousActiveIndex === null ? 0 : previousActiveIndex! + 1;

    // Loop back to beginning
    if (activeIndex >= filteredLabelCount) {
      activeIndex = 0;
    }

    this.setState({ activeIndex });
  };
  //#endregion Keyboard Controls
}

//#region Uncontrolled
/**
 * @desc The `onChangeOverride` prop needs to work
 *  with actual events, but also needs a value to be directly passed in
 *  occasionally. This interface allows us to skip all of the other FormEvent
 *  properties and methods.
 */
interface FakeFormEvent {
  currentTarget: {
    value: string;
  };
}

interface UncontrolledAddressFieldDropdownProps {
  value?: string;
  labelAddresses: ReturnType<typeof addressBookSelectors.getLabelAddresses>;
  recentAddresses: ReturnType<typeof walletSelectors.getRecentAddresses>;
  dropdownThreshold?: number;
  onChangeOverride?(ev: React.FormEvent<HTMLInputElement> | FakeFormEvent): void;
}

/**
 * @desc The uncontrolled dropdown changes the address input onClick,
 *  as well as calls the onChange override, but does not update the `currentTo`
 *  property in the Redux store.
 */
function RawUncontrolledAddressFieldDropdown({
  value,
  onChangeOverride,
  labelAddresses,
  recentAddresses,
  dropdownThreshold
}: UncontrolledAddressFieldDropdownProps) {
  const onEntryClick = (address: string) =>
    onChangeOverride && onChangeOverride({ currentTarget: { value: address } });

  return (
    <AddressFieldDropdownClass
      addressInput={value}
      onEntryClick={onEntryClick}
      labelAddresses={labelAddresses}
      recentAddresses={recentAddresses}
      dropdownThreshold={dropdownThreshold}
    />
  );
}

const UncontrolledAddressFieldDropdown = connect((state: AppState) => ({
  labelAddresses: addressBookSelectors.getLabelAddresses(state),
  recentAddresses: walletSelectors.getRecentAddresses(state)
}))(RawUncontrolledAddressFieldDropdown);
//#endregion Uncontrolled

//#region Controlled
interface ControlledAddressFieldDropdownProps {
  currentTo: ReturnType<typeof transactionSelectors.getToRaw>;
  labelAddresses: ReturnType<typeof addressBookSelectors.getLabelAddresses>;
  recentAddresses: ReturnType<typeof walletSelectors.getRecentAddresses>;
  setCurrentTo: transactionActions.TSetCurrentTo;
  dropdownThreshold?: number;
}

/**
 * @desc The controlled dropdown connects directly to the Redux store,
 *  modifying the `currentTo` property onChange.
 */
function RawControlledAddressFieldDropdown({
  currentTo,
  labelAddresses,
  recentAddresses,
  setCurrentTo,
  dropdownThreshold
}: ControlledAddressFieldDropdownProps) {
  return (
    <AddressFieldDropdownClass
      addressInput={currentTo}
      onEntryClick={setCurrentTo}
      labelAddresses={labelAddresses}
      recentAddresses={recentAddresses}
      dropdownThreshold={dropdownThreshold}
    />
  );
}

const ControlledAddressFieldDropdown = connect(
  (state: AppState) => ({
    currentTo: transactionSelectors.getToRaw(state),
    labelAddresses: addressBookSelectors.getLabelAddresses(state),
    recentAddresses: walletSelectors.getRecentAddresses(state)
  }),
  {
    setCurrentTo: transactionActions.setCurrentTo
  }
)(RawControlledAddressFieldDropdown);
//#endregion Controlled

interface AddressFieldDropdownProps {
  controlled: boolean;
  value?: string;
  dropdownThreshold?: number;
  onChangeOverride?(ev: React.FormEvent<HTMLInputElement> | FakeFormEvent): void;
}

export default function AddressFieldDropdown({
  controlled = true,
  ...props
}: AddressFieldDropdownProps) {
  const Dropdown = controlled ? ControlledAddressFieldDropdown : UncontrolledAddressFieldDropdown;
  // @ts-ignore
  return <Dropdown {...props} />;
}
