import React from 'react';
import OnboardSlide from './OnboardSlide';
/* translate="ONBOARD_blockchain_title" */

const BlockchainSlide = () => {
  const content = (
    <ul>
      <li>
        {/* translate="ONBOARD_blockchain_content__1" */}
        The blockchain is like a huge, global, decentralized spreadsheet.
      </li>
      <li>
        {/* translate="ONBOARD_blockchain_content__2" */}
        It keeps track of who sent how many coins to whom, and what the balance of every account is.
      </li>
      <li>
        {/* translate="ONBOARD_blockchain_content__3" */}
        It is stored and maintained by thousands of people (miners) across the globe who have
        special computers.
      </li>
      <li>
        {/* translate="ONBOARD_blockchain_content__4" */}
        It is made up of all the individual transactions sent from MyEtherWallet, MetaMask, Exodus,
        Mist, Geth, Parity, and everywhere else.
      </li>
      <li>
        {/* translate="ONBOARD_blockchain_content__5" */}
        When you see your balance on MyEtherWallet.com or view your transactions on
        [etherscan.io](https://etherscan.io), you are seeing data on the blockchain, not in our
        personal systems.
      </li>
      <li>
        {/* translate="ONBOARD_blockchain_content__6" */}
        Again: <strong>we are not a bank</strong>.
      </li>
    </ul>
  );
  return <OnboardSlide header="Wait, WTF is a Blockchain?" content={content} />;
};
export default BlockchainSlide;
