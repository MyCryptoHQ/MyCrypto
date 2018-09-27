import React from 'react';

import './DonateAndSubscribe.scss';

function DonationButton({ title, ...rest }) {
  return (
    <button className="DonationButton" {...rest}>
      {title}
    </button>
  );
}

function Donate() {
  return (
    <section className="Donate">
      <h2>Donate</h2>
      <DonationButton title="Ethereum" />
      <DonationButton title="Bitcoin" />
    </section>
  );
}

function Subscribe() {
  return (
    <section className="Subscribe">
      <h2>Subscribe to MyCrypto</h2>
      <p>Get updates from MyCrypto straight to your inbox!</p>
      <section className="Subscribe-input">
        <input type="email" placeholder="Email address" />
        <button>Get Updates</button>
      </section>
    </section>
  );
}

export default function DonateAndSubscribe() {
  return (
    <section className="DonateAndSubscribe">
      <Donate />
      <Subscribe />
    </section>
  );
}
