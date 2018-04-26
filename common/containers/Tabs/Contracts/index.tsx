import translate from 'translations';
import { Interact } from './components/Interact';
import { Deploy } from './components/Deploy';
import {
  setAsContractInteraction,
  TSetAsContractInteraction,
  setAsViewAndSend,
  TSetAsViewAndSend
} from 'actions/transaction';

import TabSection from 'containers/TabSection';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router';
import SubTabs from 'components/SubTabs';
import { RouteNotFound } from 'components/RouteNotFound';

interface DispatchProps {
  setAsContractInteraction: TSetAsContractInteraction;
  setAsViewAndSend: TSetAsViewAndSend;
}

const tabs = [
  {
    path: 'interact',
    name: translate('CONTRACTS_INTERACT')
  },
  {
    path: 'deploy',
    name: translate('CONTRACTS_DEPLOY')
  }
];

class Contracts extends Component<DispatchProps & RouteComponentProps<{}>> {
  public componentDidMount() {
    this.props.setAsContractInteraction();
  }
  public componentWillUnmount() {
    this.props.setAsViewAndSend();
  }

  public render() {
    const { match, location, history } = this.props;
    const currentPath = match.url;

    return (
      <TabSection isUnavailableOffline={true}>
        <SubTabs tabs={tabs} match={match} location={location} history={history} />
        <section className="Tab-content Contracts">
          <div className="Contracts-content">
            <Switch>
              <Route
                exact={true}
                path={currentPath}
                render={() => <Redirect from={`${currentPath}`} to={`${currentPath}/interact`} />}
              />
              <Route exact={true} path={`${currentPath}/interact`} component={Interact} />
              <Route exact={true} path={`${currentPath}/deploy`} component={Deploy} />
              <RouteNotFound />
            </Switch>
          </div>
        </section>
      </TabSection>
    );
  }
}

export default connect(null, { setAsContractInteraction, setAsViewAndSend })(Contracts);
