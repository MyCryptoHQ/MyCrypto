import React from 'react';
import OnboardSlide from './OnboardSlide';

const SecureSlideOne = () => {
  const links = {
    EAL:
      'https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn',
    MetaMask: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    Cryptonite:
      'https://chrome.google.com/webstore/detail/cryptonite-by-metacert/keghdcpemohlojlglbiegihkljkgnige',
    MyEtherWallet:
      'https://chrome.google.com/webstore/detail/myetherwallet-cx/nlbmnnijcnlegkjjpcfjclmcfggfefdm',
    AdBlocker:
      'https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=en'
  };
  const content = (
    <ul>
      <li>
        Install <a href={links.EAL}>EAL</a> or <a href={links.MetaMask}> MetaMask </a>
        or <a href={links.Cryptonite}>Cryptonite by Metacert </a>
        or the <a href={links.MyEtherWallet}> MyEtherWallet Chrome Extension </a>
        to block malicious websites.
      </li>
      <li>
        Always check the URL: <strong>{'https://www.myetherwallet.com'}</strong>.
      </li>
      <li>
        Always make sure the URL bar has <strong>MYETHERWALLET LLC [US]</strong> in green.
      </li>
      <li>
        Do not trust messages or links sent to you randomly via email, Slack, Reddit, Twitter, etc.
      </li>
      <li>
        Always navigate directly to a site before you enter information. Do not enter information
        after clicking a link from a message or email.
      </li>
      <li>
        <a href={links.AdBlocker}>Install an AdBlocker </a>
        and do not click ads on your search engine (e.g. Google).
      </li>
    </ul>
  );
  return <OnboardSlide header="How To Protect Yourself from Phishers" content={content} />;
};
export default SecureSlideOne;
