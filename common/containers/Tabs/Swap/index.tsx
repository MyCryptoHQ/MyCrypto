import React, { Component } from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { merge } from 'lodash';

import shapeshift from 'api/shapeshift';
import { AppState } from 'features/reducers';
import { configMetaSelectors } from 'features/config';
import { notificationsActions } from 'features/notifications';
import { swapTypes, swapActions } from 'features/swap';
import TabSection from 'containers/TabSection';
import { RouteNotFound } from 'components/RouteNotFound';
import CurrencySwap from './components/CurrencySwap';
import CurrentRates from './components/CurrentRates';
import PartThree from './components/PartThree';
import SupportFooter from './components/SupportFooter';
import ReceivingAddress from './components/ReceivingAddress';
import SwapInfoHeader from './components/SwapInfoHeader';

interface ReduxStateProps {
  step: number;
  origin: swapTypes.SwapInput;
  destination: swapTypes.SwapInput;
  bityRates: swapTypes.NormalizedBityRates;
  shapeshiftRates: swapTypes.NormalizedShapeshiftRates;
  options: swapTypes.NormalizedOptions;
  provider: swapTypes.ProviderName;
  bityOrder: any;
  shapeshiftOrder: any;
  destinationAddress: string;
  isFetchingRates: boolean | null;
  secondsRemaining: number | null;
  outputTx: string | null;
  isPostingOrder: boolean;
  bityOrderStatus: string | null;
  shapeshiftOrderStatus: string | null;
  paymentAddress: string | null;
  paymentId: string | null;
  xmrPaymentAddress: string | null;
  isOffline: boolean;
}

interface ReduxActionProps {
  changeStepSwap: swapActions.TChangeStepSwap;
  destinationAddressSwap: swapActions.TDestinationAddressSwap;
  restartSwap: swapActions.TRestartSwap;
  stopLoadBityRatesSwap: swapActions.TStopLoadBityRatesSwap;
  stopLoadShapeshiftRatesSwap: swapActions.TStopLoadShapeshiftRatesSwap;
  shapeshiftOrderCreateRequestedSwap: swapActions.TShapeshiftOrderCreateRequestedSwap;
  bityOrderCreateRequestedSwap: swapActions.TBityOrderCreateRequestedSwap;
  startPollShapeshiftOrderStatus: swapActions.TStartPollShapeshiftOrderStatus;
  startPollBityOrderStatus: swapActions.TStartPollBityOrderStatus;
  startOrderTimerSwap: swapActions.TStartOrderTimerSwap;
  stopOrderTimerSwap: swapActions.TStopOrderTimerSwap;
  stopPollBityOrderStatus: swapActions.TStopPollBityOrderStatus;
  stopPollShapeshiftOrderStatus: swapActions.TStopPollShapeshiftOrderStatus;
  showNotification: notificationsActions.TShowNotification;
  showNotificationWithComponent: notificationsActions.TShowNotificationWithComponent;
  initSwap: swapActions.TInitSwap;
  swapProvider: swapActions.TChangeSwapProvider;
}

class Swap extends Component<ReduxActionProps & ReduxStateProps & RouteComponentProps<{}>, {}> {
  public state = {
    authorized: shapeshift.hasToken(),
    authorizing: false
  };

  private pollingForAccessTokenAvailable: NodeJS.Timer | null = null;
  private pollingForAccessTokenStillAvailable: NodeJS.Timer | null = null;

  public componentDidMount() {
    const { authorized } = this.state;

    if (shapeshift.urlHasCodeParam()) {
      this.requestAccessToken();
    } else if (authorized) {
      this.pollForAccessTokenStillAvailable();
    }
  }

  public componentWillUnmount() {
    clearInterval(this.pollingForAccessTokenAvailable as NodeJS.Timer);
    clearInterval(this.pollingForAccessTokenStillAvailable as NodeJS.Timer);
  }

