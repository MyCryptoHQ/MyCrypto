import React from 'react';

import './Layout.scss';

// Legacy
import { makeAutoNodeName } from 'libs/nodes';
import { Query } from 'components/renderCbs';
import NewHeader from 'components/Header/NewHeader/NewHeader';
import NewFooter from 'components/Footer/NewFooter/NewFooter';

interface Props {
  children: any;
}

export default function Layout({ children }: Props) {
  return (
    <main className="Layout">
      <Query
        params={['network']}
        withQuery={({ network }) => (
          <NewHeader networkParam={network && makeAutoNodeName(network)} />
        )}
      />
      <div className="Layout-content">{children}</div>
      <NewFooter />
    </main>
  );
}
