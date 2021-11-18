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
    border="1px solid"
    borderColor="BG_GRAY"
    position="relative"
  >
    <img width="60px" src={wallet.icon ?? defaultWallet} />
    <Text fontWeight={700} mt="10px" width="69%" textAlign="center">
      {wallet.name}
    </Text>
    {interfaceIcon && (
      <Box
        position="absolute"
        p="5px"
        borderRadius="50%"
        width="50px"
        height="50px"
        border="1px solid"
        borderColor="BG_GRAY"
        boxShadow="0px 3px 6px rgba(0, 0, 0, 0.07);"
        bottom="-5px"
        right="-15px"
        backgroundColor="WHITE"
        data-testid="interface-icon"
      >
        <Icon type={interfaceIcon} />
      </Box>
    )}
  </Box>
);