  public render() {
    const {
      // STATE
      bityRates,
      shapeshiftRates,
      provider,
      options,
      origin,
      destination,
      destinationAddress,
      step,
      bityOrder,
      shapeshiftOrder,
      secondsRemaining,
      paymentAddress,
      bityOrderStatus,
      shapeshiftOrderStatus,
      isPostingOrder,
      outputTx,
      paymentId,
      xmrPaymentAddress,
      // ACTIONS
      initSwap,
      restartSwap,
      stopLoadBityRatesSwap,
      changeStepSwap,
      destinationAddressSwap,
      bityOrderCreateRequestedSwap,
      shapeshiftOrderCreateRequestedSwap,
      showNotification,
      showNotificationWithComponent,
      startOrderTimerSwap,
      startPollBityOrderStatus,
      stopPollShapeshiftOrderStatus,
      startPollShapeshiftOrderStatus,
      stopOrderTimerSwap,
      stopPollBityOrderStatus,
      swapProvider
    } = this.props;
    const { authorized, authorizing } = this.state;

    const currentPath = this.props.match.url;

    const reference = provider === 'shapeshift' ? shapeshiftOrder.orderId : bityOrder.reference;

    const ReceivingAddressProps = {
      isPostingOrder,
      origin,
      destinationId: destination.label,
      destinationKind: destination.amount as number,
      destinationAddressSwap,
      destinationAddress,
      stopLoadBityRatesSwap,
      changeStepSwap,
      provider,
      bityOrderCreateRequestedSwap,
      shapeshiftOrderCreateRequestedSwap
    };

    const SwapInfoHeaderProps = {
      origin,
      destination,
      reference,
      secondsRemaining,
      restartSwap,
      bityOrderStatus,
      shapeshiftOrderStatus,
      provider
    };

    const CurrencySwapProps = {
      showNotification,
      bityRates,
      shapeshiftRates,
      provider,
      options,
      initSwap,
      swapProvider,
      changeStepSwap
    };

    const paymentInfo =
      provider === 'shapeshift'
        ? merge(origin, { amount: shapeshiftOrder.depositAmount })
        : merge(origin, { amount: bityOrder.amount });

    const PaymentInfoProps = {
      origin: paymentInfo,
      paymentAddress
    };

    const PartThreeProps = {
      ...SwapInfoHeaderProps,
      ...PaymentInfoProps,
      reference,
      provider,
      startOrderTimerSwap,
      stopOrderTimerSwap,
      startPollBityOrderStatus,
      startPollShapeshiftOrderStatus,
      stopPollBityOrderStatus,
      stopPollShapeshiftOrderStatus,
      showNotificationWithComponent,
      destinationAddress,
      outputTx,
      paymentId,
      xmrPaymentAddress
    };

    const SupportProps = {
      origin,
      destination,
      destinationAddress,
      paymentAddress,
      reference,
      provider,
      shapeshiftRates,
      bityRates
    };

    return (
      <TabSection isUnavailableOffline={true}>
        {authorized ? (
          <React.Fragment>
            <section className="Tab-content swap-tab">
              <Switch>
                <Route
                  exact={true}
                  path={`${currentPath}`}
                  render={() => (
                    <React.Fragment>
                      {step === 1 && <CurrentRates />}
                      {(step === 2 || step === 3) && <SwapInfoHeader {...SwapInfoHeaderProps} />}
                      <main className="Tab-content-pane">
                        {step === 1 && <CurrencySwap {...CurrencySwapProps} />}
                        {step === 2 && <ReceivingAddress {...ReceivingAddressProps} />}
                        {step === 3 && <PartThree {...PartThreeProps} />}
                      </main>
                    </React.Fragment>
                  )}
                />
                <RouteNotFound />
              </Switch>
            </section>
            <SupportFooter {...SupportProps} />)
          </React.Fragment>
        ) : (
          <section className="Tab-content">
            <section className="Tab-content-pane">
              Aenean id metus id velit ullamcorper pulvinar. Praesent vitae arcu tempor neque
              lacinia pretium. Cras elementum. In sem justo, commodo ut, suscipit at, pharetra
              vitae, orci. Fusce consectetuer risus a nunc. Aliquam erat volutpat. Cum sociis
              natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras
              elementum. In rutrum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam
              sapien sem, ornare ac, nonummy non, lobortis a enim. Aliquam erat volutpat.
              <button
                className="btn btn-primary"
                style={{ marginTop: '2rem' }}
                disabled={authorizing}
                onClick={this.sendUserToAuthorize}
              >
                Authorize with ShapeShift
              </button>
              {authorizing && <p>Attempting to authorize with ShapeShift...</p>}
            </section>
          </section>
        )}
      </TabSection>
    );
  }

  private setAuthorized = (authorized: boolean) => this.setState({ authorized });

  private setAuthorizing = (authorizing: boolean) => this.setState({ authorizing });

  private sendUserToAuthorize = () => {
    shapeshift.sendUserToAuthorize();
    this.pollForAccessTokenAvailable();
  };

  private requestAccessToken = async () => {
    await shapeshift.requestAccessToken();
    return window.close();
  };

  private pollForAccessTokenAvailable = () => {
    this.pollingForAccessTokenAvailable = setInterval(this.checkAccessTokenAvailable, 100);
    this.setAuthorizing(true);
  };

  private pollForAccessTokenStillAvailable = () =>
    (this.pollingForAccessTokenStillAvailable = setInterval(
      this.checkAccessTokenStillAvailable,
      500
    ));

  private checkAccessTokenAvailable = () => {
    const { showNotification } = this.props;

    if (shapeshift.hasToken()) {
      clearInterval(this.pollingForAccessTokenAvailable as NodeJS.Timer);
      showNotification('info', 'Successfully authorized with ShapeShift.');
      this.setAuthorizing(false);
      this.setAuthorized(true);
      this.pollForAccessTokenStillAvailable();
    }
  };

  private checkAccessTokenStillAvailable = () => {
    const { showNotification } = this.props;

    if (!shapeshift.hasToken()) {
      clearInterval(this.pollingForAccessTokenStillAvailable as NodeJS.Timer);
      showNotification('danger', 'Lost ShapeShift access token. Please reauthorize.');
      this.setAuthorized(false);
    }
  };
}

