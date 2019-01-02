import React from 'react';

import { GetStartedPanel } from './components';
import './Home.scss';

export default function Home() {
  return (
    <section className="Home">
      <section className="Home-copy">
        <h1>Awesome Sales Copy</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
      </section>
      <section className="Home-getStarted">
        <GetStartedPanel />
      </section>
    </section>
  );
}
