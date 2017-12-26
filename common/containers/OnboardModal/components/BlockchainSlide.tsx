import React from 'react';
import OnboardSlide from './OnboardSlide';

const BlockchainSlide = () => {
  const links = {
    etherscan: 'https://etherscan.io'
  };
  const content = (
    <ul>
      <li>The blockchain is like a huge, global, decentralized spreadsheet.</li>
      <li>
        It keeps track of who sent how many coins to whom, and what the balance of every account is.
      </li>
      <li>
        It is stored and maintained by thousands of people (miners) across the globe who have
        special computers.
      </li>
      <li>
        It is made up of all the individual transactions sent from MyEtherWallet, MetaMask, Exodus,
        Mist, Geth, Parity, and everywhere else.
      </li>
      <li>
        When you see your balance on MyEtherWallet.com or view your transactions on
        <a href={links.etherscan}> etherscan.io </a>, you are seeing data on the blockchain, not in
        our personal systems.
      </li>
      <li>
        Again: <strong>we are not a bank</strong>.
      </li>
    </ul>
  );
  return <OnboardSlide header="Wait, WTF is a Blockchain?" content={content} />;
};
export default BlockchainSlide;
