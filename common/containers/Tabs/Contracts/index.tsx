import translate from 'translations';
import { Interact } from './components/Interact';
import { Deploy } from './components/Deploy';
import './index.scss';
import { reset, TReset } from 'actions/transaction';
import { resetWallet, TResetWallet } from 'actions/wallet';
import TabSection from 'containers/TabSection';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';

interface Props {
  reset: TReset;
  resetWallet: TResetWallet;
}

const tabs = [
  {
    path: 'interact',
    name: translate('Interact')
  },
  {
    path: 'deploy',
    name: translate('Deploy')
  }
];

class Contracts extends Component<Props & RouteComponentProps<{}>> {
  public render() {
    const currentPath = this.props.match.url;

    return (
      <TabSection isUnavailableOffline={true}>
        <div className="SubTabs-tabs col-sm-8">
          {tabs.map((t, i) => (
            // Same as normal Link, but knows when it's active, and applies activeClassName
            <NavLink
              className="SubTabs-tabs-link"
              activeClassName="is-active"
              to={currentPath + '/' + t.path}
              key={i}
            >
              {t.name}
            </NavLink>
          ))}
        </div>
        <section className="Tab-content Contracts">
          <div className="Contracts-content">
            <Switch>
              <Route
                exact={true}
                path={currentPath}
                render={() => <Redirect from={`${currentPath}`} to={`${currentPath}/interact`} />}
              />
              <Route path={`${currentPath}/interact`} component={Interact} />
              <Route path={`${currentPath}/deploy`} component={Deploy} />
            </Switch>
          </div>
        </section>
      </TabSection>
    );
  }
}

export default connect(null, { reset, resetWallet })(Contracts);
