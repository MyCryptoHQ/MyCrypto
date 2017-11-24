import React from 'react';
import { OnlyUnlocked } from 'components/renderCbs';
import { BalanceSidebar } from 'components';

const content = (
  <section className="col-sm-4">
    <BalanceSidebar />
  </section>
);

export const SideBar: React.SFC<{}> = () => (
  <OnlyUnlocked whenUnlocked={content} />
);
