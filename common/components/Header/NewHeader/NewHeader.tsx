import React from 'react';

import { DesktopHeader, MobileHeader } from './components';
import './NewHeader.scss';

interface Props {
  networkParam: string | null;
}

export default function NewHeader({ networkParam }: Props) {
  return (
    <React.Fragment>
      <section className="mobile-only-header">
        <MobileHeader networkParam={networkParam} />
      </section>
      <section className="desktop-only-header">
        <DesktopHeader networkParam={networkParam} />
      </section>
    </React.Fragment>
  );
}
