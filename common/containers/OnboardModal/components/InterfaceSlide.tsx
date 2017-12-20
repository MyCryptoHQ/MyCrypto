import React from 'react';
import OnboardSlide from './OnboardSlide';

const InterfaceSlide = () => {
  const content = (
    <ul>
      <li>
        {/* translate="ONBOARD_interface_content__1" */}
        When you create an account here, you are generating an cryptographic set of numbers: your
        private key and your public key (address).
      </li>
      <li>
        {/* translate="ONBOARD_interface_content__2" */}
        The handling of your keys happens entirely on your computer, inside your browser.
      </li>
      <li>
        {/* translate="ONBOARD_interface_content__3" */}
        We never transmit, receive or store your private key, password, or other account
        information.
      </li>
      <li>
        {/* translate="ONBOARD_interface_content__4" */}
        We do not charge a transaction fee.
      </li>
      <li>
        {/* translate="ONBOARD_interface_content__5" */}
        You are just using our **interface** to interact **directly with the blockchain**.
      </li>
      <li>
        {/* translate="ONBOARD_interface_content__6" */}
        If you send your *public key (address)* to someone, they can send you ETH or tokens. 👍
      </li>
      <li>
        {/* translate="ONBOARD_interface_content__7" */}
        If you send your *private key* to someone, they now have full control of your account. 👎
      </li>
    </ul>
  );
  return (
    <OnboardSlide
      /* translate="ONBOARD_interface_title" */
      header="MyEtherWallet is not a Bank"
      content={content}
    />
  );
};
export default InterfaceSlide;
