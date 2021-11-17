import { IWallet } from '@mycrypto/wallet-list';

import { Body, Box, Button, Heading, LinkApp, WalletIcon, WalletTag } from '@components';
import { translateRaw } from '@translations';

import { getMigrationGuide } from '../config';

const Migrate = ({ walletInfos }: { walletInfos: IWallet }) => {
  const config = getMigrationGuide(walletInfos)!;

  return (
    <Box p="2.5em" variant="columnAlign">
      <Box display="flex" variant="columnCenter">
        <WalletIcon wallet={walletInfos} />
        <Box variant="rowCenter">
          {walletInfos.tags && walletInfos.tags.map((tag, i) => <WalletTag tag={tag} key={i} />)}
        </Box>
      </Box>
      <Heading fontSize="32px" textAlign="center" fontWeight="bold">
        {translateRaw('MIGRATE_HEADING', { $exchange: walletInfos.name })}
      </Heading>
      <Body textAlign="center" fontSize="18px" paddingTop="16px">
        {config.subheading}
      </Body>
      <Box width="420px" mb="30px">
        <LinkApp href={config.topButton.to} variant="barren">
          <Button fullwidth={true}>{config.topButton.text}</Button>
        </LinkApp>
      </Box>
      <Box backgroundColor="BG_GRAY" width="100%" py="32px" px="70px" variant="columnCenter">
        <Heading fontSize="24px" fontWeight="bold" color="GREYISH_BROWN">
          {translateRaw('MIGRATE_HOW_TO_TRANSFER')}
        </Heading>
        {config.steps.map((step, i) => (
          <Box key={i} variant="rowAlign" my="15px" width="100%">
            <Body fontSize="41px" color="PURPLE" fontWeight="bold" mr="20px">
              {`0${i + 1}`}
            </Body>
            <Body>{step}</Body>
          </Box>
        ))}
        <LinkApp href={config.primaryButton.to} variant="barren" width="100%">
          <Button fullwidth={true}>{config.primaryButton.text}</Button>
        </LinkApp>
        <LinkApp href={config.secondaryButton.to} variant="barren" width="100%">
          <Button fullwidth={true} colorScheme="inverted">
            {config.secondaryButton.text}
          </Button>
        </LinkApp>
        {walletInfos.urls.support && (
          <Body mt="15px">
            {translateRaw('MIGRATE_GET_HELP_TEXT')}{' '}
            <LinkApp isExternal={true} href={walletInfos.urls.support}>
              {translateRaw('MIGRATE_GET_HELP_LINK', { $exchange: walletInfos.name })}
            </LinkApp>
          </Body>
        )}
      </Box>
    </Box>
  );
};

export default Migrate;
