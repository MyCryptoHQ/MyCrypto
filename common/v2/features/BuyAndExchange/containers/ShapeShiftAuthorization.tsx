import React, { Component } from 'react';

import { ShapeShiftService } from 'v2/services';
import ShapeShift from './ShapeShift';
import './ShapeShift.scss';

// Legacy
import TabSection from 'containers/TabSection';

export default class ShapeShiftAuthorization extends Component {
  public state = {
    authorized: ShapeShiftService.instance.isAuthorized(),
    authorizationWindowOpened: false
  };

  public componentDidMount() {
    const { authorized } = this.state;

    if (authorized) {
      this.authorize();
    }
  }

  public componentWillUnmount() {
    ShapeShiftService.instance.stopListeningForAuthorization();
    ShapeShiftService.instance.stopListeningForDeauthorization();
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
              {authorizationWindowOpened && (
                <fieldset>
                  <button className="btn ShapeShiftWidget-button" onClick={this.reset}>
                    Reset
                  </button>
                </fieldset>
              )}
              <fieldset>
                <button
                  className="btn ShapeShiftWidget-button"
                  onClick={this.attemptToAuthorize}
                  disabled={authorizationWindowOpened}
                >
                  Authorize
                </button>
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
    ShapeShiftService.instance.listenForAuthorization(this.authorize);
  };

  private reset = () => {
    this.setState({
      authorized: ShapeShiftService.instance.isAuthorized(),
      authorizationWindowOpened: false
    });

    ShapeShiftService.instance.stopListeningForAuthorization();
  };

  private authorize = () => {
    ShapeShiftService.instance.listenForDeauthorization(this.reset);

    this.setState({ authorized: true });
  };
}
