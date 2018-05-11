import React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import translate from 'translations';
import { IWallet } from 'libs/wallet';
import { QRCode, CodeBlock } from 'components/ui';
import { getUnit, getDecimal } from 'selectors/transaction/meta';
import {
  getCurrentTo,
  getCurrentValue,
  ICurrentTo,
  ICurrentValue
} from 'selectors/transaction/current';
import BN from 'bn.js';
import { validPositiveNumber, validDecimal } from 'libs/validators';
import { getGasLimit } from 'selectors/transaction';
import { AddressField, AmountField, TXMetaDataPanel } from 'components';
import { SetGasLimitFieldAction } from 'actions/transaction/actionTypes/fields';
import { buildEIP681EtherRequest, buildEIP681TokenRequest } from 'libs/values';
import { getNetworkConfig, getSelectedTokenContractAddress, isNetworkUnit } from 'selectors/config';
import './RequestPayment.scss';
import {
  resetTransactionRequested,
  TResetTransactionRequested,
  setCurrentTo,
  TSetCurrentTo
} from 'actions/transaction';
import { NetworkConfig } from 'types/network';

interface OwnProps {
  wallet: AppState['wallet']['inst'];
}

interface StateProps {
  unit: string;
  currentTo: ICurrentTo;
  currentValue: ICurrentValue;
  gasLimit: SetGasLimitFieldAction['payload'];
  networkConfig: NetworkConfig;
  decimal: number;
  tokenContractAddress: string;
  isNetworkUnit: boolean;
}

interface ActionProps {
  resetTransactionRequested: TResetTransactionRequested;
  setCurrentTo: TSetCurrentTo;
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
              />
            </div>
          </div>

          <div className="row form-group">
            <div className="col-xs-12">
              <TXMetaDataPanel
                initialState="advanced"
                disableToggle={true}
                advancedGasOptions={{
                  gasPriceField: false,
                  nonceField: false,
                  dataField: false,
                  feeSummary: false
                }}
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
    unit: getUnit(state),
    currentTo: getCurrentTo(state),
    currentValue: getCurrentValue(state),
    gasLimit: getGasLimit(state),
    networkConfig: getNetworkConfig(state),
    decimal: getDecimal(state),
    tokenContractAddress: getSelectedTokenContractAddress(state),
    isNetworkUnit: isNetworkUnit(state, getUnit(state))
  };
}

export default connect(mapStateToProps, { resetTransactionRequested, setCurrentTo })(
  RequestPayment
);
