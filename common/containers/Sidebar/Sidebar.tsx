import React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { sidebarActions, sidebarSelectors } from 'features/sidebar';
import closeIcon from 'assets/images/exit.svg';
import { AddCustomNode, SelectLanguage, SelectNetworkAndNode } from './components';
import './Sidebar.scss';

const screens: any = {
  addCustomNode: AddCustomNode,
  selectNetworkAndNode: SelectNetworkAndNode,
  selectLanguage: SelectLanguage
};

interface Props {
  close: sidebarActions.TCloseSidebar;
  screen: ReturnType<typeof sidebarSelectors.getSidebarScreen>;
  style: { [declaration: string]: string | number };
}

function Sidebar({ close, screen, style }: Props) {
  const Screen = screens[screen];

  return (
    <section className="Sidebar" style={style}>
      <section className="Sidebar-controls">
        <button onClick={close}>
          <img src={closeIcon} alt="Close sidebar" />
        </button>
      </section>
      <Screen />
    </section>
  );
}

const mapStateToProps = (state: AppState) => ({
  screen: sidebarSelectors.getSidebarScreen(state)
});

const mapDispatchToProps = {
  close: sidebarActions.closeSidebar
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
