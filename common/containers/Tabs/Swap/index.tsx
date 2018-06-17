import React, { Component } from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { merge } from 'lodash';

import { AppState } from 'features/reducers';
import { getOffline } from 'features/config';
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
      outputTx
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
        <SupportFooter {...SupportProps} />
      </TabSection>
    );
  }
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
    isOffline: getOffline(state)
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
