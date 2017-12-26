import React from 'react';
import './PreFooter.scss';

const PreFooter = () => {
  return (
    <section className="pre-footer">
      <div className="container">
        <p>
          MyEtherWallet.com does not hold your keys for you. We cannot access accounts, recover
          keys, reset passwords, nor reverse transactions. Protect your keys &amp; always check that
          you are on correct URL.
          <a href="#"> You are responsible for your security.</a>
        </p>
      </div>
    </section>
  );
};

export default PreFooter;
