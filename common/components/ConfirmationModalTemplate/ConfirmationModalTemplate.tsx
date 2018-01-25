import Modal, { IButton } from 'components/ui/Modal';
import Spinner from 'components/ui/Spinner';
import React from 'react';
import { connect } from 'react-redux';
import { getWalletType, IWalletType } from 'selectors/wallet';
import { getLanguageSelection } from 'selectors/config';
import {
  broadcastLocalTransactionRequested,
  TBroadcastLocalTransactionRequested,
  broadcastWeb3TransactionRequested,
  TBroadcastWeb3TransactionRequested
} from 'actions/transaction';
import {
  currentTransactionBroadcasting,
  currentTransactionBroadcasted,
  currentTransactionFailed
} from 'selectors/transaction';
import translate, { translateRaw } from 'translations';
import './ConfirmationModalTemplate.scss';
import { AppState } from 'reducers';

interface DispatchProps {
  broadcastLocalTransactionRequested: TBroadcastLocalTransactionRequested;
  broadcastWeb3TransactionRequested: TBroadcastWeb3TransactionRequested;
}

interface StateProps {
  lang: string;
  walletTypes: IWalletType;
  transactionBroadcasting: boolean;
  transactionBroadcasted: boolean;
  transactionFailed: boolean;
}

export interface ConfirmButtonCBProps {
  type: IButton['type'];
  timeLocked: boolean;
  timeLeft: number;
  timePrefix: string;
  defaultText: string;
  onConfirm: ConfirmationModalTemplateClass['confirm'];
}

export interface OwnProps {
  summary: React.ReactElement<any> | null;
  details: React.ReactElement<any> | null;
  withConfirmButton?(props: ConfirmButtonCBProps): IButton;
  onClose(): void;
}
interface State {
  retryingFailedBroadcast: boolean;
  timeToRead: number;
}

type Props = DispatchProps & StateProps & OwnProps;

class ConfirmationModalTemplateClass extends React.Component<Props, State> {
  private readTimer = 0;
  public constructor(props: Props) {
    super(props);
    const { transactionFailed } = props;
    this.state = {
      timeToRead: 5,
      retryingFailedBroadcast: transactionFailed
    };
  }

  public componentDidUpdate() {
    if (this.props.transactionBroadcasted && !this.state.retryingFailedBroadcast) {
      this.props.onClose();
    }
  }

  // Count down 5 seconds before allowing them to confirm
  public componentDidMount() {
    this.readTimer = window.setInterval(() => {
      if (this.state.timeToRead > 0) {
        this.setState({ timeToRead: this.state.timeToRead - 1 });
      } else {
        window.clearInterval(this.readTimer);
      }
    }, 1000);
  }

  public render() {
    const { onClose, transactionBroadcasting } = this.props;
    const { timeToRead } = this.state;
    const buttonPrefix = timeToRead > 0 ? `(${timeToRead}) ` : '';
    const defaultConfirmButton = {
      text: buttonPrefix + translateRaw('SENDModal_Yes'),
      type: 'primary' as IButton['type'],
      disabled: timeToRead > 0,
      onClick: this.confirm
    };

    const confirmButton: IButton = this.props.withConfirmButton
      ? this.props.withConfirmButton({
          onConfirm: defaultConfirmButton.onClick,
          timeLeft: timeToRead,
          timePrefix: buttonPrefix,
          timeLocked: defaultConfirmButton.disabled,
          defaultText: translateRaw('SENDModal_Yes'),
          type: defaultConfirmButton.type
        })
      : defaultConfirmButton;

    const buttons: IButton[] = [
      confirmButton,
      {
        text: translateRaw('SENDModal_No'),
        type: 'default',
        onClick: onClose
      }
    ];

    return (
      <div className="ConfModalWrap">
        <Modal
          title="Confirm Your Transaction"
          buttons={buttons}
          handleClose={onClose}
          disableButtons={transactionBroadcasting}
          isOpen={true}
        >
          <div className="ConfModal">
            {transactionBroadcasting ? (
              <div className="ConfModal-loading">
                <Spinner size="x5" />
              </div>
            ) : (
              <div>
                {this.props.summary}
                {this.props.details}
                <div className="ConfModal-confirm">{translate('SENDModal_Content_3')}</div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    );
  }

  public componentWillUnmount() {
    window.clearInterval(this.readTimer);
  }

  private confirm = () => {
    if (this.state.timeToRead < 1) {
      this.props.walletTypes.isWeb3Wallet
        ? this.props.broadcastWeb3TransactionRequested()
        : this.props.broadcastLocalTransactionRequested();
      this.setState({ retryingFailedBroadcast: false });
    }
  };
}

export const ConfirmationModalTemplate = connect(
  (state: AppState) => ({
    transactionBroadcasting: currentTransactionBroadcasting(state),
    transactionBroadcasted: currentTransactionBroadcasted(state),
    transactionFailed: currentTransactionFailed(state),
    lang: getLanguageSelection(state),
    walletTypes: getWalletType(state)
  }),
  { broadcastLocalTransactionRequested, broadcastWeb3TransactionRequested }
)(ConfirmationModalTemplateClass);
