import React from 'react';
import OnboardSlide from './OnboardSlide';

const WhyMewSlide = () => {
  const content = (
    <ul>
      <li>
        {/* translate="ONBOARD_whymew_content__1" */}
        Because that is the point of decentralization and the blockchain.
      </li>
      <li>
        {/* translate="ONBOARD_whymew_content__2" */}
        You don't have to rely on your bank, government, or anyone else when you want to move your
        funds.
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
        If you don't like the sound of this, consider using [Coinbase](https://www.coinbase.com/) or
        [Blockchain.info](https://blockchain.info/wallet/#/signup). They have more familiar accounts
        with usernames &amp; passwords.
      </li>
      <li>
        {/* translate="ONBOARD_whymew_content__6" */}
        If you are scared but want to use MEW, [get a hardware
        wallet](https://myetherwallet.github.io/knowledge-base/hardware-wallets/hardware-wallet-recommendations.html)!
        These keep your keys secure.
      </li>
    </ul>
  );
  return (
    <OnboardSlide
      /* translate="ONBOARD_whymew_title" */
      header="If MyEtherWallet can't do those things, what's the point?"
      content={content}
    />
  );
};
export default WhyMewSlide;
