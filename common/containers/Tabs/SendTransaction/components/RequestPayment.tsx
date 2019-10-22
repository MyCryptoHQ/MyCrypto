import React from 'react';
import { connect } from 'react-redux';
import BN from 'bn.js';

import translate from 'translations';
import { IWallet } from 'libs/wallet';
import { validPositiveNumber, validDecimal } from 'libs/validators';
import { buildEIP681EtherRequest, buildEIP681TokenRequest } from 'libs/values';
import { ICurrentTo, ICurrentValue } from 'features/types';
import { AppState } from 'features/reducers';
import * as derivedSelectors from 'features/selectors';
import { configSelectors } from 'features/config';
import {
  transactionFieldsTypes,
  transactionFieldsActions,
  transactionFieldsSelectors,
  transactionMetaSelectors,
  transactionActions
} from 'features/transaction';
import { AddressField, AmountField } from 'components';
import { QRCode, CodeBlock } from 'components/ui';
import { NetworkConfig } from 'types/network';
import './RequestPayment.scss';

interface OwnProps {
  wallet: AppState['wallet']['inst'];
}

interface StateProps {
  unit: string;
  currentTo: ICurrentTo;
  currentValue: ICurrentValue;
  gasLimit: transactionFieldsTypes.SetGasLimitFieldAction['payload'];
  networkConfig: NetworkConfig;
  decimal: number;
  tokenContractAddress: string;
  isNetworkUnit: boolean;
}

interface ActionProps {
  resetTransactionRequested: transactionFieldsActions.TResetTransactionRequested;
  setCurrentTo: transactionActions.TSetCurrentTo;
}

type Props = OwnProps & StateProps & ActionProps;

const isValidAmount = (decimal: number) => (amount: string) =>
  validPositiveNumber(+amount) && validDecimal(amount, decimal);

class RequestPayment extends React.Component<Props, {}> {
  public state = {
    recipientAddress: ''
  };

  public componentDidMount() {
    this.props.resetTransactionRequested();
    if (this.props.wallet) {
      this.setWalletAsyncState(this.props.wallet);
    }
  }

  public componentWillUnmount() {
    this.props.resetTransactionRequested();
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.wallet && this.props.wallet !== nextProps.wallet) {
      this.setWalletAsyncState(nextProps.wallet);
    }
  }

  public render() {
    const {
      tokenContractAddress,
      gasLimit,
      currentTo,
      currentValue,
      networkConfig,
      unit,
      decimal
    } = this.props;
    const chainId = networkConfig ? networkConfig.chainId : undefined;

    const eip681String = this.generateEIP681String(
      currentTo.raw,
      tokenContractAddress,
      currentValue,
      gasLimit,
      unit,
      decimal,
      chainId
    );

    return (
      <div className="RequestPayment">
        <div className="Tab-content-pane">
          <AddressField isReadOnly={true} isCheckSummed={true} />

          <div className="row form-group">
            <div className="col-xs-12">
              <AmountField
                hasUnitDropdown={true}
                showAllTokens={true}
                customValidator={isValidAmount(decimal)}
                showInvalidWithoutValue={true}
              />
            </div>
          </div>

          {!!eip681String.length && (
            <div className="row form-group">
              <label className="RequestPayment-title">
                {translate('REQUEST_PAYMENT_QR_TITLE')}
              </label>
              <div className="col-xs-6">
                <div className="RequestPayment-qr well well-lg">
                  <QRCode data={eip681String} />
                </div>
              </div>
              <div className="col-xs-6 RequestPayment-codeContainer">
                <CodeBlock className="wrap">{eip681String}</CodeBlock>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  private setWalletAsyncState(wallet: IWallet) {
    this.props.setCurrentTo(wallet.getAddressString());
  }

  private generateEIP681String(
    currentTo: string,
    tokenContractAddress: string,
    currentValue: { raw: string; value: BN | null },
    gasLimit: { raw: string; value: BN | null },
    unit: string,
    decimal: number,
    chainId?: number
  ) {
    if (
      !isValidAmount(decimal)(currentValue.raw) ||
      !chainId ||
      !gasLimit ||
      !gasLimit.raw.length ||
      !currentTo.length ||
      (unit !== 'ETH' && !tokenContractAddress.length)
    ) {
      return '';
    }

    const currentValueIsEther = (
      _: AppState['transaction']['fields']['value'] | AppState['transaction']['meta']['tokenTo']
    ): _ is AppState['transaction']['fields']['value'] => this.props.isNetworkUnit;

    if (currentValueIsEther(currentValue)) {
      return buildEIP681EtherRequest(currentTo, chainId, currentValue);
    } else {
      return buildEIP681TokenRequest(
        currentTo,
        tokenContractAddress,
        chainId,
        currentValue,
        decimal,
        gasLimit
      );
    }
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    unit: derivedSelectors.getUnit(state),
    currentTo: derivedSelectors.getCurrentTo(state),
    currentValue: derivedSelectors.getCurrentValue(state),
    gasLimit: transactionFieldsSelectors.getGasLimit(state),
    networkConfig: configSelectors.getNetworkConfig(state),
    decimal: transactionMetaSelectors.getDecimal(state),
    tokenContractAddress: derivedSelectors.getSelectedTokenContractAddress(state),
    isNetworkUnit: configSelectors.isNetworkUnit(state, derivedSelectors.getUnit(state))
  };
}

export default connect(
  mapStateToProps,
  {
    resetTransactionRequested: transactionFieldsActions.resetTransactionRequested,
    setCurrentTo: transactionActions.setCurrentTo
  }
)(RequestPayment);
