import React, { Component } from 'react';

import { ShapeShiftService } from 'v2/services';
import ShapeShift from './ShapeShift';
import { SHAPESHIFT_AUTHORIZATION_CHECK_RATE } from './constants';
import './ShapeShift.scss';

// Legacy
import TabSection from 'containers/TabSection';

export default class ShapeShiftAuthorization extends Component {
  public state = {
    authorized: ShapeShiftService.instance.isAuthorized(),
    authorizationWindowOpened: false
  };

  private checkingForAuthorization: NodeJS.Timer | null = null;

  public componentDidMount() {
    this.startCheckingForAuthorization();
  }

  public componentWillUnmount() {
    this.stopCheckingForAuthorization();
  }

  public render() {
    const { authorized, authorizationWindowOpened } = this.state;

    return authorized ? (
      <ShapeShift />
    ) : (
      <TabSection>
        <section className="ShapeShift">
          <section className="Tab-content-pane">
            <form className="ShapeShiftWidget">
              <fieldset className="dark">
                <p>
                  {authorizationWindowOpened
                    ? "Please complete ShapeShift's authorization process in the new window."
                    : 'You need to authorize with ShapeShift.'}
                </p>
              </fieldset>
              <fieldset>
                {authorizationWindowOpened ? (
                  <button
                    type="button"
                    className="btn ShapeShiftWidget-button"
                    onClick={this.reset}
                  >
                    Reset
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn ShapeShiftWidget-button"
                    onClick={this.attemptToAuthorize}
                    disabled={authorizationWindowOpened}
                  >
                    Authorize
                  </button>
                )}
              </fieldset>
            </form>
          </section>
        </section>
      </TabSection>
    );
  }

  private attemptToAuthorize = () => {
    this.setState({ authorizationWindowOpened: true });

    ShapeShiftService.instance.openAuthorizationWindow();
  };

  private reset = () => {
    this.setState({
      authorized: ShapeShiftService.instance.isAuthorized(),
      authorizationWindowOpened: false
    });
  };

  private startCheckingForAuthorization = () =>
    (this.checkingForAuthorization = setInterval(
      this.checkForAuthorization,
      SHAPESHIFT_AUTHORIZATION_CHECK_RATE
    ));

  private stopCheckingForAuthorization = () =>
    clearInterval(this.checkingForAuthorization as NodeJS.Timer);

  private checkForAuthorization = () => {
    const { authorized: storedAuthorized } = this.state;

    ShapeShiftService.instance.authorize();

    const authorized = ShapeShiftService.instance.isAuthorized();

    if (storedAuthorized !== authorized) {
      this.setState({
        authorized
      });
    }
  };
}
