import { ReactNode } from 'react';

import { Text } from '@components/NewTypography';

export const GeneralSubHead = ({ content }: { content: ReactNode }) => (
  <Text mb={0} color="GREY">
    {content}
  </Text>
);
