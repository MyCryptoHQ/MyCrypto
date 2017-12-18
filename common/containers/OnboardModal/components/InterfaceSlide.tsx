import React from 'react';
import onboardIconThree from 'assets/images/onboarding_icon-03.svg';

interface Props {
  setOnboardStatus(slideNumber: number): void;
}

const InterfaceSlide: React.SFC<Props> = ({ setOnboardStatus }) => {
  return (
    <article className="onboarding__modal">
      <h3 className="onboarding__title">
        {/* translate="ONBOARD_interface_title" */}
        MyEtherWallet is an Interface
      </h3>
      <section className="row row--flex">
        <div className="col-xs-12 col-sm-4 onboarding__image">
          <img src={onboardIconThree} width="100%" height="auto" />
        </div>
        <div className="col-xs-12 col-sm-8 onboarding__content">
          <ul>
            <li>
              {/* translate="ONBOARD_interface_content__1" */}
              When you create an account here, you are generating an cryptographic set of numbers:
              your private key and your public key (address).
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
              If you send your *public key (address)* to someone, they can send you ETH or tokens.
              👍
            </li>
            <li>
              {/* translate="ONBOARD_interface_content__7" */}
              If you send your *private key* to someone, they now have full control of your account.
              👎
            </li>
          </ul>
        </div>
      </section>
      <div className="onboarding__buttons">
        <a onClick={() => setOnboardStatus(2)} className="btn btn-default">
          <span>
            {/* translate="ONBOARD_bank_title__alt" */}
            MEW isn't a Bank
          </span>
        </a>
        <a onClick={() => setOnboardStatus(4)} className="btn btn-primary">
          <span>
            {/* translate="ONBOARD_blockchain_title__alt" */}
            WTF is a Blockchain?
          </span>
        </a>
      </div>
      <p
        onClick={() => setOnboardStatus(5)}
        className="text-right small"
        style={{ cursor: 'pointer' }}
      >
        <span>
          {/* translate="ONBOARD_blockchain_skip" */}
          I already know what a blockchain is...
        </span>
      </p>
    </article>
  );
};
export default InterfaceSlide;
