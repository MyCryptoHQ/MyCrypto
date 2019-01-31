import React from 'react';

import { DesktopHeader, MobileHeader } from './components';
import './Header.scss';

interface Props {
  networkParam: string | null;
}

export default function Header({ networkParam }: Props) {
  return (
    <>
      <section className="mobile-only-header">
        <MobileHeader networkParam={networkParam} />
      </section>
      <section className="desktop-only-header">
        <DesktopHeader networkParam={networkParam} />
      </section>
    </>
  );
}
