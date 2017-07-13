// @flow

import React from 'react';
import PropTypes from 'prop-types';
import translate from 'translations';
import { UnlockHeader } from 'components/ui';
import {
  Donate,
  DataField,
  CustomMessage,
  GasField,
  AmountField,
  AddressField
} from './components';
import { BalanceSidebar } from 'components';
import pickBy from 'lodash/pickBy';
import type { State as AppState } from 'reducers';
import { connect } from 'react-redux';
import BaseWallet from 'libs/wallet/base';
// import type { Transaction } from './types';
import customMessages from './messages';
import { donationAddressMap } from 'config/data';
import Big from 'big.js';

type State = {
  hasQueryString: boolean,
  readOnly: boolean,
  to: string,
  value: string,
  unit: string,
  gasLimit: string,
  data: string,
  gasChanged: boolean
};

function getParam(query: { [string]: string }, key: string) {
  const keys = Object.keys(query);
  const index = keys.findIndex(k => k.toLowerCase() === key.toLowerCase());
  if (index === -1) {
    return null;
  }

  return query[keys[index]];
}

// TODO query string
// TODO how to handle DATA?

export class SendTransaction extends React.Component {
  props: {
    location: {
      query: {
        [string]: string
      }
    },
    wallet: BaseWallet,
    balance: Big
  };
  state: State = {
    hasQueryString: false,
    readOnly: false,
    // FIXME use correct defaults
    to: '',
    value: '999.11',
    unit: 'ether',
    gasLimit: '21000',
    data: '',
    gasChanged: false
  };

  componentDidMount() {
    const queryPresets = pickBy(this.parseQuery());
    if (Object.keys(queryPresets).length) {
      this.setState({ ...queryPresets, hasQueryString: true });
    }
  }

  render() {
    const unlocked = !!this.props.wallet;
    const unitReadable = 'UNITREADABLE';
    const nodeUnit = 'NODEUNIT';
    const hasEnoughBalance = false;
    const { to, value, unit, gasLimit, data, readOnly, hasQueryString } = this.state;
    const customMessage = customMessages.find(m => m.to === to);

    // tokens
    // ng-show="token.balance!=0 && token.balance!='loading' || token.type!=='default' || tokenVisibility=='shown'"

    return (
      <section className="container" style={{ minHeight: '50%' }}>
        <div className="tab-content">
          <main className="tab-pane active">
            {hasQueryString &&
              <div className="alert alert-info">
                <p>
                  {translate('WARN_Send_Link')}
                </p>
              </div>}

            <UnlockHeader title={'NAV_SendEther'} />

            {unlocked &&
              <article className="row">
                {'' /* <!-- Sidebar --> */}
                <section className="col-sm-4">
                  <div style={{ maxWidth: 350 }}>
                    <BalanceSidebar />
                    <hr />
                    <Donate onDonate={this.onNewTx} />
                  </div>
                </section>

                <section className="col-sm-8">
                  {readOnly &&
                    !hasEnoughBalance &&
                    <div className="row form-group">
                      <div className="alert alert-danger col-xs-12 clearfix">
                        <strong>
                          Warning! You do not have enough funds to complete this swap.
                        </strong>
                        <br />
                        Please add more funds or access a different wallet.
                      </div>
                    </div>}

                  <div className="row form-group">
                    <h4 className="col-xs-12">
                      {translate('SEND_trans')}
                    </h4>
                  </div>
                  <AddressField
                    placeholder={donationAddressMap.ETH}
                    value={this.state.to}
                    onChange={readOnly ? null : this.onAddressChange}
                  />
                  <AmountField
                    value={value}
                    unit={unit}
                    onChange={readOnly ? void 0 : this.onAmountChange}
                  />
                  <GasField value={gasLimit} onChange={readOnly ? void 0 : this.onGasChange} />
                  {unit === 'ether' &&
                    <DataField value={data} onChange={readOnly ? void 0 : this.onDataChange} />}
                  <CustomMessage message={customMessage} />

                  <div className="row form-group">
                    <div className="col-xs-12 clearfix">
                      <a className="btn btn-info btn-block" onClick={this.generateTx}>
                        {translate('SEND_generate')}
                      </a>
                    </div>
                  </div>

                  <div className="row form-group">
                    <div className="col-sm-6">
                      <label>
                        {translate('SEND_raw')}
                      </label>
                      <textarea className="form-control" rows="4" readOnly>
                        {'' /*rawTx*/}
                      </textarea>
                    </div>
                    <div className="col-sm-6">
                      <label>
                        {translate('SEND_signed')}
                      </label>
                      <textarea className="form-control" rows="4" readOnly>
                        {'' /*signedTx*/}
                      </textarea>
                    </div>
                  </div>

                  <div className="form-group">
                    <a
                      className="btn btn-primary btn-block col-sm-11"
                      data-toggle="modal"
                      data-target="#sendTransaction"
                    >
                      {translate('SEND_trans')}
                    </a>
                  </div>
                </section>
                {'' /* <!-- / Content --> */}
                {
                  '' /* @@if (site === 'mew' ) { @@include( './sendTx-content.tpl', { "site": "mew" } ) }
            @@if (site === 'cx'  ) { @@include( './sendTx-content.tpl', { "site": "cx"  } ) }

            @@if (site === 'mew' ) { @@include( './sendTx-modal.tpl',   { "site": "mew" } ) }
            @@if (site === 'cx'  ) { @@include( './sendTx-modal.tpl',   { "site": "cx"  } ) } */
                }
              </article>}
          </main>
        </div>
      </section>
    );
  }

  parseQuery() {
    const query = this.props.location.query;
    const to = getParam(query, 'to');
    const data = getParam(query, 'data');
    // FIXME validate token against presets
    const unit = getParam(query, 'tokenSymbol');
    const value = getParam(query, 'value');
    let gasLimit = getParam(query, 'gas');
    if (gasLimit === null) {
      gasLimit = getParam(query, 'limit');
    }
    const readOnly = getParam(query, 'readOnly') == null ? false : true;

    return { to, data, value, unit, gasLimit, readOnly };
  }

  // FIXME use mkTx instead or something that could take care of default gas/data and whatnot,
  // FIXME also should it reset gasChanged?
  onNewTx = (
    address: string,
    amount: string,
    unit: string,
    data: string = '',
    gasLimit: string = '21000'
  ) => {
    this.setState({
      to: address,
      value: amount,
      unit,
      data,
      gasLimit,
      gasChanged: false
    });
  };

  onAddressChange = (value: string) => {
    this.setState({
      to: value
    });
  };

  onDataChange = (value: string) => {
    if (this.state.unit !== 'ether') {
      return;
    }
    this.setState({
      ...this.state,
      data: value
    });
  };

  onGasChange = (value: string) => {
    this.setState({ gasLimit: value, gasChanged: true });
  };

  onAmountChange = (value: string, unit: string) => {
    // TODO: tokens
    if (value === 'everything') {
      value = this.props.balance.toString();
    }
    this.setState({
      value,
      unit
    });
  };
}

function mapStateToProps(state: AppState) {
  return {
    wallet: state.wallet.inst,
    balance: state.wallet.balance
  };
}

export default connect(mapStateToProps)(SendTransaction);
