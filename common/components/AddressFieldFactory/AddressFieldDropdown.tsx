import React from 'react';
import { connect } from 'react-redux';
import { setCurrentTo } from 'actions/transaction';
import { getLabels } from 'selectors/addressBook';
import { getTransactionToRaw } from 'selectors/transactions';
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
      <li onClick={() => this.props.setCurrentTo(this.props.labels[label])}>{label}</li>
    ));

  private getFilteredLabels = () =>
    Object.keys(this.props.labels).filter(label => label.includes(this.props.currentTo));

  private getIsVisible = () => {
    const { currentTo } = this.props;

    return currentTo.length > 1 && this.getFilteredLabels().length > 0;
  };
}

export default connect(
  state => ({
    labels: getLabels(state, { reversed: true }),
    currentTo: getTransactionToRaw(state)
  }),
  { setCurrentTo }
)(AddressFieldDropdown);
