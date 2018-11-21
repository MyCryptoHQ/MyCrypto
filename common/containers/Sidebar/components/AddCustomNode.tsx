import React from 'react';

import { translateRaw } from 'translations';
import node from 'assets/images/icn-node.svg';

export default function AddCustomNode() {
  return (
    <section className="SidebarScreen">
      <section className="SidebarScreen-image">
        <img src={node} alt="Node cartoon" />
      </section>
      <h1 className="SidebarScreen-heading">{translateRaw('NEW_SIDEBAR_TEXT_4')}</h1>
      <p className="SidebarScreen-text">{translateRaw('NEW_SIDEBAR_TEXT_5')}</p>
    </section>
  );
}
