import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { placeBidRequested, TPlaceBidRequested } from 'actions/ens';
import { GenerateTransactionFactory, CallbackProps } from 'components/GenerateTransactionFactory';
import { getBidDataEncoded, getSecret, getBidMask, getBidValue } from 'selectors/ens';

interface OwnProps {
  disabled?: boolean;
  generateTransaction(): void;
}

interface StateProps {
  bidDataEncoded: boolean;
  bidValue: string;
  bidMask: string;
  secret: string;
}

interface DispatchProps {
  placeBidRequested: TPlaceBidRequested;
}

type Props = OwnProps & DispatchProps & StateProps & CallbackProps;

enum GenerationStage {
  WAITING_ON_USER_INPUT = 'WAITING_ON_USER_INPUT',
  ENCODING_BID_DATA = 'ENCODING_BID_DATA',
  READY_TO_GENERATE_TRANSACTION = 'READY_TO_GENERATE_TRANSACTION',
  GENERATION_IN_PROGRESS = 'GENERATION_IN_PROGRESS'
}

interface State {
  stage: GenerationStage;
}

class GenerateBidClass extends Component<Props, State> {
  public state: State = {
    stage: GenerationStage.WAITING_ON_USER_INPUT
  };

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.bidDataEncoded) {
      this.setState({ stage: GenerationStage.READY_TO_GENERATE_TRANSACTION });
      this.props.generateTransaction();
    }
  }

  public handleOnClick = () => {
    const { bidMask, bidValue, secret } = this.props;
    this.props.placeBidRequested(bidValue, bidMask, secret);
    this.setState({ stage: GenerationStage.ENCODING_BID_DATA });
  };

  public render() {
    const { disabled } = this.props;
    return (
      <button
        className="btn btn-info btn-block"
        onClick={this.handleOnClick}
        disabled={disabled || this.state.stage === GenerationStage.READY_TO_GENERATE_TRANSACTION}
      >
        Place A Bid
      </button>
    );
  }
}

const GenerateBidX = connect(
  (state: AppState) => ({
    bidDataEncoded: getBidDataEncoded(state),
    bidValue: getBidValue(state),
    bidMask: getBidMask(state),
    secret: getSecret(state)
  }),
  {
    placeBidRequested
  }
)(GenerateBidClass);

export const GenerateBid: React.SFC<OwnProps> = props => (
  <GenerateTransactionFactory
    withProps={cbProps => <GenerateBidX {...{ ...props, ...cbProps }} />}
  />
);
