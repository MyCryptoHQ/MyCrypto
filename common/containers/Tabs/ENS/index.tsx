import React from 'react';
import { GeneralInfoPanel } from './components/GeneralInfoPanel';
import UnfinishedBanner from './components/UnfinishedBanner';
import TabSection from 'containers/TabSection';
import { Route, Switch, RouteComponentProps } from 'react-router';
import { RouteNotFound } from 'components/RouteNotFound';
import { NewTabLink } from 'components/ui';
import translate from 'translations';

const ENSDocsLink = () => (
  <NewTabLink
    href="http://ens.readthedocs.io/en/latest/introduction.html"
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

class ENSClass extends React.Component<RouteComponentProps<{}>> {
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
                  <UnfinishedBanner />
                  <ENSTitle />
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

export default ENSClass;
