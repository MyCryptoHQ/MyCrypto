import React, { Component } from 'react';
import ERC20 from 'libs/erc20';
import { Identicon } from 'components/ui';
import arrow from 'assets/images/tail-triangle-down.svg';
import './Addresses.scss';
import { ETHAddressExplorer } from 'config';
import { connect } from 'react-redux';
import { SerializedTransaction } from 'components/renderCbs';
import { AppState } from 'reducers';
import { getFrom, getUnit, isEtherTransaction } from 'selectors/transaction';
import translate from 'translations';
import { toChecksumAddressByChainId } from 'libs/checksum';
import { NetworkConfig } from 'types/network';
import { getNetworkConfig } from 'selectors/config';

interface StateProps {
  from: AppState['transaction']['meta']['from'];
  unit: AppState['transaction']['meta']['unit'];
  isToken: boolean;
  network: NetworkConfig;
}

const size = '3rem';

class AddressesClass extends Component<StateProps> {
  public render() {
    const { from, isToken, unit, network } = this.props;
    return (
      <SerializedTransaction
        withSerializedTransaction={(_, { to, data }) => {
          const toFormatted = toChecksumAddressByChainId(
            isToken ? ERC20.transfer.decodeInput(data)._to : to,
            network.chainId
          );
          return (
            <div className="tx-modal-address">
              <div className="tx-modal-address-from">
                {from && (
                  <React.Fragment>
                    <Identicon
                      className="tx-modal-address-from-icon"
                      size={size}
                      address={from}
                      network={network}
                    />
                    <div className="tx-modal-address-from-content">
                      <h5 className="tx-modal-address-from-title">
                        {translate('CONFIRM_TX_FROM')}{' '}
                      </h5>
                      <h5 className="tx-modal-address-from-address small">
                        {toChecksumAddressByChainId(from, network.chainId)}
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
                      href={ETHAddressExplorer(to)}
                    >
                      {toChecksumAddressByChainId(to, network.chainId)}
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
                      network={network}
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
  from: getFrom(state),
  isToken: !isEtherTransaction(state),
  unit: getUnit(state),
  network: getNetworkConfig(state)
});

export const Addresses = connect(mapStateToProps)(AddressesClass);
