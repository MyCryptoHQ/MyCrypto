// @flow
import * as React from 'react';

const ENSDocsLink = () =>
  <a
    href="http://ens.readthedocs.io/en/latest/introduction.html"
    target="_blank"
    rel="noopener"
  >
    Ethereum Name Service
  </a>;

const ENSTitle = () =>
  <article className="cont-md">
    <h1 className="text-center" translate="NAV_ENS">
      ENS
    </h1>
    <p>
      The <ENSDocsLink /> is a distributed, open, and extensible naming system
      based on the Ethereum blockchain. Once you have a name, you can tell your
      friends to send ETH to <code>mewtopia.eth</code> instead of
      <code>0x7cB57B5A97eAbe942.....</code>.
    </p>
  </article>;

export default ENSTitle;
