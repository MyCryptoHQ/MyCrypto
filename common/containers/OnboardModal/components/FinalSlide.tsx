import React from 'react';
import { Link } from 'react-router-dom';
import onboardIconTen from 'assets/images/onboarding_icon-10.svg';

const FinalSlide = ({ closeModal }) => {
  return (
    <article className="onboarding__modal" ng-show="showOnboardSlide==10">
      <h3 className="onboarding__title">
        {/* translate="ONBOARD_final_title" */}
        Alright, I'm done lecturing you!
      </h3>
      <p className="text-center">
        {/* translate="ONBOARD_final_subtitle" */}
        Sorry for being like this. Onwards!
      </p>
      <br />
      <section className="row row--flex">
        <div className="col-xs-12 col-sm-4 col-xs-12 col-sm-offset-1">
          <img src={onboardIconTen} width="100%" height="auto" />
        </div>
        <div className="col-xs-12 col-sm-7">
          <ul>
            <li>
              <a
                href="https://myetherwallet.github.io/knowledge-base/hardware-wallets/hardware-wallet-recommendations.html"
                target="_blank"
                rel="noopener noreferrer"
                className="strong"
              >
                {/* translate="ONBOARD_final_content__2" */}
                Get a hardware wallet
              </a>
            </li>
            <li>
              <a
                href="https://myetherwallet.github.io/knowledge-base/migration/moving-from-private-key-to-metamask.html"
                target="_blank"
                rel="noopener noreferrer"
                className="strong"
              >
                {/* translate="ONBOARD_final_content__3" */}
                How to Set up MEW + MetaMask
              </a>
            </li>
            <li>
              <a
                href="https://myetherwallet.github.io/knowledge-base/offline/running-myetherwallet-locally.html"
                target="_blank"
                rel="noopener noreferrer"
                className="strong"
              >
                {/* translate="ONBOARD_final_content__4" */}
                How to Run MEW Offline / Locally
              </a>
            </li>
            <li>
              <a
                href="https://myetherwallet.github.io/knowledge-base/migration/moving-from-private-key-to-ledger-hardware-wallet.html"
                target="_blank"
                rel="noopener noreferrer"
                className="strong"
              >
                {/* translate="ONBOARD_final_content__5" */}
                How to Send via Ledger hardware wallet
              </a>
            </li>
            <li>
              <a
                href="https://myetherwallet.github.io/knowledge-base/hardware-wallets/trezor-sending-to-trezor-device.html"
                target="_blank"
                rel="noopener noreferrer"
                className="strong"
              >
                {/* translate="ONBOARD_final_content__6" */}
                How to Send via TREZOR hardware wallet
              </a>
            </li>
            <li>
              <a
                href="https://myetherwallet.github.io/knowledge-base/migration/moving-from-private-key-to-metamask.html"
                target="_blank"
                rel="noopener noreferrer"
                className="strong"
              >
                {/* translate="ONBOARD_final_content__7" */}
                How to Send via MetaMask
              </a>
            </li>
            <li>
              <a
                href="https://myetherwallet.github.io/knowledge-base/"
                target="_blank"
                rel="noopener noreferrer"
                className="strong"
              >
                {/* translate="ONBOARD_final_content__8" */}
                Learn More or Contact Us
              </a>
            </li>
            <li>
              <Link onClick={closeModal} to="/send-transaction" className="strong">
                {/* translate="ONBOARD_final_content__9" */}
                <span>OMG, please just let me send FFS.</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </article>
  );
};
export default FinalSlide;
