import React, { Component } from 'react';
import translate from 'translations';
import SignMessage from './components/SignMessage';
import VerifyMessage from './components/VerifyMessage';
import TabSection from 'containers/TabSection';
import './index.scss';
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router';
import SubTabs from 'components/SubTabs';
import { RouteNotFound } from 'components/RouteNotFound';

interface State {
  activeTab: 'sign' | 'verify';
}

export default class SignAndVerifyMessage extends Component<RouteComponentProps<{}>, State> {
  public state: State = {
    activeTab: 'sign'
  };

  public changeTab = (activeTab: State['activeTab']) => () => this.setState({ activeTab });

  public render() {
    const { match } = this.props;
    const currentPath = match.url;

    const tabs = [
      {
        path: 'sign',
        name: translate('Sign')
      },
      {
        path: 'verify',
        name: translate('Verify')
      }
    ];

    return (
      <TabSection>
        <section className="Tab-content SignAndVerifyMsg">
          <SubTabs tabs={tabs} match={match} />
          <Switch>
            <Route
              exact={true}
              path={currentPath}
              render={() => <Redirect from={`${currentPath}`} to={`${currentPath}/sign`} />}
            />
            <Route exact={true} path={`${currentPath}/sign`} component={SignMessage} />
            <Route exact={true} path={`${currentPath}/verify`} component={VerifyMessage} />
            <RouteNotFound />
          </Switch>
        </section>
      </TabSection>
    );
  }
}
