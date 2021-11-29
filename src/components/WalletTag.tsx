import { WalletTags } from '@mycrypto/wallet-list';

import { Body, Box, Icon } from '@components';
import { getWalletTag } from '@config';

export const WalletTag = ({ tag }: { tag: WalletTags }) => {
  const tagConfig = getWalletTag(tag);

  return (
    <Box variant="rowCenter" m="15px">
      <Icon type={tagConfig.icon} width="16px" color="PURPLE" mr="5px" />
      <Body color="PURPLE" fontSize="14px" mb="0">
        {tagConfig.text}
      </Body>
    </Box>
  );
};
