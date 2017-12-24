import { NewTabLink } from 'components/ui';
import React from 'react';
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

export default ENSTitle;
