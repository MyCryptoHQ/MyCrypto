import ConvertUnits from './components/ConvertUnits';

import TabSection from 'containers/TabSection';
import React, { Component } from 'react';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router';
import SubTabs from 'components/SubTabs';
import { RouteNotFound } from 'components/RouteNotFound';

const tabs = [
  {
    path: 'convert-units',
    name: 'Convert Ethereum Units'
  }
];

export default class Helpers extends Component<RouteComponentProps<{}>> {
  public render() {
    const { match, location, history } = this.props;
    const currentPath = match.url;

    return (
      <TabSection isUnavailableOffline={true}>
        <SubTabs tabs={tabs} match={match} location={location} history={history} />
        <section className="Tab-content">
          <div className="">
            <Switch>
              <Route
                exact={true}
                path={currentPath}
                render={() => (
                  <Redirect from={`${currentPath}`} to={`${currentPath}/convert-units`} />
                )}
              />
              <Route exact={true} path={`${currentPath}/convert-units`} component={ConvertUnits} />
              {/* <Route exact={true} path={`${currentPath}/deploy`} component={Deploy} /> */}
              <RouteNotFound />
            </Switch>
          </div>
        </section>
      </TabSection>
    );
  }
}
