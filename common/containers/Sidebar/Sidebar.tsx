import React from 'react';
import { connect } from 'react-redux';

import { sidebarActions } from 'features/sidebar';
import backArrow from 'assets/images/back-arrow.svg';
import { AddCustomNode, SelectLanguage, SelectNetworkAndNode } from './components';
import './Sidebar.scss';

const screens: any = {
  addCustomNode: AddCustomNode,
  selectNetworkAndNode: SelectNetworkAndNode,
  selectLanguage: SelectLanguage
};

interface Props {
  close: sidebarActions.TCloseSidebar;
}

function Sidebar({ close }: Props) {
  // const Screen = screens.selectNetworkAndNode;
  const Screen = screens.selectLanguage;

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

const mapDispatchToProps = {
  close: sidebarActions.closeSidebar
};

export default connect(null, mapDispatchToProps)(Sidebar);
