import React from 'react';
import { UnitConverter, HexConverter, KeccakConverter, ENSDebugger } from './components';
import TabSection from 'containers/TabSection';
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router';
import SubTabs from 'components/SubTabs';
import { RouteNotFound } from 'components/RouteNotFound';

import './index.scss';

interface State {
  activeTab: 'unit-converter' | 'hex-converter' | 'keccak-converter';
}

export default class Helpers extends React.Component<RouteComponentProps<{}>, State> {
  public changeTab = (activeTab: State['activeTab']) => () => this.setState({ activeTab });

  public render() {
    const { match, location, history } = this.props;
    const currentPath = match.url;

    const tabs = [
      {
        path: 'unit-converter',
        name: 'Unit Converter & Reference'
      },
      {
        path: 'hex-converter',
        name: 'Hex Converter'
      },
      {
        path: 'keccak-converter',
        name: 'SHA3'
      },
      {
        path: 'ens-debugger',
        name: 'ENS Debugger'
      }
    ];

    return (
      <TabSection isUnavailableOffline={true}>
        <div className="Tab-content">
          <section className="Tab-content Helpers">
            <SubTabs tabs={tabs} match={match} location={location} history={history} />
            <Switch>
              <Route
                exact={true}
                path={currentPath}
                render={() => (
                  <Redirect from={`${currentPath}`} to={`${currentPath}/unit-converter`} />
                )}
              />
              <Route
                exact={true}
                path={`${currentPath}/unit-converter`}
                component={UnitConverter}
              />

              <Route exact={true} path={`${currentPath}/hex-converter`} component={HexConverter} />

              <Route
                exact={true}
                path={`${currentPath}/keccak-converter`}
                component={KeccakConverter}
              />

              <Route exact={true} path={`${currentPath}/ens-debugger`} component={ENSDebugger} />
              <RouteNotFound />
            </Switch>
          </section>
        </div>
      </TabSection>
    );
  }
}
