import React from 'react';
import OnboardSlide from './OnboardSlide';

const WhyMewSlide = () => {
  const links = {
    Coinbase: 'https://coinbase.com',
    Blockchain: 'https://blockchain.com',
    hardwareWallet:
      'https://myetherwallet.github.io/knowledge-base/hardware-wallets/hardware-wallet-recommendations.html'
  };
  const content = (
    <ul>
      <li>Because that is the point of decentralization and the blockchain.</li>
      <li>
        You don't have to rely on your bank, government, or anyone else when you want to move your
        funds.
      </li>
      <li>
        You don't have to rely on the security of an exchange or bank to keep your funds safe.
      </li>
      <li>
        If you don't find these things valuable, ask yourself why you think the blockchain and
        cryptocurrencies are valuable. 😉
      </li>
      <li>
        If you don't like the sound of this, consider using <a href={links.Coinbase}>Coinbase </a>{' '}
        or<a href={links.Blockchain}> Blockchain.info</a>. They have more familiar accounts with
        usernames &amp; passwords.
      </li>
      <li>
        If you are scared but want to use MEW,{' '}
        <a href={links.hardwareWallet}>get a hardware wallet! </a>These keep your keys secure.
      </li>
    </ul>
  );
  return (
    <OnboardSlide
      header="If MyEtherWallet can't do those things, what's the point?"
      content={content}
    />
  );
};
export default WhyMewSlide;
