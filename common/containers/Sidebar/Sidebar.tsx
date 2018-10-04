import React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { sidebarActions } from 'features/sidebar';
import backArrow from 'assets/images/back-arrow.svg';
import { AddCustomNode, SelectNetworkAndNode } from './components';
import './Sidebar.scss';

interface SidebarScreens {
  [screen: string]: () => JSX.Element;
}

const screens: SidebarScreens = {
  addCustomNode: AddCustomNode,
  selectNetworkAndNode: SelectNetworkAndNode
};

interface Props {
  close: sidebarActions.TCloseSidebar;
}

function Sidebar({ close }: Props) {
  const Screen = screens.selectNetworkAndNode;
  // const Screen = screens.addCustomNode;

  return (
    <section className="Sidebar">
      <section className="Sidebar-controls">
        <button onClick={close}>
          <img src={backArrow} alt="Close sidebar" />
        </button>
      </section>
      <Screen />
    </section>
  );
}

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = {
  close: sidebarActions.closeSidebar
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
