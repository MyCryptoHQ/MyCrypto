import React from 'react';
import onboardIconFour from 'assets/images/onboarding_icon-04.svg';

interface Props {
  setOnboardStatus(slideNumber: number): void;
}

const BlockchainSlide: React.SFC<Props> = ({ setOnboardStatus }) => {
  return (
    <article className="onboarding__modal">
      <h3 className="onboarding__title">
        {/* translate="ONBOARD_blockchain_title" */}
        Wait, WTF is a Blockchain?
      </h3>
      <section className="row row--flex">
        <div className="col-xs-12 col-sm-8 onboarding__content">
          <ul>
            <li>
              {/* translate="ONBOARD_blockchain_content__1" */}
              The blockchain is like a huge, global, decentralized spreadsheet.
            </li>
            <li>
              {/* translate="ONBOARD_blockchain_content__2" */}
              It keeps track of who sent how many coins to whom, and what the balance of every
              account is.
            </li>
            <li>
              {/* translate="ONBOARD_blockchain_content__3" */}
              It is stored and maintained by thousands of people (miners) across the globe who have
              special computers.
            </li>
            <li>
              {/* translate="ONBOARD_blockchain_content__4" */}
              It is made up of all the individual transactions sent from MyEtherWallet, MetaMask,
              Exodus, Mist, Geth, Parity, and everywhere else.
            </li>
            <li>
              {/* translate="ONBOARD_blockchain_content__5" */}
              When you see your balance on MyEtherWallet.com or view your transactions on
              [etherscan.io](https://etherscan.io), you are seeing data on the blockchain, not in
              our personal systems.
            </li>
            <li>
              {/* translate="ONBOARD_blockchain_content__6" */}
              Again: <strong>we are not a bank</strong>.
            </li>
          </ul>
        </div>
        <div className="col-xs-12 col-sm-4 onboarding__image">
          <img src={onboardIconFour} width="100%" height="auto" />
        </div>
      </section>
      <div className="onboarding__buttons">
        <a onClick={() => setOnboardStatus(3)} className="btn btn-default">
          <span>
            {/* translate="ONBOARD_interface_title__alt" */}
            MEW is an Interface
          </span>
        </a>
        <a onClick={() => setOnboardStatus(5)} className="btn btn-primary">
          <span>
            {/* translate="ONBOARD_why_title__alt" */}
            But...why does this matter?
          </span>
        </a>
      </div>
    </article>
  );
};
export default BlockchainSlide;
