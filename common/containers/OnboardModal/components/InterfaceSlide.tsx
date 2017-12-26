import React from 'react';
import OnboardSlide from './OnboardSlide';

const InterfaceSlide = () => {
  const content = (
    <ul>
      <li>
        When you create an account here, you are generating an cryptographic set of numbers: your
        private key and your public key (address).
      </li>
      <li>The handling of your keys happens entirely on your computer, inside your browser.</li>
      <li>
        We never transmit, receive or store your private key, password, or other account
        information.
      </li>
      <li>We do not charge a transaction fee.</li>
      <li>
        You are just using our <strong>interface</strong> to interact{' '}
        <strong>directly with the blockchain</strong>.
      </li>
      <li>
        If you send your <strong>public key (address)</strong> to someone, they can send you ETH or
        tokens. 👍
      </li>
      <li>
        If you send your <strong>private key</strong> to someone, they now have full control of your
        account. 👎
      </li>
    </ul>
  );
  return <OnboardSlide header="MyEtherWallet is not a Bank" content={content} />;
};
export default InterfaceSlide;
