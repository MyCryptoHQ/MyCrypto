import React from 'react';
import onboardIconSix from 'assets/images/onboarding_icon-06.svg';

interface Props {
  setOnboardStatus(slideNumber: number): void;
}

const WhyMewSlide: React.SFC<Props> = ({ setOnboardStatus }) => {
  return (
    <article className="onboarding__modal">
      <h3 className="onboarding__title">
        {/* translate="ONBOARD_whymew_title" */}
        If MyEtherWallet can't do those things, what's the point?
      </h3>
      <section className="row row--flex">
        <div className="col-xs-12 col-sm-4 onboarding__image">
          <img src={onboardIconSix} width="100%" height="auto" />
        </div>
        <div className="col-xs-12 col-sm-8 onboarding__content">
          <ul>
            <li>
              {/* translate="ONBOARD_whymew_content__1" */}
              Because that is the point of decentralization and the blockchain.
            </li>
            <li>
              {/* translate="ONBOARD_whymew_content__2" */}
              You don't have to rely on your bank, government, or anyone else when you want to move
              your funds.
            </li>
            <li>
              {/* translate="ONBOARD_whymew_content__3" */}
              You don't have to rely on the security of an exchange or bank to keep your funds safe.
            </li>
            <li>
              {/* translate="ONBOARD_whymew_content__4" */}
              If you don't find these things valuable, ask yourself why you think the blockchain and
              cryptocurrencies are valuable. 😉
            </li>
            <li>
              {/* translate="ONBOARD_whymew_content__5" */}
              If you don't like the sound of this, consider using
              [Coinbase](https://www.coinbase.com/) or
              [Blockchain.info](https://blockchain.info/wallet/#/signup). They have more familiar
              accounts with usernames &amp; passwords.
            </li>
            <li>
              {/* translate="ONBOARD_whymew_content__6" */}
              If you are scared but want to use MEW, [get a hardware
              wallet](https://myetherwallet.github.io/knowledge-base/hardware-wallets/hardware-wallet-recommendations.html)!
              These keep your keys secure.
            </li>
          </ul>
        </div>
      </section>
      <div className="onboarding__buttons">
        <a onClick={() => setOnboardStatus(5)} className="btn btn-default">
          <span>
            {/* translate="ONBOARD_why_title__alt" */}
            But...why?
          </span>
        </a>
        <a onClick={() => setOnboardStatus(7)} className="btn btn-primary">
          <span>
            {/* translate="ONBOARD_secure_title" */}
            How To Protect Yourself &amp; Your Funds
          </span>
        </a>
      </div>
    </article>
  );
};
export default WhyMewSlide;
