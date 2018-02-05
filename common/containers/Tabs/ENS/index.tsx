import React from 'react';
import { GeneralInfoPanel, NameInput, NameResolve } from './components';
import TabSection from 'containers/TabSection';
import { Route, Switch, RouteComponentProps } from 'react-router';
import { RouteNotFound } from 'components/RouteNotFound';
import { NewTabLink } from 'components/ui';
import translate from 'translations';
import { connect } from 'react-redux';
import { resolveDomainRequested, TResolveDomainRequested } from 'actions/ens';
import { AppState } from 'reducers';

const ENSDocsLink = () => (
  <NewTabLink
    href="https://ens.readthedocs.io/en/latest/introduction.html"
    content="Ethereum Name Service"
  />
);

const ENSTitle = () => (
  <article className="cont-md">
    <h1 className="text-center">{translate('NAV_ENS')}</h1>
    <p>
      The <ENSDocsLink /> is a distributed, open, and extensible naming system based on the Ethereum
      blockchain. Once you have a name, you can tell your friends to send ETH to{' '}
      <code>mewtopia.eth</code> instead of
      <code>0x7cB57B5A97eAbe942.....</code>.
    </p>
  </article>
);

interface StateProps {
  ens: AppState['ens'];
}

interface DispatchProps {
  resolveDomainRequested: TResolveDomainRequested;
}

type Props = StateProps & DispatchProps;

class ENSClass extends React.Component<RouteComponentProps<any> & Props> {
  public render() {
    const { match } = this.props;
    const currentPath = match.url;
    return (
      <TabSection isUnavailableOffline={true}>
        <section className="container">
          <Switch>
            <Route
              exact={true}
              path={currentPath}
              render={() => (
                <section role="main" className="row">
                  <ENSTitle />
                  <NameInput resolveDomainRequested={this.props.resolveDomainRequested} />
                  <NameResolve {...this.props.ens} />
                  <GeneralInfoPanel />
                </section>
              )}
            />
            <RouteNotFound />
          </Switch>
        </section>
      </TabSection>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({ ens: state.ens });
const mapDispatchToProps: DispatchProps = { resolveDomainRequested };

export default connect(mapStateToProps, mapDispatchToProps)(ENSClass);
