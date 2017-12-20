import React from 'react';
import { Link } from 'react-router-dom';
import OnboardSlide from './OnboardSlide';
const FinalSlide = ({ closeModal }) => {
  const header = (
    <div>
      <span className="onboarding__title">
        {/* translate="ONBOARD_final_title" */}
        Alright, I'm done lecturing you!
      </span>
      <p className="text-center">
        {/* translate="ONBOARD_final_subtitle" */}
        Sorry for being like this. Onwards!
      </p>
      <br />
    </div>
  );

  const content = (
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
  );
  return <OnboardSlide header={header} content={content} />;
};
export default FinalSlide;
