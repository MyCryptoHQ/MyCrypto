import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import queryString from 'query-string';

import { ROUTE_PATHS } from 'v2/config';
import { BuyAndExchangeOption } from './components';
import { BUY_AND_EXCHANGE_ERROR_DISPLAY_DURATION } from './constants';
import './BuyAndExchange.scss';

// Legacy
import shapeshiftLogo from 'assets/images/logo-shapeshift-no-text.svg';
import zeroExLogo from 'assets/images/logo-zeroex.png';
import TabSection from 'v2/containers';
import { Warning } from 'v2/components';

interface State {
  error: string | null;
}

export class BuyAndExchange extends Component<RouteComponentProps<any>> {
  public state: State = {
    error: null
  };

  private errorDisplayTimeout: NodeJS.Timer | null = null;

  public componentDidMount() {
    const { error } = queryString.parse(window.location.search);

    if (error) {
      if (error === 'shapeshift') {
        this.displayError('An error occurred with ShapeShift. Please try again.');
      }
    }
  }

  public componentWillUnmount() {
    clearTimeout(this.errorDisplayTimeout as NodeJS.Timer);
  }

  public render() {
    const { error } = this.state;

    return (
      <TabSection>
        <section className="Tab-content">
          <section className="Tab-content-pane">
            <h1 className="BuyAndExchange-title">Buy & Exchange Digital Assets</h1>
            <p className="BuyAndExchange-subtitle">Choose the provider that's right for you</p>
            {error && (
              <section className="BuyAndExchange-error">
                <Warning>{error}</Warning>
              </section>
            )}
            <section className="BuyAndExchange">
              <BuyAndExchangeOption
                option="ShapeShift"
                logo={shapeshiftLogo}
                route={ROUTE_PATHS.SWAP_SHAPESHIFT.path}
              >
                A platform that gives you the power to quickly swap between assets in a seamless,
                safe, and secure environment.
              </BuyAndExchangeOption>
              <BuyAndExchangeOption option="0x Instant" logo={zeroExLogo} route="/swap/0x">
                Quick and secure token purchasing.
              </BuyAndExchangeOption>
            </section>
          </section>
        </section>
      </TabSection>
    );
  }

  private displayError = (error: string) =>
    this.setState(
      { error },
      () =>
        (this.errorDisplayTimeout = setTimeout(
          this.hideError,
          BUY_AND_EXCHANGE_ERROR_DISPLAY_DURATION
        ))
    );

  private hideError = () => {
    const { history } = this.props;

    history.replace(ROUTE_PATHS.SWAP.path);

    this.setState({ error: null });
  };
}

export default withRouter(BuyAndExchange);
