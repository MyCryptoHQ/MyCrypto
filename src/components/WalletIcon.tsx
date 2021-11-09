import { defaultWallet, IWallet } from '@mycrypto/wallet-list';

import { Box, Icon, Text, TIcon } from '@components';

export const WalletIcon = ({
  wallet,
  interfaceIcon
}: {
  wallet: IWallet;
  interfaceIcon?: TIcon;
}) => (
  <Box
    display="flex"
    width="132px"
    height="132px"
    variant="columnCenter"
    borderRadius="50%"
    boxShadow="0px 3px 6px rgba(0, 0, 0, 0.07);"
  >
    <img width="60px" src={wallet.icon ?? defaultWallet} />
    <Text fontWeight={700} mt="10px">
      {wallet.name}
    </Text>
    {interfaceIcon && (
      <Box>
        <Icon type={interfaceIcon} />
      </Box>
    )}
  </Box>
);
