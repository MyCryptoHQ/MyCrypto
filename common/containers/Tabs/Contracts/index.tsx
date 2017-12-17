import React, { Component } from 'react';
import { Interact } from './components/Interact';
import { Deploy } from './components/Deploy';
import './index.scss';
import { reset, TReset } from 'actions/transaction';
import { resetWallet, TResetWallet } from 'actions/wallet';
import TabSection from 'containers/TabSection';
import SubTabs, { Tab } from 'components/SubTabs';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

interface State {
  activeTab: string;
}

interface DispatchProps {
  reset: TReset;
  resetWallet: TResetWallet;
}

type Props = DispatchProps & RouteComponentProps<any>;

class Contracts extends Component<Props, State> {
  public render() {
    const { location } = this.props;
    const activeTab = location.pathname.split('/')[2];

    const InteractTab: Tab = {
      path: 'interact',
      name: 'Contract Interact',
      render() {
        return (
          <main className="Tab-content-pane" role="main">
            <Interact />
          </main>
        );
      }
    };

    const DeployTab: Tab = {
      path: 'deploy',
      name: 'Deploy Contract',
      render() {
        return (
          <main className="Tab-content-pane" role="main">
            <Deploy />
          </main>
        );
      }
    };

    const tabs: Tab[] = [InteractTab, DeployTab];

    return (
      <TabSection>
        <section className="Tab-content Contracts">
          <SubTabs
            root="contracts"
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={this.resetStateOnTabChange}
          />
        </section>
      </TabSection>
    );
  }
  private resetStateOnTabChange = () => {
    this.props.reset();
    this.props.resetWallet();
  };
}

export default connect(null, { reset, resetWallet })(Contracts);
