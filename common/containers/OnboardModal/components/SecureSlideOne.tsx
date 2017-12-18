import React from 'react';
import onboardIconSeven from 'assets/images/onboarding_icon-07.svg';

interface Props {
  setOnboardStatus(slideNumber: number): void;
}

const SecureSlideOne: React.SFC<Props> = ({ setOnboardStatus }) => {
  return (
    <article className="onboarding__modal">
      <h3 className="onboarding__title">
        {/* translate="ONBOARD_secure_1_title" */}
        How To Protect Yourself from Phishers
      </h3>
      <p>
        {/* translate="ONBOARD_secure_1_content__1" */}
        Phishers send you a message with a link to a website that looks just like MyEtherWallet,
        EtherDelta, Paypal, or your bank, but is not the real website. They steal your information
        and then steal your money.
      </p>
      <section className="row row--flex">
        <div className="col-xs-12 col-sm-8 onboarding__content">
          <ul>
            <li>
              {/* translate="ONBOARD_secure_1_content__2" */}
              Install
              [EAL](https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn)
              or
              [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
              or [Cryptonite by
              Metacert](https://chrome.google.com/webstore/detail/cryptonite-by-metacert/keghdcpemohlojlglbiegihkljkgnige)
              or the [MyEtherWallet Chrome
              Extension](https://chrome.google.com/webstore/detail/myetherwallet-cx/nlbmnnijcnlegkjjpcfjclmcfggfefdm)
              to block malicious websites.
            </li>
            <li>
              {/* translate="ONBOARD_secure_1_content__3" */}
              Always check the URL: `https://www.myetherwallet.com`.
            </li>
            <li>
              {/* translate="ONBOARD_secure_1_content__4" */}
              Always make sure the URL bar has `MYETHERWALLET LLC [US]` in green.
            </li>
            <li>
              {/* translate="ONBOARD_secure_1_content__5" */}
              Do not trust messages or links sent to you randomly via email, Slack, Reddit, Twitter,
              etc.
            </li>
            <li>
              {/* translate="ONBOARD_secure_1_content__6" */}
              Always navigate directly to a site before you enter information. Do not enter
              information after clicking a link from a message or email.
            </li>
            <li>
              {/* translate="ONBOARD_secure_1_content__7" */}
              [Install an
              AdBlocker](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=en)
              and do not click ads on your search engine (e.g. Google).
            </li>
          </ul>
        </div>
        <div className="col-xs-12 col-sm-4 onboarding__image">
          <img src={onboardIconSeven} width="100%" height="auto" />
        </div>
      </section>
      <div className="onboarding__buttons">
        <a onClick={() => setOnboardStatus(6)} className="btn btn-default">
          <span>
            {/* translate="ONBOARD_point_title__alt_2" */}
            What's the point?
          </span>
        </a>
        <a onClick={() => setOnboardStatus(8)} className="btn btn-primary">
          <span>
            {/* translate="ONBOARD_secure_2_title" */}
            How To Protect Yourself from Scams
          </span>
        </a>
      </div>
    </article>
  );
};
export default SecureSlideOne;
