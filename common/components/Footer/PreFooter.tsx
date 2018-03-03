import React from 'react';
import './PreFooter.scss';

interface Props {
  openModal(): void;
}

const PreFooter: React.SFC<Props> = ({ openModal }) => {
  return (
    <section className="pre-footer">
      <div className="container">
        <p>
          MyCrypto.com does not hold your keys for you. We cannot access accounts, recover keys,
          reset passwords, nor reverse transactions. Protect your keys & always check that you are
          on the correct URL. <a onClick={openModal}>You are responsible for your security.</a>
        </p>
      </div>
    </section>
  );
};

export default PreFooter;
