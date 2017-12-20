import React from 'react';
import OnboardSlide from './OnboardSlide';

const SecureSlideOne = () => {
  const content = (
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
        Do not trust messages or links sent to you randomly via email, Slack, Reddit, Twitter, etc.
      </li>
      <li>
        {/* translate="ONBOARD_secure_1_content__6" */}
        Always navigate directly to a site before you enter information. Do not enter information
        after clicking a link from a message or email.
      </li>
      <li>
        {/* translate="ONBOARD_secure_1_content__7" */}
        [Install an
        AdBlocker](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=en)
        and do not click ads on your search engine (e.g. Google).
      </li>
    </ul>
  );
  return (
    <OnboardSlide
      /* translate="ONBOARD_secure_1_title" */
      header="How To Protect Yourself from Phishers"
      content={content}
    />
  );
};
export default SecureSlideOne;
