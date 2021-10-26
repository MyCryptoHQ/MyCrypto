import { Text } from '@components/NewTypography';
import { translateRaw } from '@translations';

export const EnsSubHead = () => (
  <Text mb={0} color="GREY">
    {translateRaw('ENS_ACTION_SUBHEAD')}
  </Text>
);
