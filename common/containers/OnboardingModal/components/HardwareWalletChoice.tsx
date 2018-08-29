import React from 'react';

import './HardwareWalletChoice.scss';

interface Props {
  image: string;
  text: string;
}

export default function HardwareWalletChoice({ image, text }: Props) {
  return (
    <section className="HardwareWalletChoice">
      <section className="HardwareWalletChoice-image">
        <img src={image} alt={text} />
      </section>
      <section className="HardwareWalletChoice-text">
        <p>{text}</p>
      </section>
    </section>
  );
}
