import React from 'react';
import { connect } from 'react-redux';
import { setCurrentTo } from 'actions/transaction';
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

class AddressFieldDropdown extends React.Component<Props> {
  public render() {
    return this.getIsVisible() ? (
      <ul className="AddressFieldDropdown">{this.renderDropdownItems()}</ul>
    ) : null;
  }

  private renderDropdownItems = () =>
    this.getFilteredLabels().map(label => (
      <li
        key={this.props.labels[label]}
        className="AddressFieldDropdown-dropdown-item"
        onClick={() => this.props.setCurrentTo(this.props.labels[label])}
      >
        <strong>{label}</strong>
        <Identicon address={this.props.labels[label]} size="2rem" />
        <strong>
          <Address address={this.props.labels[label]} />
        </strong>
      </li>
    ));

  private getFilteredLabels = () =>
    Object.keys(this.props.labels).filter(label =>
      label.toLowerCase().includes(this.props.currentTo.toLowerCase())
    );

  private getIsVisible = () =>
    this.props.currentTo.length > 1 && this.getFilteredLabels().length > 0;
}

export default connect(
  state => ({
    labels: getLabels(state, { reversed: true }),
    currentTo: getTransactionToRaw(state)
  }),
  { setCurrentTo }
)(AddressFieldDropdown);
