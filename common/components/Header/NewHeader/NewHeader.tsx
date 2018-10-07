import React from 'react';

import { DesktopHeader, MobileHeader } from './components';
import './NewHeader.scss';

export default function NewHeader() {
  return (
    <React.Fragment>
      <section className="mobile-only-header">
        <MobileHeader />
      </section>
      <section className="desktop-only-header">
        <DesktopHeader />
      </section>
    </React.Fragment>
  );
}
