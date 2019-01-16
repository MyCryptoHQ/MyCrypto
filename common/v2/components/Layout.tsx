import React from 'react';
import classnames from 'classnames';

import './Layout.scss';

// Legacy
import { makeAutoNodeName } from 'libs/nodes';
import { Query } from 'components/renderCbs';
import NewHeader from 'components/Header/NewHeader/NewHeader';
import NewFooter from 'components/Footer/NewFooter/NewFooter';

interface Props {
  centered?: boolean;
  children: any;
}

export default function Layout({ centered, children }: Props) {
  const contentClassName = classnames('Layout-content', {
    centered
  });

  return (
    <main className="Layout">
      <Query
        params={['network']}
        withQuery={({ network }) => (
          <NewHeader networkParam={network && makeAutoNodeName(network)} />
        )}
      />
      <div className={contentClassName}>{children}</div>
      <NewFooter />
    </main>
  );
}
