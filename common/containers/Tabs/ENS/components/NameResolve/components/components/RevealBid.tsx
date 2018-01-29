import React, { Component } from 'react';
import { UnitConverter, Props as UCProps } from 'components/renderCbs';
import { Wei } from 'libs/units';
import classnames from 'classnames';
import { IBaseDomainRequest } from 'libs/ens';

interface State {
  bidValue: Wei;
  maskValue: Wei;
}

interface BidProps {
  name: string;
  label: string;
  description: string;
  symbol?: string;
  children;
}

const BidFormGroup: React.SFC<BidProps> = ({ children, description, label, name, symbol }) => (
  <section className="row form-group">
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

interface Props1 {
  onChange: UCProps['onChange'];
}

const EthereumUnitInput: React.SFC<Props1> = props => (
  <UnitConverter onChange={props.onChange}>
    {({ convertedUnit, onUserInput }) => {
      const validInput = isFinite(+convertedUnit) && +convertedUnit > 0;
      return (
        <input
          className={classnames('form-control', validInput ? 'is-valid' : 'is-invalid')}
          value={convertedUnit}
          onChange={onUserInput}
        />
      );
    }}
  </UnitConverter>
);
interface Props extends IBaseDomainRequest {
  title: string;
  buttonName: string;
}
export class RevealBid extends Component<Props, State> {
  public render() {
    return (
      <div className="Tab-content-pane row text-left">
        <h2>{this.props.title}</h2>
        <BidFormGroup description="" label="Name" name="ensName" symbol=".eth">
          <input className="form-control" value={this.props.name} readOnly={true} />
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
          description="You must remember this to claim your name later (feel free to change this)"
          label="Secret Phrase"
          name="secretPhase"
        >
          <input
            className="form-control"
            value={'Placeholder here'}
            onChange={this.setField('secretPhrase')}
          />
        </BidFormGroup>
        <button className="btn btn-primary col-xs-12">{this.props.buttonName}</button>
      </div>
    );
  }

  private setField = (field: string) => (e: React.FormEvent<HTMLInputElement>) =>
    this.setState({ [field as any]: e.currentTarget.value });
}
