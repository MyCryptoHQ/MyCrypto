import { ClassAttributes, HTMLAttributes, useMemo } from 'react';

import { Typography } from '@mycrypto/ui';
import makeBlockie from 'ethereum-blockies-base64';
import styled from 'styled-components';

// We need Typography to set the appropriate em size, but without its extra negative space
const TypographyWrapper = styled(Typography)`
  line-height: 0;
  margin: 0;
`;

const RoundedImage = styled.img`
  border-radius: 50%;
  height: 2.5em;
`;

// @todo Use new UI library instead
export const Identicon = ({
  address,
  ...rest
}: { address: string } & Omit<
  ClassAttributes<HTMLParagraphElement> &
    HTMLAttributes<HTMLParagraphElement> & { muted?: boolean },
  'ref'
>) => {
  const blockie = useMemo(() => makeBlockie(address), [address]);
  return (
    <TypographyWrapper {...rest}>
      <RoundedImage src={blockie} />
    </TypographyWrapper>
  );
};

export default Identicon;
