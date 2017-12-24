import React, { Component } from 'react';
import { UnitConverter, Props as UCProps } from 'components/renderCbs';
import classnames from 'classnames';
import { IBaseDomainRequest } from 'libs/ens';
import { TShowNotification, showNotification } from 'actions/notifications';
import BidModal from '../modals/BidModal';
import { connect } from 'react-redux';

interface DispatchProps {
  showNotification: TShowNotification;
}

interface BidProps {
  name: string;
  label: string;
  description: string;
  symbol?: string;
  children;
}

const BidFormGroup: React.SFC<BidProps> = ({ children, description, label, name, symbol }) => (
  <section className="form-group">
    <label htmlFor={name}>{label}</label>
    <em className="col-xs-12">
      <small>{description}</small>
    </em>
    <section className="input-group col-xs-12" id={name}>
      {children}
      {symbol && (
        <div className="input-group-btn">
          <a className="btn btn-default">{symbol}</a>
        </div>
      )}
    </section>
  </section>
);

interface UnitInputProps {
  onChange: UCProps['onChange'];
}

const EthereumUnitInput: React.SFC<UnitInputProps> = props => (
  <UnitConverter onChange={props.onChange}>
    {({ convertedUnit, onUserInput }) => {
      const validInput = isFinite(+convertedUnit) && +convertedUnit > 0;
      return (
        <input
          type="number"
          className={classnames('form-control', validInput ? 'is-valid' : 'is-invalid')}
          value={convertedUnit}
          onChange={onUserInput}
          placeholder="1.0"
        />
      );
    }}
  </UnitConverter>
);

interface PlaceBidProps extends IBaseDomainRequest {
  title: string;
  buttonName: string;
}

interface State {
  [name: string]: any;
}

class PlaceBid extends Component<PlaceBidProps & DispatchProps, State> {
  public state = {
    openModal: false,
    bidValue: 0,
    maskValue: 0,
    secretPhrase: ''
  };

  public toggleModal = () => {
    const { bidValue, maskValue } = this.state;
    if (maskValue > bidValue) {
      this.setState({ openModal: !this.state.openModal });
    } else {
      this.props.showNotification('danger', 'Bid Mask must be greater than Bid Value', 5000);
    }
  };

  public render() {
    const { openModal } = this.state;
    const { name } = this.props;
    return (
      <div className="Tab-content-pane row text-left">
        <h2>{this.props.title}</h2>
        <BidFormGroup description="" label="Name" name="ensName" symbol=".eth">
          <input className="form-control" value={name} readOnly={true} />
        </BidFormGroup>
        <BidFormGroup
          description="You must remember this to claim your name later."
          label="Actual Bid Amount"
          name="bidValue"
          symbol="ETH"
        >
          <EthereumUnitInput onChange={this.setField('bidValue')} />
        </BidFormGroup>
        <BidFormGroup
          description={
            'This is the amount of ETH you send when placing your bid. \
          It has no bearing on the *actual* amount you bid (above). It is simply to \
          hide your real bid amount. It must be >= to your actual bid.'
          }
          label="Bid Mask"
          name="bidMask"
          symbol="ETH"
        >
          <EthereumUnitInput onChange={this.setField('maskValue')} />
        </BidFormGroup>
        <BidFormGroup
          description="You must remember this to claim your name later (feel free to change this)"
          label="Secret Phrase"
          name="secretPhase"
        >
          <input
            type="text"
            className="form-control"
            value={'Placeholder here'}
            onChange={this.setField('secretPhrase')}
          />
        </BidFormGroup>
        <button className="btn btn-primary col-xs-12" onClick={this.toggleModal}>
          {this.props.buttonName}
        </button>

        {/* TODO: generate the signed transaction in the bid modal so you can open the modal and show a spinner in the mean time */}
        {openModal && <BidModal name={name} toggle={this.toggleModal} />}
      </div>
    );
  }

  private setField = (field: string) => (e: React.FormEvent<HTMLInputElement>) =>
    this.setState({ [field as any]: e.currentTarget.value });
}

export default connect(null, {
  showNotification
})(PlaceBid);
