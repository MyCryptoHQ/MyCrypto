import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ETHAddressExplorer } from 'config';
import translate from 'translations';
import ERC20 from 'libs/erc20';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';
import { scheduleSelectors } from 'features/schedule';
import { configSelectors } from 'features/config';
import arrow from 'assets/images/tail-triangle-down.svg';
import { SerializedTransaction } from 'components/renderCbs';
import { Identicon } from 'components/ui';
import './Addresses.scss';
import Scheduler from 'libs/scheduling/contracts/Scheduler';
import { bufferToHex } from 'ethereumjs-util';

interface StateProps {
  from: ReturnType<typeof selectors.getFrom>;
  unit: ReturnType<typeof selectors.getUnit>;
  isToken: boolean;
  isSchedulingEnabled: boolean;
  toChecksumAddress: ReturnType<typeof configSelectors.getChecksumAddressFn>;
}

const size = '3rem';

class AddressesClass extends Component<StateProps> {
  public render() {
    const { from, isSchedulingEnabled, isToken, unit, toChecksumAddress } = this.props;

    return (
      <SerializedTransaction
        withSerializedTransaction={(_, { to, data }) => {
          let toFormatted = '';
          let tokenAddress = to;

          if (isSchedulingEnabled) {
            if (isToken) {
              const scheduledTxParams = Scheduler.schedule.decodeInput(data);
              const scheduledTxCallData = bufferToHex(scheduledTxParams._callData as Buffer);

              toFormatted = ERC20.transferFrom.decodeInput(scheduledTxCallData)._to;
              tokenAddress = scheduledTxParams._toAddress;
            } else {
              toFormatted = toChecksumAddress(to);
            }
          } else {
            toFormatted = toChecksumAddress(isToken ? ERC20.transfer.decodeInput(data)._to : to);
          }

          return (
            <div className="tx-modal-address">
              <div className="tx-modal-address-from">
                {from && (
                  <React.Fragment>
                    <Identicon className="tx-modal-address-from-icon" size={size} address={from} />
                    <div className="tx-modal-address-from-content">
                      <h5 className="tx-modal-address-from-title">
                        {translate('CONFIRM_TX_FROM')}{' '}
                      </h5>
                      <h5 className="tx-modal-address-from-address small">
                        {toChecksumAddress(from)}
                      </h5>
                    </div>
                  </React.Fragment>
                )}
              </div>
              {isToken && (
                <div className="tx-modal-address-tkn-contract">
                  <div className="tx-modal-address-tkn-contract-icon">
                    <img src={arrow} alt="arrow" />
                  </div>
                  <div className="tx-modal-address-tkn-contract-content">
                    <p className="tx-modal-address-tkn-contract-title">
                      {translate('CONFIRM_TX_VIA_CONTRACT', {
                        $unit: unit
                      })}
                    </p>
                    <a
                      className="small tx-modal-address-tkn-contract-link"
                      href={ETHAddressExplorer(tokenAddress)}
                    >
                      {toChecksumAddress(tokenAddress)}
                    </a>
                  </div>
                </div>
              )}
              <div className="tx-modal-address-to">
                {to && (
                  <React.Fragment>
                    <Identicon
                      className="tx-modal-address-from-icon"
                      size={size}
                      address={toFormatted}
                    />
                    <div className="tx-modal-address-to-content">
                      <h5 className="tx-modal-address-to-title">{translate('CONFIRM_TX_TO')} </h5>
                      <h5 className="small tx-modal-address-to-address">{toFormatted}</h5>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          );
        }}
      />
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  from: selectors.getFrom(state),
  isToken: !selectors.isEtherTransaction(state),
  unit: selectors.getUnit(state),
  toChecksumAddress: configSelectors.getChecksumAddressFn(state),
  isSchedulingEnabled: scheduleSelectors.isSchedulingEnabled(state)
});

export const Addresses = connect(mapStateToProps)(AddressesClass);