function mapStateToProps(state: AppState) {
  return {
    step: state.swap.step,
    origin: state.swap.origin,
    destination: state.swap.destination,
    bityRates: state.swap.bityRates,
    shapeshiftRates: state.swap.shapeshiftRates,
    provider: state.swap.provider,
    options: state.swap.options,
    bityOrder: state.swap.bityOrder,
    shapeshiftOrder: state.swap.shapeshiftOrder,
    destinationAddress: state.swap.destinationAddress,
    isFetchingRates: state.swap.isFetchingRates,
    secondsRemaining: state.swap.secondsRemaining,
    outputTx: state.swap.outputTx,
    isPostingOrder: state.swap.isPostingOrder,
    bityOrderStatus: state.swap.bityOrderStatus,
    shapeshiftOrderStatus: state.swap.shapeshiftOrderStatus,
    paymentAddress: state.swap.paymentAddress,
    paymentId: state.swap.paymentId,
    xmrPaymentAddress: state.swap.xmrPaymentAddress,
    isOffline: configMetaSelectors.getOffline(state)
  };
}

export default connect(mapStateToProps, {
  changeStepSwap: swapActions.changeStepSwap,
  initSwap: swapActions.initSwap,
  bityOrderCreateRequestedSwap: swapActions.bityOrderCreateRequestedSwap,
  shapeshiftOrderCreateRequestedSwap: swapActions.shapeshiftOrderCreateRequestedSwap,
  destinationAddressSwap: swapActions.destinationAddressSwap,
  restartSwap: swapActions.restartSwap,
  startOrderTimerSwap: swapActions.startOrderTimerSwap,
  startPollBityOrderStatus: swapActions.startPollBityOrderStatus,
  startPollShapeshiftOrderStatus: swapActions.startPollShapeshiftOrderStatus,
  stopLoadBityRatesSwap: swapActions.stopLoadBityRatesSwap,
  stopLoadShapeshiftRatesSwap: swapActions.stopLoadShapeshiftRatesSwap,
  stopOrderTimerSwap: swapActions.stopOrderTimerSwap,
  stopPollBityOrderStatus: swapActions.stopPollBityOrderStatus,
  stopPollShapeshiftOrderStatus: swapActions.stopPollShapeshiftOrderStatus,
  showNotification: notificationsActions.showNotification,
  showNotificationWithComponent: notificationsActions.showNotificationWithComponent,
  swapProvider: swapActions.changeSwapProvider
})(Swap);
