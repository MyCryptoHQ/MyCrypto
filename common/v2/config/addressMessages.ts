import { toChecksumAddress } from 'ethereumjs-util';

export interface AddressMessage {
  msg: string;
  gasLimit?: number;
  data?: string;
  severity?: 'warning' | 'danger' | 'success' | 'info';
}

// MAKE SURE THE ADDRESS KEY IS EITHER LOWER CASED OR CHECKSUMMED.
export const ADDRESS_MESSAGES: { [key: string]: AddressMessage } = {
  '0xC33B16198DD9FB3bB342d8119694f94aDfcdca23': {
    gasLimit: 0,
    msg:
      'This address has been associated with an issue with the Ledger Chrome App. Do not send to this address. Monitor [their Twitter account](https://twitter.com/LedgerHQ) for updates.'
  },
  '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520': {
    msg: 'Thank you for donating to MyCrypto. TO THE MOON!'
  },
  '0x75aa7b0d02532f3833b66c7f0ad35376d373ddf8': {
    gasLimit: 300000,
    msg: 'Accord (ARD) ERC20 token sale - http://accordtoken.com'
  },
  '0x16b0e62ac13a2faed36d18bce2356d25ab3cfad3': {
    gasLimit: 200000,
    msg:
      "BTQ ICO ends February 1, 2018. btc btq is your exclusive bitcoin boutique and world's premier cryptocurrency lifestyle brand. https://thebtcbtq.com/btq"
  },
  '0xa9877b1e05d035899131dbd1e403825166d09f92': {
    gasLimit: 200000,
    msg: 'MNT Token Sale - http://mnt.coinjoker.com'
  },
  '0xef6b4ce8c9bc83744fbcde2657b32ec18790458a': {
    gasLimit: 930000,
    msg: 'PUC Token Sale - http://price-s.info'
  },
  '0x13f11c9905a08ca76e3e853be63d4f0944326c72': {
    gasLimit: 300000,
    data: '0xb4427263',
    msg: 'DIVX Token Sale - www.diviproject.org'
  },
  '0x4b0712de9b75bc68a566215acca876ea5e55c172': {
    gasLimit: 114293,
    msg: 'NOX Token Sale'
  },
  '0xf5dffdeaea54bb56156b47de1c7b4346c7dba69c': {
    gasLimit: 180000,
    msg: 'GEE Token Sale'
  },
  '0xc88c7e1aebd89187d13bd42e1ff814d32f492bf6': {
    gasLimit: 250000,
    msg:
      'STORM token sale: gamified micro-tasks - Earn anywhere, anytime, from any device. https://www.stormtoken.com, NOV 7, 2017'
  },
  '0xdd64ef0c8a41d8a17f09ce2279d79b3397184a10': {
    gasLimit: 200000,
    msg:
      'RVL token sale: PRE-ICO SUPER SALE, SHARING ECONOMY PIATTAFORM,  https://www.R-EVOLUTIONCOIN.COM.com, DIC 15, 2017'
  },
  ' 0xea0c348a297084bffbddad7f89216f24a2106e58': {
    gasLimit: 300000,
    msg:
      'Aigang token sale contract. Autonomous insurance network - fully automated insurance for IoT devices and a platform for insurance innovation built around data: https://aigang.network . Ends 12/15/2017'
  },
  '0x17681500757628c7aa56d7e6546e119f94dd9479': {
    gasLimit: 170000,
    msg:
      'Confideal token sale. Confideal is a platform for making deals. https://confideal.io, ends Jan 31, 2018'
  },
  '0x5454af9d2ba75a60fa5b0419c251810544cea21d': {
    gasLimit: 200000,
    msg: 'WeBetCrypto ICO Sale. Thank you for your support!'
  },
  '0x882448f83d90b2bf477af2ea79327fdea1335d93': {
    gasLimit: 200000,
    msg: 'Vibehub ICO Sale. Thank you for your support!'
  },
  '0xdea6d29da64bba5ab86a7424ca894756e7ae8ed3': {
    gasLimit: 200000,
    msg: 'Trade.io ICO Sale. Thank you for your support!'
  },
  '0xaf518d65f84e4695a4da0450ec02c1248f56b668': {
    gasLimit: 200000,
    msg: 'Substratum Network ICO Sale. Thank you for your support!'
  },
  '0x0f33bb20a282a7649c7b3aff644f084a9348e933': {
    gasLimit: 400000,
    msg: 'YUPIE (YUPIE) ICO'
  },
  '0xbd2ed3e85faa3433c068c7b3f9c8c7d839ce88d7': {
    gasLimit: 69153,
    msg: 'Horizon State Token Sale. Thank you for your support. '
  },
  '0x8aec8f09a840faea966f4b0e29a497d8f5b5a6b4': {
    gasLimit: 200000,
    msg: 'DataBrokerDAO. https://databrokerdao.com'
  },
  '0xeaaf270436a0ed397ed23bbf64df7b1dcaff142f': {
    gasLimit: 85000,
    msg: 'BattleDrome ICO/Crowdsale. Thanks for your support!'
  },
  '0x58b7056deb51ed292614f0da1e94e7e9c589828d': {
    gasLimit: 150000,
    msg: 'Simple Token — the cryptocurrency that powers digital communities.'
  },
  '0x5fb3d432bae33fcd418ede263d98d7440e7fa3ea': {
    gasLimit: 200000,
    msg: 'SunContract ICO address - suncontract.org'
  },
  '0xd88755197e107603c139df6e709ed09eec6b6bb3': {
    gasLimit: 200000,
    msg: 'NVC Fund'
  },
  '0x2a8a7afa955d8616e2e60e454e5a9c6b6c0a60fc': {
    gasLimit: 200000,
    msg: 'OHNI ICO. Restoration of our communities!'
  },
  '0xf9f0fc7167c311dd2f1e21e9204f87eba9012fb2': {
    gasLimit: 200000,
    msg: 'Easy Homes ICO. Thank you!'
  },
  '0x7fc408011165760ee31be2bf20daf450356692af': {
    gasLimit: 200000,
    msg: 'Mitrav ICO Sale. Thank you for your support!'
  },
  '0xa5dd8cde486436f0cfd62652952e1fcec5a61cae': {
    gasLimit: 300000,
    msg: 'WinBitcoin ICO Sale. Thank you for your support!'
  },
  '0x19d7a9ad3b49252fd2ef640d0e43dfd651168499': {
    gasLimit: 100000,
    msg: 'BMChain ICO - Platform of digital reputation - Official site https://bmchain.io'
  },
  '0xafe60511341a37488de25bef351952562e31fcc1': {
    gasLimit: 200000,
    msg: 'Tbot ICO Sale.'
  },
  '0xe386b139ed3715ca4b18fd52671bdcea1cdfe4b1': {
    gasLimit: 200000,
    msg:
      'Zeus Exchange - The First Hybrid Trading Platform for Traditional Stock Investors and Crypto Traders. Official site https://zeus.exchange'
  },
  '0xb70835d7822ebb9426b56543e391846c107bd32c': {
    gasLimit: 200000,
    msg: 'Game Token Sale'
  },
  '0x5f53f7a8075614b699baad0bc2c899f4bad8fbbf': {
    gasLimit: 200000,
    msg: 'Rebellious Token'
  },
  '0xd5e3036d5ce7ec222379d16f6ffc38c38c55bf7f': {
    gasLimit: 200000,
    msg:
      'Ethereum High HIG is a robust and feather-light cryptocurrency designed to hedge the risk of your portfolio'
  },
  '0x2a3aa9eca41e720ed46b5a70d6c37efa47f768ac': {
    gasLimit: 200000,
    msg: 'REAL CHAIN TOKEN!'
  },
  '0x7705faa34b16eb6d77dfc7812be2367ba6b0248e': {
    gasLimit: 200000,
    msg: 'Artex - Art Provenance Blockchain. Official site https://artex.global'
  },
  '0x29afa3443f752eb29d814d9042fd88a4a2dc0f1e': {
    gasLimit: 200000,
    msg: 'SIRIN LABS official crowdsale address. Official website https://sirinlabs.com'
  },
  '0xa671f2914ba0e73979ffc47cd350801d1714b18f': {
    gasLimit: 150000,
    msg: 'TRV Ongoing Sale.'
  },
  '0xdee3bfae40ac2ae9c69ebf30ecaf67a499a9dd5e': {
    gasLimit: 150000,
    msg: 'The World News Pre-ICO.'
  },
  '0x92685e93956537c25bb75d5d47fca4266dd628b8': {
    gasLimit: 200000,
    msg: 'Bitlle Token. Official website https://bitlle.com'
  },
  '0x2097175d0abb8258f2468e3487f8db776e29d076': {
    gasLimit: 200000,
    msg: 'LiveEdu EDU token sale. Official website: https://tokensale.liveedu.tv/'
  },
  '0x4f8b6ca78711207e1b281db63e8d6eaa1ce2f63e': {
    gasLimit: 230000,
    msg: 'HEdpAY (Hdp.ф) sale. Official sale website: https://ibiginvestments.com/hedpay'
  }
};

export function getAddressMessage(address: string): AddressMessage | undefined {
  const lowerAddr = address.toLowerCase();
  const checksumAddr = toChecksumAddress(address);
  return ADDRESS_MESSAGES[lowerAddr] || ADDRESS_MESSAGES[checksumAddr];
}
