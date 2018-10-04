import React from 'react';

import node from 'assets/images/icn-node.svg';

export default function AddCustomNode() {
  return (
    <section className="SidebarScreen">
      <section className="SidebarScreen-image">
        <img src={node} alt="Node cartoon" />
      </section>
      <h1 className="SidebarScreen-heading">Add Custom Node</h1>
      <p className="SidebarScreen-text">
        Your node must be HTTPS in order to connect to it via MyCrypto.com. You can download the
        MyCrypto repo & run it locally to connect to any node. Or, get free SSL certificate via
        LetsEncrypt
      </p>
    </section>
  );
}
